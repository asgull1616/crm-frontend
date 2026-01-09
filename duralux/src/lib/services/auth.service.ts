import api from '../axios';

export const authService = {
    authenticate: (data: { username: string; password: string }) =>
        api.post('/auth/authenticate', data),
    register: (data: { username: string; email: string; password: string }) =>
        api.post('/auth/register', data),

    logout: () => api.post('/auth/logout'),
};
