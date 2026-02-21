import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const user = useMemo(() => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (err) {
      return null;
    }
  }, []);

  return {
    user,
    role: user?.role || null,
  };
};