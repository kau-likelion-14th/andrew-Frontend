import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";

import { get } from "../../Api";
import config from "../../Config";

// 영문 요일을 한글로 바꾸는 헬퍼 함수
const formatDay = (day) => {
  const days = {
    MON: "월요일", TUE: "화요일", WED: "수요일",
    THU: "목요일", FRI: "금요일", SAT: "토요일", SUN: "일요일",
  };
  return days[day] || day || "정보 없음";
};

const Status = () => {
  const [stats, setStats] = useState([
    { icon: "🔥", title: "연속 달성일", statistics: {value: 0, unit: "일"} },
    { icon: "🎯", title: "최근 30일 달성률", statistics: {value: 0, unit: "%"} },
    { icon: "⭐", title: "가장 많이 완료한 요일", statistics: {value: "토요일", unit: ""}}
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await get(config.STATISTICS.GET);
        // 서버 응답에서 result 객체를 꺼내옵니다.
        const data = response.result || response;

        setStats([
          {
            icon: "🔥",
            title: "연속 달성일",
            statistics: { value: data.streak || 0, unit: "일" },
          },
          {
            icon: "🎯",
            title: "최근 30일 달성률",
            statistics: { value: data.monthPercent || 0, unit: "%" },
          },
          {
            icon: "⭐",
            title: "가장 많이 완료한 요일",
            statistics: { value: formatDay(data.mostTodoWeek), unit: "" },
          },
        ]);
      } catch (error) {
        console.error("통계 데이터를 가져오는 중", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="status-container">
      {stats.map((stats, idx) => (
        <StatCard
          key={idx}
          stats={stats}
        />
      ))}
    </div>
  );
};

export default Status;
