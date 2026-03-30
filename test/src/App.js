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
import {Routes,Route} from "react-router-dom"
import './App.css';
import Header from './components/Header'
import MainPage from './pages/MainPage/MainPage'

function App() {
  return (
    <div>
      <Header/>

      <Routes>
        <Route path='/' element={<MainPage/>} />
      </Routes>

    </div>
  );
}

export default App;