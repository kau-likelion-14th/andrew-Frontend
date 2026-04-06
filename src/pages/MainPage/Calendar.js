import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';
import "../../styles/Calendar.css";

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export default function CustomCalendar({
    initialDate = new Date(),
    onDateChange,
    todosByDate = {},
}) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const handledDateChange = (value) => {
        const next = value instanceof Date ? value : value?.[0];
        setSelectedDate(next);
        onDateChange?.(next);
    };

    const getDayMeta = (date) => {
        const key = toDateKey(date);
        const list = todosByDate[key] ?? [];
        if (list.length === 0) return { hasTodos: false, remaining: 0, allDone: false };

        const remaining = list.filter((t) => !t.completed).length;
        return { hasTodos: true, remaining, allDone: remaining === 0 };
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange}
                value={selectedDate}
                calendarType='gregory'
                view='month'
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={true}
                formatDay={(locale, date) => String(date.getDate())}
                tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const { hasTodos, remaining, allDone } = getDayMeta(date);
                    if (!hasTodos) return null;

                    return (
                        <div className="tile-meta">
                            {allDone ? "★" : remaining}
                        </div>
                    );
                }}
                tileClassName={({ date, view }) => {
                    if (view !== 'month') return "";
                    const { hasTodos, allDone } = getDayMeta(date);
                    if (!hasTodos) return "";
                    return allDone ? "tile-done" : "tile-has";
                }}
            />
        </div>
    );
}