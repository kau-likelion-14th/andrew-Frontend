import React from 'react';

const StatCard = ({ stats }) => {
  return (
    <div className="stat-card">
      <div className="stat-content-wrapper">
        {/* 상단: 아이콘 + 제목 */}
        <div className="stat-header">
          <span className="stat-icon">{stats.icon}</span>
          <span className="stat-title">{stats.title}</span>
        </div>
        {/* 하단: 수치 */}
        <div className="stat-value-container">
          <span className="stat-value">{stats.statistics.value}</span>
          <span className="stat-unit">{stats.statistics.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;