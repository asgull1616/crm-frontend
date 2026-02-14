import axios from "axios";

// 🔧 API Temel URL Yapılandırması
// Eğer .env dosyan yüklü değilse varsayılan olarak localhost:3050'yi kullanır
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 
    "Content-Type": "application/json" 
  },
});

/**
 * 🔐 İstek Interceptor'ı (Request Interceptor)
 * Her istek gitmeden önce localStorage'daki güncel token'ı kontrol eder ve header'a ekler.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ♻️ Yanıt Interceptor'ı (Response Interceptor)
 * Eğer backend 401 (Unauthorized) hatası dönerse, otomatik olarak refresh token ile yeni session açmaya çalışır.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 hatası aldığımızda ve bu istek daha önce tekrar edilmemişse (infinite loop engelleme)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Refresh token yoksa kullanıcıyı login'e yönlendir
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Refresh token ile yeni access token al
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Yeni tokenları kaydet
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Orijinal isteği yeni token ile güncelle ve tekrar gönder
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token da geçersizse her şeyi temizle ve logout yap
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Çıkış ve Temizlik Fonksiyonu
const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Eğer uygulama client-side'da ise login sayfasına yönlendir
  if (typeof window !== "undefined") {
    window.location.href = "/authentication/login/minimal";
  }
};

export default api;