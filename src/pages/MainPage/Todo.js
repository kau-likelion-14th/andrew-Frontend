import React, { useEffect, useState } from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { get, patch } from "../../Api";
import config from "../../Config";

const uid = () => Date.now() + Math.random();

const categoryColors = ["#E5F8F1", "#FFC8BE", "#B6DAFF", "#E9E7FF", "#FFE7F1"];

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Todo = ({ selectedDate, todosByDate, setTodosByDate, onCompletedChange }) => {
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

    // 기존 UI의 로컬 변경 기능입니다. 서버 저장 API는 이번 과제 범위에 포함하지 않습니다.
    const setTodos = (updater) => {
        setTodosByDate((prev) => {
            const current = prev[dateKey] ?? [];
            const nextTodos = typeof updater === "function" ? updater(current) : updater;
            return { ...prev, [dateKey]: nextTodos };
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const TodoCompleted = async (id) => {
        const todo = todos.find((item) => item.id === id);
        if (!todo || updating) return;
        if (todo.localOnly) {
            alert("화면에서만 추가한 할 일입니다. Swagger에서 생성한 할 일로 테스트해주세요.");
            return;
        }

        setUpdating(true);
        try {
            const response = await patch(config.TODOS.TOGGLE_COMPLETE(id, dateKey), {
                completed: !todo.completed,
            });
            if (response?.isSuccess === false) {
                throw new Error(response.message || "완료 상태 변경에 실패했습니다.");
            }
            onCompletedChange();
        } catch (error) {
            console.error("완료 상태 변경 실패:", error);
            alert(error.response?.data?.detail || error.response?.data?.message || error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handledSaveTodo = ({text, category}) => {
        if (editingTodo) {
            setTodos((prev) =>
                prev.map((t) =>
                    t.id === editingTodo.id
                        ? { ...t, text, category }
                        : t
                )
            );
        } else {
            setTodos((prev) => [
		            ...prev,
                { id: uid(), text, category, completed: false, localOnly: true },
            ]);
        }
        setIsModalOpen(false);
    };

    const handledDeleteTodo = () => {
        if (!editingTodo) return;
        setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id));
        setIsModalOpen(false);
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