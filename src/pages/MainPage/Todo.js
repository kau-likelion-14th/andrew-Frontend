import React, { useEffect, useState } from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { del, get, patch, post, put } from "../../Api";
import config from "../../Config";

// RoutineModal의 요일 순서(월~일)와 백엔드 WeekEnum 값을 맞춥니다.
const WEEKS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const categoryColors = ["#E5F8F1", "#FFC8BE", "#B6DAFF", "#E9E7FF", "#FFE7F1"];

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Todo = ({ selectedDate, todosByDate, onTodosChange }) => {
    const dateKey = toDateKey(selectedDate);

    const todos = todosByDate[dateKey] ?? [];

    const [serverCategories, setServerCategories] = useState([]);
    const [categoryError, setCategoryError] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        let active = true;
        const fetchCategories = async () => {
            try {
                const response = await get(config.CATEGORIES.GET);
                if (response?.isSuccess === false || !Array.isArray(response?.result)) {
                    throw new Error("유효하지 않은 카테고리 응답입니다.");
                }
                if (active) setServerCategories(response.result);
            } catch (error) {
                console.error("카테고리 조회 실패:", error);
                if (active) setCategoryError("카테고리를 불러오지 못했습니다.");
            }
        };
        fetchCategories();
        return () => { active = false; };
    }, []);

    const categories = Object.fromEntries(serverCategories.map((category, index) => [
        category.categoryName,
        { backgroundColor: categoryColors[index % categoryColors.length], color: "#333" },
    ]));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const getErrorMessage = (error, fallback) =>
        error.response?.data?.message || error.message || fallback;

    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    // 목록 응답에는 루틴 정보가 없어서, 수정 모달을 열 때 상세 조회로 채웁니다.
    const openEditModal = async (todo) => {
        if (updating) return;
        setUpdating(true);
        try {
            const response = await get(config.TODOS.DETAIL(todo.id));
            const detail = response?.result;
            if (response?.isSuccess === false || !detail) {
                throw new Error("투두 상세 정보를 불러오지 못했습니다.");
            }
            const repeatIndex = WEEKS.indexOf(detail.week);
            setEditingTodo({
                ...todo,
                text: detail.description,
                category: detail.categoryName,
                routineEnabled: detail.routineEnabled,
                routine: detail.routineEnabled
                    ? {
                        startDate: detail.startDate || "",
                        endDate: detail.endDate || "",
                        repeatDays: repeatIndex >= 0 ? repeatIndex : null,
                    }
                    : null,
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("투두 상세 조회 실패:", error);
            alert(getErrorMessage(error, "투두 상세 정보를 불러오지 못했습니다."));
        } finally {
            setUpdating(false);
        }
    };

    const TodoCompleted = async (id) => {
        const todo = todos.find((item) => item.id === id);
        if (!todo || updating) return;

        setUpdating(true);
        try {
            const response = await patch(config.TODOS.TOGGLE_COMPLETE(id, dateKey), {
                completed: !todo.completed,
            });
            if (response?.isSuccess === false) {
                throw new Error(response.message || "완료 상태 변경에 실패했습니다.");
            }
            onTodosChange();
        } catch (error) {
            console.error("완료 상태 변경 실패:", error);
            alert(getErrorMessage(error, "완료 상태 변경에 실패했습니다."));
        } finally {
            setUpdating(false);
        }
    };

    const handledSaveTodo = async ({ text, category, routine }) => {
        if (updating) return;

        // 반복 요일을 고른 경우에만 루틴으로 저장합니다.
        const routineEnabled = routine?.repeatDays != null;
        if (routineEnabled && !routine.endDate) {
            alert("루틴의 종료 날짜를 선택해주세요.");
            return;
        }
        const startDate = routineEnabled ? (routine.startDate || dateKey) : null;
        if (routineEnabled && startDate > routine.endDate) {
            alert("루틴의 시작 날짜가 종료 날짜보다 늦습니다.");
            return;
        }

        const body = {
            categoryName: category,
            description: text,
            routineEnabled,
            startDate,
            endDate: routineEnabled ? routine.endDate : null,
            week: routineEnabled ? WEEKS[routine.repeatDays] : null,
        };

        setUpdating(true);
        try {
            const response = editingTodo
                ? await put(config.TODOS.UPDATE(editingTodo.id), body)
                : await post(config.TODOS.CREATE, body, { params: { date: dateKey } });
            if (response?.isSuccess === false) {
                throw new Error(response.message || "할 일 저장에 실패했습니다.");
            }
            setIsModalOpen(false);
            onTodosChange();
        } catch (error) {
            console.error("할 일 저장 실패:", error);
            alert(getErrorMessage(error, "할 일 저장에 실패했습니다."));
        } finally {
            setUpdating(false);
        }
    };

    const handledDeleteTodo = async () => {
        if (!editingTodo || updating) return;
        if (editingTodo.routineEnabled &&
            !window.confirm("루틴 할 일은 이 날짜의 할 일만 삭제됩니다. 삭제할까요?")) {
            return;
        }

        setUpdating(true);
        try {
            const response = await del(config.TODOS.DELETE(editingTodo.id, dateKey));
            if (response?.isSuccess === false) {
                throw new Error(response.message || "할 일 삭제에 실패했습니다.");
            }
            setIsModalOpen(false);
            onTodosChange();
        } catch (error) {
            console.error("할 일 삭제 실패:", error);
            alert(getErrorMessage(error, "할 일 삭제에 실패했습니다."));
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={openModal}>+</button>
            </div>
            {categoryError && <p role="alert">{categoryError}</p>}
            <div className="todo-list">
                {todos.map((t) => (
                    <div
                        key={t.id}
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                        onClick={() => openEditModal(t)}
                    >
                        <button
                            disabled={updating}
                            className={`checkbox ${t.completed ? 'checked' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                TodoCompleted(t.id);
                            }}
                        >
                        </button>
                        <div className="todo-text">{t.text}</div>
                        <div
                            className="todo-category"
                            style={categories[t.category]}
                        >
                            {t.category}
                        </div>
                    </div>
                ))}
            </div>
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handledSaveTodo}
                onDelete={handledDeleteTodo}
                initialTodo={editingTodo}
                categories={categories}
            />
        </div>
    );
};

export default Todo;