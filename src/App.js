import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import FriendPage from './pages/FriendPage/FriendPage';
import MyPage from './pages/MyPage/MyPage'
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  // useLocation: 현재 브라우저의 경로(URL) 정보를 가져오는 Hook
  const location = useLocation();
  // 현재 경로가 '/login'인지 판별하여 헤더와 푸터의 노출 여부를 결정함
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {/* 로그인 페이지가 아닐 때만 Header 컴포넌트를 보여줌 (조건부 렌더링) */}
      {!isLoginPage && <Header />}

      {/* Routes: 주소 경로에 따라 화면에 보여줄 컴포넌트를 정의함 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path='/mypage' element={<MyPage />} />
        {/* ':id'는 동적 파라미터로, 각 친구마다 고유한 ID를 가진 주소로 연결됨 */}
        <Route path="/friends/:id" element={<FriendDetailPage />} />
      </Routes>

      {/* 로그인 페이지가 아닐 때만 Footer 컴포넌트를 보여줌 */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;