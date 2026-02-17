import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const projectsApi = {
  list: async () => {
    const res = await api.get("/api/projects", {
      params: { _ts: Date.now() }, // ✅ cache-buster
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/projects/${id}`, {
      params: { _ts: Date.now() }, // ✅ cache-buster
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    return res.data;
  },

  create: async (payload) => (await api.post("/api/projects", payload)).data,
  update: async (id, payload) => (await api.patch(`/api/projects/${id}`, payload)).data,
  delete: async (id) => (await api.delete(`/api/projects/${id}`)).data,
};

