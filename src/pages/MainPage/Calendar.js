import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';
import "../../styles/Calendar.css";

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CustomCalendar({
    initialDate = new Date(),
    onDateChange,
    onMonthChange,
    remainingByDate = {},
}) {
    const [activeStartDate, setActiveStartDate] = useState(
        new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
    );

    const handledDateChange = (value) => {
        const next = value instanceof Date ? value : value?.[0];
        if (!next) return;

        onDateChange?.(next);
    };

    const getDayMeta = (date) => {
        const key = toDateKey(date);

        const remaining = remainingByDate[key];
        return {
            hasTodos: remaining != null,
            remaining,
            allDone: remaining === 0,
        };
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange}
                value={initialDate}

                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate: nextDate }) => {
                    if (!nextDate) return;

                    setActiveStartDate(nextDate);
                    onMonthChange?.(nextDate);
                }}
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