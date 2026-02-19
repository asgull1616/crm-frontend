import api from "../api"; // Mevcut api konfigürasyonunu kullanıyoruz

export const userService = {
  // Bekleyen kullanıcıları getir
  getPendingUsers: () => api.get('/users/pending').then(res => res.data),
  
  // Kullanıcıyı onayla
  approveUser: (id) => api.post(`/users/approve/${id}`),
  
  // Kullanıcıyı reddet
  rejectUser: (id) => api.delete(`/users/reject/${id}`)
};