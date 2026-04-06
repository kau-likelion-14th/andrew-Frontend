import React, {useMemo, useState} from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";

const uid = () => Date.now() + Math.random();

const Categories = { // 카테고리별 디자인 설정 (배경색과 글자색)
    공부: { backgroundColor: '#E5F8F1', color: '#333' },
    운동: { backgroundColor: '#FFC8BE', color: '#333' },
    동아리: { backgroundColor: '#B6DAFF', color: '#333' },
};

    const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Todo = ({ selectedDate, todosByDate, setTodosByDate }) => {
    const dateKey = toDateKey(selectedDate);

    const todos = todosByDate[dateKey] ?? []; // 해당 날짜의 할 일 목록을 가져오되, 데이터가 없으면 빈 배열([])로 처리

    const setTodos = (updater) => {
        setTodosByDate((prev) => {
            const current = prev[dateKey] ?? []; // 현재 날짜의 할 일, ?? []를 붙여줌으로써, 데이터가 없는 날짜라도 **"일단 빈 상자([])를 하나 준비해줘"**라고 명령하는 것입니다. 덕분에 에러 없이 새 할 일을 그 상자에 담을 수 있
            const nextTodos = typeof updater === "function" ? updater(current) : updater; // 업데이트 방식이 함수면 실행하고, 아니면 값 그대로 사용
            return { ...prev, [dateKey]: nextTodos }; // 기존 데이터(...prev)는 유지하고, 현재 날짜의 데이터만 새것으로 교체
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달이 열렸는지 여부
    const [editingTodo, setEditingTodo] = useState(null); // 지금 수정 중인 할 일 정보 (새로 만들 때는 null)

    const openModal = () => { // [+] 버튼 눌렀을 때 (새로 만들기)
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (todo) => { // 이미 있는 할 일을 클릭했을 때 (수정하기)
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const TodoCompleted = (id) => { // 체크박스 클릭 시 완료 상태 토글 (true <-> false)
        setTodos((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    const handledSaveTodo = ({text, category}) => { // 저장 버튼 클릭 시 (수정 또는 추가)
        if (editingTodo) { // 1. 수정 모드일 때
            setTodos((prev) =>
                prev.map((t) => 
                    t.id === editingTodo.id 
                        ? { ...t, text, category } 
                        : t
                )
            );
        } else { // 2. 새로 추가 모드일 때
            setTodos((prev) => [
                  ...prev, // ← "기존에 있던 애들 다 데리고 와!" (복사)
                { id: uid(), text, category, completed: false },
            ]);
        }
        setIsModalOpen(false);
    };

    const handledDeleteTodo = () => { // 삭제 버튼 클릭 시
        if (!editingTodo) return;
        setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id));
        setIsModalOpen(false);
    };

    const counts = useMemo(() => { //통계 계산
        const total = todos.length; // 전체 개수
        const done = todos.filter((t) => t.completed).length; // 완료된 개수
        return { total, done };
    }, [todos]);

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={openModal}>+</button> 
            </div>
            <div className="todo-list">
                {todos.map((t) => (
                    <div 
                        key={t.id} 
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                        onClick={() => openEditModal(t)}
                    >
                        <button 
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
                            style={Categories[t.category]}
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
                categories={Categories}
            />
        </div>
    );
};

export default Todo;