// src/lib/services/dashboard.service.ts
import api from "../axios";

export const dashboardService = {
  getCustomerStats: () => api.get("dashboard/customer-stats"),
};
