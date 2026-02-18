import api from "../axios";

export const licenseService = {
  async list(page = 1, limit = 50) {
    const res = await api.get("/files/licenses", {
      params: { page, limit },
    });
    return res.data;
  },

  async create(payload: any) {
    const res = await api.post("/files/licenses", payload);
    return res.data;
  },

  async delete(id: string) {
    return api.delete(`/files/licenses/${id}`);
  },
};
