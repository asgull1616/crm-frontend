import api from "../axios";

export const hostingService = {
  list: (page = 1, limit = 50) =>
    api.get("/files/hosting", { params: { page, limit } }).then((r) => r.data),

  create: (payload: any) =>
    api.post("/files/hosting", payload).then((r) => r.data),

  update: (id: string, payload: any) =>
    api.patch(`/files/hosting/${id}`, payload).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/files/hosting/${id}`).then((r) => r.data),
};
