import React from "react";
import "../../styles/LoginPage.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import kakaoBtn from "../../assets/icon/kakao_login_large_wide.png"
import bg1 from "../../assets/img/login_bg1.jpg"
import bg2 from "../../assets/img/login_bg2.jpg"
import bg3 from "../../assets/img/login_bg3.jpg"

function LoginPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };
    const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
    const [bg, setBg] = useState(bg1);

    useEffect(() => {
        const idx = Math.floor(Math.random() * backgrounds.length);
        setBg(backgrounds[idx]);
    }, [backgrounds]);


    return(
        <div className="login-page">
            <div
                className="login-bg"
                style={{ backgroundImage: `url(${bg})`}}
            />
            
            <div className="login-bg-overlay" />
            <main className="login-card-wrap">
                <section className="login-card">
                    <div className="login-logo">
                        <span className="logo-l">L</span>
                        <span className="logo-t">T</span>
                        <span className="logo-e">E</span>
                    </div>

                    <div className="login-subtitle">
                        <span className="sub-l">L</span>
                        <span className="sub-rest">ION </span>
                        <span className="sub-t">T</span>
                        <span className="sub-rest">O-DO </span>
                        <span className="sub-e">E</span>
                        <span className="sub-rest">VERYDAY</span>
                    </div>

                    <button type="button" className="kakao-login-btn" onClick={handleClick}>
                        <img src={kakaoBtn} alt="카카오 로그인" className="kakao-login-img"/>
                    </button>

                    <footer className="login-footer">
                        <span className="copyright-icon">ⓒ LIKELION KAU.</span>
                        <span>All rights reserved.</span>
                    </footer>
                </section>
            </main>
        </div>
    );
}

export default LoginPage;