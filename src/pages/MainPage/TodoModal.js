import React, { useEffect, useState } from "react";
import "../../styles/Todo.css";
import RoutineModal from "./RoutineModal";

const TodoModal = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialTodo,
    categories,
}) => {
    const isEditMode = Boolean(initialTodo);
    const categoryKeys = Object.keys(categories || {});

    const defaultCategory = categoryKeys[0] ?? "";

    const [category, setCategory] = useState(defaultCategory);
    const [text, setText] = useState("");
    const [routine, setRoutine] = useState(null);

    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setCategory(initialTodo?.category || defaultCategory);
        setText(initialTodo?.text || "");
        setRoutine(initialTodo?.routine || null);
    }, [isOpen, initialTodo, defaultCategory]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!text.trim() || !category) return;

        onSave({
            text: text.trim(),
            category,
            routine,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-title">
                    {isEditMode ? "할 일 수정하기" : "할 일 추가하기"}
                </div>
                <div className="modal-section">
                    <div className="modal-label">카테고리</div>
                    <div className="modal-categories">
                        {categoryKeys.length === 0 && <p>선택할 수 있는 카테고리가 없습니다.</p>}
                        {categoryKeys.map((c) => (
                            <label
                                key={c}
                                className={`modal-categoryitem ${category === c ? 'selected' : ''}`}
                            >
                                <span style={categories[c]}>{c}</span>
                                <input
                                    type="radio"
                                    name="category"
                                    value={c}
                                    checked={category === c}
                                    onChange={() => setCategory(c)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="modal-section">
                    <div className="modal-label">내용</div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="text-input"
                            placeholder="내용을 입력해주세요"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-section">
                    <button
                        type="button"
                        className="routine-row"
                        onClick={() => setIsRoutineModalOpen(true)}
                    >
                        <div className="routine-label">루틴 등록하기</div>
                        <div className="routine-button">{"›"}</div>
                    </button>
                </div>
                <div className="modal-actions">
                    <button
                        className={`leftbutton ${isEditMode ? '' : 'disabled'}`}
                        onClick={onDelete}
                        disabled={!isEditMode}
                    >
                        삭제
                    </button>
                    <button
                        className={`rightbutton ${text.trim() ? '' : 'disabled'}`}
                        onClick={handleSave}
                        disabled={!text.trim() || !category}
                    >
                        저장
                    </button>
                </div>
                <RoutineModal
                    isOpen={isRoutineModalOpen}
                    initialRoutine={routine}
                    onClose={() => setIsRoutineModalOpen(false)}
                    onSave={(newRoutine) => {
                        setRoutine(newRoutine);
                        setIsRoutineModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default TodoModal;