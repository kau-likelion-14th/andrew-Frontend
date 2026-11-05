import React from "react";
import Statistics from "./Status";
import Profile from "./Profile";
import "../../styles/MyPage.css";

const MyPage = () => {
  return (
    <div className="mypage-container">
      <Profile />
      <Statistics />
    </div>
  );
};

export default MyPage;