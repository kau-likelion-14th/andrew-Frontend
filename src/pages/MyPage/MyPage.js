import React from 'react';
import Profile from './Profile';
import Status from './Status';
import '../../styles/MyPage.css';

const MyPage = () => {
  return (
    <div className="mypage-container">
      <Profile />
      <hr className="divider" />
      <Status />
    </div>
  );
};

export default MyPage;