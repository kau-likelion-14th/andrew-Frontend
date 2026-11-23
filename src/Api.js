import axios from "axios";
import config from "./Config";

const api = axios.create({
    baseURL: config.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let refreshPromise = null;


export const renewAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = axios
        .post(
            config.AUTH.REISSUE,
            {},
            { withCredentials: true }
        )

        .then(({data}) => {
            const token = data?.result;

        if(
            data?.isSuccess === false ||
            typeof token !== "string" ||
            !token
        ) {
            throw new Error("토큰 재발급에 실패했습니다.");
        }
        localStorage.setItem("accessToken", token);

        window.dispatchEvent(new Event("auth:changed"));

        return token;
    })
    .finally(() => {
        refreshPromise = null;
    });
    }
    return refreshPromise;
};

api.interceptors.request.use((request) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const url = original?.url ||"";

        if (
            error.response?.status !== 401 ||
            !original ||
            original._retry ||
            url.includes(config.AUTH.KAKAO) ||
            url.includes(config.AUTH.REISSUE)
        ) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            const token = await renewAccessToken();
            original.headers = original.headers || {};

            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
        } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("auth:changed"));
            return Promise.reject(refreshError);
        }
    }

);



const validateContentType = (response) => {
  const contentType = response.headers?.["content-type"] || "";
  if (!contentType.includes("json")) {
    console.warn("JSON이 아닌 응답 Content-Type:", contentType);
  }
};

// ===== 공통 요청 함수들 =====

// GET
export const get = async (endpoint, params = {}, options = {}) => {
  const response = await api.get(endpoint, { params, ...options });
  validateContentType(response);
  return response.data;
};

// POST (JSON)
export const post = async (endpoint, data, options = {}) => {
  const response = await api.post(endpoint, data, options);
  validateContentType(response);
  return response.data;
};

// PUT (JSON)
export const put = async (endpoint, data = {}, options = {}) => {
  const response = await api.put(endpoint, data, options);
  validateContentType(response);
  return response.data;
};

// DELETE
export const del = async (endpoint, options = {}) => {
  const response = await api.delete(endpoint, options);
  validateContentType(response);
  return response.data;
};

// PATCH (일반 JSON PATCH)
export const patch = async (endpoint, data = {}, options = {}) => {
  const response = await api.patch(endpoint, data, options);
  validateContentType(response);
  return response.data;
};

export const uploadProfile = async (
  endpoint,
  { intro, song, imageFile },
  {
    introField = "intro",
    songField = "song",
    imageField = "image",
    method = "put",
    ...options
  } = {}
) => {
  const formData = new FormData();

  if (intro !== undefined) formData.append(introField, intro);
  if (song !== undefined) formData.append(songField, song);

  if (imageFile) {
    // 1. 실제 파일이 있으면 파일을 담음
    formData.append(imageField, imageFile);
  } else {
    // 2. 파일이 없으면(null), 빈 파일 객체를 만들어 보냄 
    formData.append(imageField, new Blob([]), "empty.png");
  }

  const response = await api.request({
    url: endpoint,
    method,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });

  validateContentType(response);
  return response.data;
};

export default api;