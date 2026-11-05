import React from "react";
import "../../styles/MyPage.css";

const StatCard = ({ stats }) => {
  return (
    <div className="state-card">
        <div className="state-header">
            <span className="state-icon">{stats.icon}</span>
            <span className="state-title">{stats.title}</span>
        </div>
        <div className="state-content">
            {stats.statistics.value} 
            <span className="state-unit">{stats.statistics.unit}</span>
        </div>
    </div>
  );
};

export default StatCard;