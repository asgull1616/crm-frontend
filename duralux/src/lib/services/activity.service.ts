import api from "../axios";

export const activityService = {
  list: (params?: { page?: number; limit?: number; customerId?: string; taskId?: string; type?: string }) => api.get("activities", { params }),

  getById: (id: string) => api.get(`activities/${id}`),

  create: (data: any) => api.post("activities", data),

  update: (id: string, data: any) => api.patch(`activities/${id}`, data),

  delete: (id: string) => api.delete(`activities/${id}`),
};
