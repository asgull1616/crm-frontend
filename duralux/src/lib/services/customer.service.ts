import api from '../axios';

export const customerService = {
    list: (params?: any) =>
        api.get('/customers', { params }),

    getById: (id: string) =>
        api.get(`/customers/${id}`),

    create: (data: any) =>
        api.post('/customers', data),

    update: (id: string, data: any) =>
        api.patch(`/customers/${id}`, data),

    delete: (id: string) =>
        api.delete(`/customers/${id}`),
};
