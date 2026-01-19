import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

// 🔐 AccessToken otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ♻️ 401 gelirse refresh dene
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050";

        const r = await axios.post(BASE + "/api/auth/refreshToken", {
          refreshToken,
        });

        const newAccess = r.data.accessToken;
        const newRefresh = r.data.refreshToken;

        localStorage.setItem("accessToken", newAccess);
        localStorage.setItem("refreshToken", newRefresh);

        error.config.headers.Authorization = `Bearer ${newAccess}`;
        return api.request(error.config);
      } catch (e) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/authentication/login/minimal";
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
