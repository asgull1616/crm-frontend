import api from "../axios";

export const membershipService = {
  
  
  // Bekleyen kullanıcıları listele
  getPendingUsers: async () => {
    const response = await api.get("/membership-requests");
    // Backend veriyi { data: [...] } şeklinde dönüyorsa ona göre düzenle
    return Array.isArray(response.data) ? response.data : response.data.data;
  },

  // Kullanıcıyı onayla
  approveUser: async (id: string) => {
    return await api.patch(`/membership-requests/${id}/approve`);
  },

  // Kullanıcıyı reddet
  rejectUser: async (id: string) => {
    return await api.patch(`/membership-requests/${id}/reject`);
  },
  assignRole: async (id: string, role: string) => {
  return await api.patch(`/membership-requests/${id}/assign-role`, { role });
},
getAllUsers: async () => {
  const response = await api.get('/membership-requests/all-users');
  return response.data;
}
};