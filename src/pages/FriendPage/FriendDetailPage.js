import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Api";
import config from "../../Config";
import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function useFriendResource(url, params, validate, retry) {
  const [state, setState] = useState({ loading: true, error: "", value: null});
  const query = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setState({ loading: true, error: "", value: null });

    api.get(url, {params: JSON.parse(query), signal: controller.signal})
      .then(({data}) => {
        if(data?.isSuccess === false || !validate(data?.result)){
          throw new Error("잘못된 응답");
        }
        if(active){
          setState({loading: false, error: "", value: data.result});
        }
      })
      .catch(() =>{
        if(active){
          setState({loading: false, error:"데이터를 불러오지 못했습니다.", value: null})
        }
      });
      return () => {
        active = false;
        controller.abort();
      };
  }, [url, query, validate, retry]);
  return state;
}

const validProfile = (value) => typeof value?.username === "string";

const validTodos = (value) =>
  Array.isArray(value) &&
value.every((todo) => 
todo?.todoId != null &&
typeof todo.description === "string" &&
typeof todo.completed === "boolean");

const validCalendar = (value) =>
  Array.isArray(value?.days) &&
  value.days.every((day) =>
  typeof day?.date === "string" &&
  typeof day?.hasTodo === "boolean" &&
  Number.isFinite(day.remaining));

function ResourceStatus({ resource, onRetry }) {
  if (resource.loading) {
    return <p role="status">불러오는 중...</p>
  }
  if (resource.error){
    return (
      <div>
        <p role="alert">
          {resource.error}
        </p>
        <button onClick={onRetry}>다시 시도</button>
      </div>
    );
  }
  return null;
}

function FriendDetailPage() {
  const navigate = useNavigate();

  const {id} = useParams();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [retries, setRetries] = useState({profile: 0, todos:0, calendar:0});
  const retry = (key) => setRetries((prev) => ({...prev, [key]: prev[key] + 1}));

  const base = config.FOLLOW.PROFILE(id);
  const profile = useFriendResource(base, {}, validProfile, retries.profile);
  const todoResource = useFriendResource(
    config.FOLLOW.TODOS(id),
    { date: toDateKey(selectedDate) },
    validTodos,
    retries.todos
  );
  const calendar = useFriendResource(
    config.FOLLOW.CALENDAR(id),
    {year: viewDate.getFullYear(), month: viewDate.getMonth() + 1},
    validCalendar,
    retries.calendar
  );

  const friend = profile.value ? {
    name: profile.value.username.split("#")[0],
    bio: profile.value.introduction,
    profileImage: profile.value.profileImageUrl,
  }: null;

  const todos = (todoResource.value || []).map ((todo) => ({
    id: todo.todoId,
    text: todo.description,
    category: todo.categoryName,
    completed: todo.completed,
  }));

  const remainingByDate = Object.fromEntries(
    (calendar.value?.days || []).map((day) => [day.date, day])
  );

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        <div className="friend-detail-page__top">
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {friend?.profileImage ? (
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">
                  {friend?.name || " "}
                </span>
              </div>
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"}
              </div>
            </div>
          </div>
          <ResourceStatus resource={profile} onRetry={() => retry("profile")} />
        </div>
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <ResourceStatus resource={calendar} onRetry={() => retry("calendar")} />
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              onMonthChange={(date) => {
                if (!date) return;
                setViewDate(date);
              }}
              remainingByDate={remainingByDate}
            />
          </div>

          <div className="friend-detail-page__todo">
            <ResourceStatus resource={todoResource} onRetry={() => retry("todos")} />
            {!todoResource.loading && !todoResource.error && (
              <FriendTodo
                title="To do List"
                todos={todos}
                categories={Categories}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendDetailPage;