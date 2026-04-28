import {Routes,Route,UseLocation, useLocation} from "react-router-dom"
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import MainPage from './pages/MainPage/MainPage'
import LoginPage from './pages/LoginPage/LoginPage'
import MyPage from './pages/MyPage/MyPage'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header/>}

      <Routes>
        <Route path='/' element={<MainPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/mypage' element={<MyPage />} />
      </Routes>
      
      {!isLoginPage && <Footer/>}
    </div>
  );
}

export default App;