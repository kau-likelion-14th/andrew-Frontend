// import React from 'react';
// import './App.css';
// import Header from './components/Header'
// import MainPage from './pages/MainPage'

// function App() {
//   return (
//     <div>
//       <Header/>
//       <h1></h1>
//     </div>
//   );
// }

// export default App;
import {Routes,Route,UseLocation, useLocation} from "react-router-dom"
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import MainPage from './pages/MainPage/MainPage'
import LoginPage from './pages/LoginPage/LoginPage'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header/>}

      <Routes>
        <Route path='/' element={<MainPage/>} />
        <Route path='/login' element={<LoginPage/>} />
      </Routes>
      
      {!isLoginPage && <Footer/>}
    </div>
  );
}

export default App;