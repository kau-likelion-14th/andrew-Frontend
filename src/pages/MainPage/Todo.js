import React, {useMemo, useState} from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";

const uid = () => Date.now() + Math.random();

const Categories = { 
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

    const todos = todosByDate[dateKey] ?? []; 

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

    const TodoCompleted = (id) => { 
        setTodos((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
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
                { id: uid(), text, category, completed: false },
            ]);
        }
        setIsModalOpen(false);
    };

    const handledDeleteTodo = () => { 
        if (!editingTodo) return;
        setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id));
        setIsModalOpen(false);
    };

    const counts = useMemo(() => { 
        const total = todos.length; 
        const done = todos.filter((t) => t.completed).length; 
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