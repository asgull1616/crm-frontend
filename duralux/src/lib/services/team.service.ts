// src/lib/services/team.service.ts
import api from '../axios';

export const teamService = {
    // 👥 Listele
    list: (params?: any) =>
        api.get('/teams', { params }),

    // ✏️ Kullanıcı güncelle
    update: (id: string, data: any) =>
        api.patch(`/teams/${id}`, data),

    // 🎭 Rol güncelle
    updateRole: (id: string, role: string) =>
        api.patch(`/teams/${id}/role`, { role }),

    // 🗑️ Soft delete
    delete: (id: string) =>
        api.delete(`/teams/${id}`),
};
