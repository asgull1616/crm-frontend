import api from "../axios";

export const programPlanApi = {
  list: (params) => api.get("/program/plan", { params }).then((r) => r.data),

  create: (payload) => api.post("/program/plan", payload).then((r) => r.data),

  update: (id, payload) =>
    api.patch(`/program/plan/${id}`, payload).then((r) => r.data),

  remove: (id) => api.delete(`/program/plan/${id}`).then((r) => r.data),
};
