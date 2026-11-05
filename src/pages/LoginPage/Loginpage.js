import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../Config";
import "../../styles/Loginpage.css";
import kakoBtn from "../../assets/icon/kakao_login_large_wide.png";
import bg1 from "../../assets/img/login_bg1.jpg";
import bg2 from "../../assets/img/login_bg2.jpg";
import bg3 from "../../assets/img/login_bg3.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const onceRef = useRef(false);

  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bg, setBg] = useState(bg1);
  const [error, setError] = useState("");

  useEffect(() => {
    const idx = Math.floor(Math.random() * backgrounds.length);
    setBg(backgrounds[idx]);
  }, [backgrounds]);

  useEffect(() => {
    const isCallback =
      location.pathname === "/login/oauth2/code/kakao";

    if (!isCallback && localStorage.getItem("accessToken")) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("error")) {
      setError("카카오 로그인이 취소되었거나 실패했습니다.");
      return;
    }

    const code = params.get("code");

    if (location.pathname !== "/login/oauth2/code/kakao") {
      return;
    }

    if (!code) {
      setError("인가 코드가 없습니다. 카카오 로그인을 다시 시도해 주세요.");
      return;
    }

    if (!code || onceRef.current) return;
    onceRef.current = true;

    const expectedState =
      sessionStorage.getItem("kakaoOAuthState");

    if (!expectedState || params.get("state") !== expectedState) {
      setError("로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.");
      return;
    }

    sessionStorage.removeItem("kakaoOAuthState");

    axios
      .post(
        config.AUTH.KAKAO,
        { code },
        { withCredentials: true }
      )
      .then(({ data }) => {
        const result = data?.result;

        if (data?.isSuccess === false || !result?.accessToken) {
          throw new Error(data?.message || "로그인 실패");
        }

        const { accessToken, ...user } = result;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/", { replace: true });
      })
      .catch(() => {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
      });
  }, [location.pathname, location.search, navigate]);

  const handleClick = () => {
    const restKey = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const redirectUri =
      `${window.location.origin}/login/oauth2/code/kakao`;

    if (!restKey) {
      setError("카카오 로그인 환경변수를 확인해 주세요.");
      return;
    }

    const state = window.crypto.randomUUID();
    sessionStorage.setItem("kakaoOAuthState", state);

    const params = new URLSearchParams({
      client_id: restKey,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
    });

    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?${params}`;
  };

  return (
    <div className="login-page">
      <div
        className="login-bg"
        style={{ backgroundImage: `url(${bg})` }}
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

          {error && <p role="alert">{error}</p>}

          {!error &&
            location.pathname === "/login/oauth2/code/kakao" && (
              <p role="status">로그인 처리 중...</p>
            )}

          <button
            type="button"
            className="kakao-login-btn"
            onClick={handleClick}
            disabled={
              !error &&
              location.pathname === "/login/oauth2/code/kakao"
            }
          >
            <img
              src={kakoBtn}
              alt="카카오 로그인"
              className="kakao-login-img"
            />
          </button>

          <footer className="login-footer">
            <span className="copyright-icon">
              © LIKELION KAU.{" "}
            </span>
            <span>All rights reserved.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;