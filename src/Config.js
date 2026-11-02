const config = {
  API_URL: "",

  AUTH: {
    KAKAO: "/api/auth/kakao",
    REISSUE: "/api/auth/reissue",
    LOGOUT: "/api/auth/logout",
    WITHDRAW: "/api/auth/withdraw",
  },

  // 이번 시간에 추가할 API 주소
  FOLLOW: {
    FOLLOWINGS: "/api/follow/followings",
    DELETE: "/api/follow",
    SEARCH: "/api/follow/search",
    CREATE: "/api/follow",
  },
};

export default config;
