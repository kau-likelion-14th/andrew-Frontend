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



export default api;