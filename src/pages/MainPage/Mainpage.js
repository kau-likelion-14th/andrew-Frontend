import React, {useState} from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import "../../styles/MainPage.css";

const toDateKey = (date) => { // 날짜 객체를 "YYYY-MM-DD" 문자열로 바꾸는 함수 (달력과 Todo가 같은 키를 쓰기 위함)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const uid = () => Date.now() + Math.random(); // 고유한 ID를 생성하는 함수 (할 일 항목 각각을 구분하기 위함)


const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 1. 현재 어떤 날짜가 선택되었는지 관리 (기본값: 오늘)
  
  const [todosByDate, setTodosByDate] = useState(() => { // 2. 전체 할 일 데이터를 관리하는 객체 상태
    const todayKey = toDateKey(new Date()); // 오늘 날짜 키 생성
    return {
      [todayKey]: [ // 초기 데이터 (오늘 날짜에 예시 데이터 4개를 넣어둠)
        { id: uid(), text: '리액트 공부하기', category: '공부', completed: true },
        { id: uid(), text: '공부하기', category: '공부', completed: true },
        { id: uid(), text: '헬스장 가기', category: '운동', completed: false },
        { id: uid(), text: '동아리 회의 참석', category: '동아리', completed: false },
      ]
    };
  });
  return (
    <div className="mainpage-container">
      <CustomCalendar 
        initialDate={selectedDate} // 현재 선택된 날짜 전달
        onDateChange={setSelectedDate} // 달력에서 날짜 클릭 시 selectedDate를 바꾸는 함수 전달
        todosByDate={todosByDate} // 달력에 숫자/별표를 표시하기 위해 전체 데이터 전달
      />
      <Todo 
        selectedDate={selectedDate} // "지금 몇 일을 보고 있는가?" 정보 전달
        todosByDate={todosByDate} // 할 일 목록을 보여주기 위한 데이터 전달
        setTodosByDate={setTodosByDate} // 새로운 할 일을 추가하거나 완료 처리할 때 쓸 변경 함수 전달
      />
    </div>
  );
};

export default MainPage; //MainPage라는 컴포넌트를 다른 파일에서도 가져다 쓸 수 있도록 "밖으로 내보내는" 명령어