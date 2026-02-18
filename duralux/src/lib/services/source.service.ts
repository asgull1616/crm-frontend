import api from "../axios";

export const sourceService = {
  async list(page = 1, limit = 50) {
    const res = await api.get("/files/source-links", {
      params: { page, limit },
    });
    return res.data;
  },

  async create(payload) {
    const res = await api.post("/files/source-links", payload);
    return res.data;
  },

  async delete(id) {
    return api.delete(`/files/source-links/${id}`);
  },
};
