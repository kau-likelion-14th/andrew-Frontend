import React, { useMemo } from "react";

import "../../styles/Todo.css";
import "../../styles/FriendTodo.css";

const dummyTodos = [
  { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
  { id: 2, text: "FriendTodo 구현하기", category: "공부", completed: false },
  { id: 3, text: "동아리 회의", category: "동아리", completed: false },
];

const dummyCategories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const FriendTodo = ({ title = "To do List" }) => {
  // 실제로는 부모로부터 props로 받아야 하나, 현재 코드에서는 dummy 데이터를 상수로 사용함
  const todos = dummyTodos;
  const categories = dummyCategories;

  // useMemo: 할 일 목록이 바뀔 때만 총 개수와 완료된 개수를 재계산함
  const counts = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done };
  }, [todos]);

  return (
    <div className="friend-todo">
      <div className="todo-container">
        <div className="todo-header">
          <div className="todo-title">{title}</div>
        </div>

        <div className="todo-list">
          {/* 할 일 목록 배열의 길이를 확인하여 비었을 경우 안내 문구 출력 */}
          {todos.length === 0 ? (
            <div className="friend-todo__empty">등록된 투두가 없습니다.</div>
          ) : (
            // map을 통해 각 todo 항목을 순회하며 JSX 요소로 렌더링
            todos.map((t) => (
              <div key={t.id} className={`todo-item ${t.completed ? "done" : ""}`}>
                {/* 완료 상태에 따라 'checked' 클래스를 동적으로 부여함 */}
                <div className={`checkbox ${t.completed ? "checked" : ""}`} />
                <div className="todo-text">{t.text}</div>
                <div
                  className="todo-category"
                  // 인라인 스타일로 카테고리에 맞는 배경색과 글자색을 적용
                  style={categories[t.category] ?? undefined}
                >
                  {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendTodo;