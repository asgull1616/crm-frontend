import api from "../axios";

export const userService = {
  list: (params) => api.get("/users", { params }),
};
