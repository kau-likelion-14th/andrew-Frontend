import React, { useEffect, useState } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import { get } from "../../Api";
import config from "../../Config";
import "../../styles/MainPage.css";

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [todosByDate, setTodosByDate] = useState({});
  const [remainingByDate, setRemainingByDate] = useState({});
  const [calendarError, setCalendarError] = useState("");
  const [todoError, setTodoError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const dateKey = toDateKey(selectedDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  useEffect(() => {
    let active = true;
    setRemainingByDate({});
    setCalendarError("");

    const fetchCalendar = async () => {
      try {
        const response = await get(config.CALENDAR.GET, { year, month });
        if (response?.isSuccess === false || !Array.isArray(response?.result?.days)) {
          throw new Error("유효하지 않은 캘린더 응답입니다.");
        }
        const remaining = {};
        response.result.days.forEach((day) => {
          // Todo가 없는 날짜와 모두 완료한 날짜(remaining: 0)를 구분합니다.
          if (day.hasTodo) remaining[day.date] = day.remaining;
        });
        if (active) setRemainingByDate(remaining);
      } catch (error) {
        console.error("캘린더 조회 실패:", error);
        if (active) setCalendarError("캘린더를 불러오지 못했습니다.");
      }
    };

    fetchCalendar();
    return () => { active = false; };
  }, [year, month, refreshKey]);

  useEffect(() => {
    let active = true;
    setTodoError("");
    setTodosByDate((prev) => ({ ...prev, [dateKey]: [] }));

    const fetchTodos = async () => {
      try {
        const response = await get(config.TODOS.LIST, { date: dateKey });
        if (response?.isSuccess === false || !Array.isArray(response?.result)) {
          throw new Error("유효하지 않은 Todo 응답입니다.");
        }
        const todos = response.result.map((todo) => ({
          id: todo.todoId,
          text: todo.description,
          category: todo.categoryName,
          completed: todo.completed,
        }));
        if (active) setTodosByDate((prev) => ({ ...prev, [dateKey]: todos }));
      } catch (error) {
        console.error("Todo 조회 실패:", error);
        if (active) setTodoError("할 일을 불러오지 못했습니다.");
      }
    };

    fetchTodos();
    return () => { active = false; };
  }, [dateKey, refreshKey]);

  return (
    <div className="mainpage-container">
      {calendarError && <p role="alert">{calendarError}</p>}
      {todoError && <p role="alert">{todoError}</p>}
      <CustomCalendar
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        onMonthChange={setViewDate}
        remainingByDate={remainingByDate}
      />
      <Todo
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        setTodosByDate={setTodosByDate}
        onCompletedChange={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
};

export default MainPage;
