import api from "../axios";

export const profileService = {
  // Giriş yapanın profilini alır
  getMe: () => api.get("profile/me"),

  // Profili günceller
  updateMe: (data: any) => api.patch("profile/me", data),
};