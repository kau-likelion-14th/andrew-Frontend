const config = {
  API_URL: "",

  AUTH: {
    KAKAO: "/api/auth/kakao",
    REISSUE: "/api/auth/reissue",
    LOGOUT: "/api/auth/logout",
    WITHDRAW: "/api/auth/withdraw",
  },

  FOLLOW: {
    PROFILE: (id) => `/api/follow/${encodeURIComponent(id)}`,
    TODOS: (id) => `/api/follow/${encodeURIComponent(id)}/todos`,
    CALENDAR: (id) => `/api/follow/${encodeURIComponent(id)}/calendar`,
    AVAILABLE: "/api/follow",
    SEARCH: "/api/follow/search",
    CREATE: "/api/follow",
    FOLLOWINGS: "/api/follow/followings",
    DELETE: "/api/follow",
  },

  PROFILE: {
    GET: "/api/profile",
    PUT: "/api/profile",
    DELETE: "/api/profile",
    INTRO: "/api/profile/intro",
  },

  CALENDAR: {
    GET: "/api/todos/calendar",
  },

  CATEGORIES: {
    GET: "/api/categories",
  },

  TODOS: {
    LIST: "/api/todos",
    TOGGLE_COMPLETE: (todoId, date) =>
      `/api/todos/${todoId}/dates/${date}/complete`,
  },

  STATISTICS: {
    GET: "/api/statistic",
  },
};

export default config;
