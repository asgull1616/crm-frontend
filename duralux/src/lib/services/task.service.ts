import api from "../axios";

export const taskService = {
  create: (data: any) => api.post("tasks", data),
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    customerId?: string;

    // ✅ EKLENDİ
    projectId?: string;
    assignedUserId?: string;
  }) => api.get("tasks", { params }),

  findOne: (id: string) => api.get(`tasks/${id}`),

  update: (id: string, data: any) => api.patch(`tasks/${id}`, data),

  delete: (id: string) => api.delete(`tasks/${id}`),

  teamProgress: (params?: { limit?: number }) => api.get("tasks/team-progress", { params }),
};
