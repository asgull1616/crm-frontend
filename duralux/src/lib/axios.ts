import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 
    "Content-Type": "application/json" 
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          handleLogout();
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          handleLogout();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// 🔧 DÜZELTİLEN KISIM:
const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  
  // Middleware'in takılmaması için çerezi de temizliyoruz
  if (typeof document !== "undefined") {
    document.cookie = "loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  // ÖNEMLİ: window.location.href = "/" satırını sildik!
  // Bu sayede page.js içindeki catch bloğu çalışabilir ve sonsuz döngü kırılır.
  console.warn("Oturum temizlendi, yönlendirme page.js tarafından yönetiliyor.");
};

export default api;