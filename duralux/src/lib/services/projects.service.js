import api from "../axios";

export const projectsApi = {
  list: async (params = {}) => {
    const res = await api.get("/projects", {
      params: {
        ...params,
        _ts: Date.now(),
      },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/projects/${id}`, {
      params: { _ts: Date.now() },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    return res.data;
  },

  create: async (payload) => (await api.post("/projects", payload)).data,

  update: async (id, payload) =>
    (await api.patch(`/projects/${id}`, payload)).data,

  delete: async (id) => (await api.delete(`/projects/${id}`)).data,
};
