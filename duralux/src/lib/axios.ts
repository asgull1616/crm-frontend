import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refreshToken");
        return api(originalRequest);
      } catch {
        await axios.post(
          `${API_BASE_URL}/api/auth/logout`,
          {},
          { withCredentials: true },
        );

        window.location.href = "/authentication/login/minimal";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
