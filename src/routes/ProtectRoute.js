import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { renewAccessToken } from "../Api";

export default function ProtectedRoute() {
  const location = useLocation();
  const [auth, setAuth] = useState("checking");

  useEffect(() => {
    let active = true;

    const sync = () => {
      if (!active) return;

      setAuth(
        localStorage.getItem("accessToken")
          ? "authenticated"
          : "guest"
      );
    };

    const checkLogin = async () => {
      if (localStorage.getItem("accessToken")) {
        sync();
        return;
      }

      try {
        await renewAccessToken();

        if (active) {
          setAuth("authenticated");
        }
      } catch {
        if (active) {
          setAuth("guest");
        }
      }
    };

    window.addEventListener("auth:changed", sync);
    checkLogin();

    return () => {
      active = false;
      window.removeEventListener("auth:changed", sync);
    };
  }, []);

  if (auth === "checking") {
    return <p>로그인 상태 확인 중...</p>;
  }

  if (auth === "guest") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}