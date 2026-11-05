import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React from "react";
import "../../styles/Calendar.css";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function FriendCalendar({
  initialDate,
  onDateChange,
  onMonthChange,
  remainingByDate = {},
}) {
  const getDayMeta = (date) => {
    const day = remainingByDate[toDateKey(date)];

    return {
      hasTodos: day?.hasTodo === true,
      remaining: day?.remaining ?? 0,
      allDone: day?.hasTodo === true && day.remaining === 0,
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={(value) => onDateChange?.(value instanceof Date ? value : value?.[0])}
        onActiveStartDateChange={({ activeStartDate}) => onMonthChange?.(activeStartDate)}
        value={initialDate}
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date.getDate())}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;

          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";

          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}