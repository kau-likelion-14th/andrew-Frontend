import React, { useEffect, useState } from "react";
import "../../styles/Todo.css";

const Days = ["월", "화", "수", "목", "금", "토", "일"];

const RoutineModal = ({
    isOpen,
    onClose,
    onSave,
    initialRoutine,
}) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [repeatDays, setRepeatDays] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        setStartDate(initialRoutine?.startDate || "");
        setEndDate(initialRoutine?.endDate || "");
        setRepeatDays(initialRoutine?.repeatDays ?? null);
    }, [isOpen, initialRoutine]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            startDate,
            endDate,
            repeatDays,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="routine-header">
                    <div className="routine-close" onClick={onClose}>{"‹"}</div>
                    <div className="routine-title">루틴 등록하기</div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">시작 날짜</div>
                    <div className="date-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <div className="date-initial">{startDate || "없음"}</div>
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">종료 날짜</div>
                    <div className="date-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <div className="date-initial">{endDate || "없음"}</div>
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">반복</div>
                    <div className="modal-categories">
                        {Days.map((day, idx) => (
                            <label
                                key={day}
                                className={`modal-categoryitem ${repeatDays === idx ? "on" : ""}`}
                            >
                                <span>{day}</span>
                                <input
                                    type="radio"
                                    name="repeatDays"
                                    value={idx}
                                    checked={repeatDays === idx}
                                    onChange={() => setRepeatDays(idx)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="leftbutton2" onClick={onClose}>취소</button>
                    <button className="rightbutton" onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default RoutineModal;