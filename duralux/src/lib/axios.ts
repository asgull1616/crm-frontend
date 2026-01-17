import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    headers: { 'Content-Type': 'application/json' },
});

// 🔐 AccessToken otomatik ekle
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
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
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return Promise.reject(error);

            try {
                const r = await axios.post(
                    process.env.NEXT_PUBLIC_API_URL + '/api/auth/refreshToken',
                    { refreshToken }
                );

                const newAccess = r.data.accessToken;
                const newRefresh = r.data.refreshToken;

                sessionStorage.setItem('accessToken', newAccess);
                localStorage.setItem('refreshToken', newRefresh);

                error.config.headers.Authorization = `Bearer ${newAccess}`;
                return api.request(error.config);
            } catch (e) {
                sessionStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/authentication/login/minimal';
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
