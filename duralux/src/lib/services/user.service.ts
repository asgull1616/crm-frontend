import api from "../axios";

export const userService = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get("users", { params }),
};
