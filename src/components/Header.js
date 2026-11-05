import "../styles/Header.css";
import logo from "../assets/img/logo.png";
import LogoutIcon from "../assets/icon/logout.png";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../Api";
import config from "../Config";
import { useState } from "react";

function Header() {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    
    let userName = "";

    try {
        userName =
            JSON.parse(
                localStorage.getItem("user") || "null"
        )?.username ||"";
    } catch {

    }

    const handleLogout = async () => {
        if(loggingOut) return;
        setLoggingOut(true);

        try {
            const { data } = await api.post(
             config.AUTH.LOGOUT,
             {}
            );

            if (data?.isSuccess === false) {
                throw new Error("로그아웃 실패");
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("auth:changed"));
            navigate("/login", { replace: true });
        } catch {
            alert("로그아웃에 실패했습니다");
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <header className="header">
            {/*로고*/}
            <div className="header-left">
                <img src={logo} alt="LTE 로고" className="header-logo"/>
                <span className="header-title">Lion To-do Evryday</span>
            </div>

            {/*메뉴*/}
            <nav className="header-nav">  
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    홈
                </NavLink>

                <NavLink to="/friends" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    친구
                </NavLink>

                <NavLink to="/mypage" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    마이페이지
                </NavLink>
            </nav>
            
            {/*사용자 정보*/}
            <div className="header-right">
                <span className="user-name">
                    {userName ? `${userName}님` : ""}
                    </span>
                <img src={LogoutIcon} alt="로그아웃" className="logout-icon" onClick={handleLogout}/>
            </div>

        </header>
    );
}

export default Header;