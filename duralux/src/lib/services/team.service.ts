// src/lib/services/team.service.ts
import api from "../axios";

export const teamService = {
  // --------------------------------------------------
  // TEAMS
  // --------------------------------------------------

  // 👥 Ekipleri listele (pagination destekli)
  list: (params?: { page?: number; limit?: number }) =>
    api.get("teams", { params }),

  // 🔍 Tek ekip getir
  getById: (id: string) => api.get(`teams/${id}`),

  // 🔎 İsimle ekip ara
  searchByName: (name: string) => api.get("teams/search", { params: { name } }),

  // ➕ Ekip oluştur
  create: (data: { name: string; memberIds?: string[] }) =>
    api.post("teams", data),

  // 🗑️ Ekip sil (soft delete)
  remove: (id: string) => api.delete(`teams/${id}`),

  // --------------------------------------------------
  // TEAM MEMBERS
  // --------------------------------------------------

  // 👤 Ekip üyelerini getir
  getMembers: (teamId: string) => api.get(`/teams/${teamId}/members`),

  // ➕ Ekip üyesi ekle (bulk)
  addMembers: (teamId: string, memberIds: string[]) =>
    api.post(`/teams/${teamId}/members`, { memberIds }),

  // ➖ Ekipten üye çıkar (bulk)
  removeMembers: (teamId: string, memberIds: string[]) =>
    api.delete(`/teams/${teamId}/members`, {
      data: { memberIds },
    }),

  // --------------------------------------------------
  // USERS (Geçici – backend ile birebir)
  // --------------------------------------------------

  // 👥 Kullanıcı listele (ekip oluşturma ekranı)
  listUsers: (params?: { page?: number; limit?: number }) =>
    api.get("/teams/users", { params }),

  // 🎭 Kullanıcı rol güncelle
  updateUserRole: (userId: string, role: string) =>
    api.patch(`/teams/users/${userId}/role`, { role }),

  // 🗑️ Kullanıcı soft delete
  removeUser: (userId: string) => api.delete(`/teams/users/${userId}`),
};
