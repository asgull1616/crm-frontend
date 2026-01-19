import api from "../axios";

export const taskService = {
  create: (data) => api.post("tasks", data),

  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    customerId?: string;
  }) => api.get("tasks", { params }),

  findOne: (id: string) => api.get(`tasks/${id}`),

  update: (id: string, data: any) => api.patch(`tasks/${id}`, data),

  delete: (id: string) => api.delete(`tasks/${id}`),
};
