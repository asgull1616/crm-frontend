"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";

const AuthContext = createContext({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("🟡 AuthProvider MOUNT OLDU");

  const fetchMe = async () => {
    console.log("🚀 fetchMe başladı");

    try {
      const res = await api.get("/auth/me");
      console.log("✅ /auth/me response:", res.data);

      setUser(res.data);
    } catch (err) {
      console.log("❌ /auth/me hata:", err?.response?.status);
      setUser(null);
    } finally {
      console.log("🟢 loading false olacak");
      setLoading(false);
    }
  };

  fetchMe();
}, []);

useEffect(() => {
  console.log("🔁 USER değişti:", user);
}, [user]);

useEffect(() => {
  console.log("🔁 LOADING değişti:", loading);
}, [loading]);

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);