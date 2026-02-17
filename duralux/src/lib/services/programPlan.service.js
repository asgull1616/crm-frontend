import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050",
});

// Token'ı siz nerede tutuyorsanız onu kullan.
// Eğer cookie kullanıyorsanız bu kısmı ona göre düzenleriz.
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const programPlanApi = {
  list: (params) => api.get("/api/program/plan", { params }).then((r) => r.data),
  create: (payload) => api.post("/api/program/plan", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/api/program/plan/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/program/plan/${id}`).then((r) => r.data),
};
