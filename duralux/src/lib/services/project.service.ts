import api from "../axios";

export const projectService = {
  list: (params?: any) => api.get("projects", { params }),
  create: (data: any) => api.post("projects", data),
};
