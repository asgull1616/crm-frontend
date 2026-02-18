"use client";

import { useEffect, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { profileService } from "@/lib/services/profile.service";
import api from "@/lib/axios";

const ProfileModal = () => {
  const [user, setUser] = useState < any > null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.getMe();
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setUser(null);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/authentication/login/minimal";
    }
  };

  return (
    <div className="dropdown nxl-h-item">
      <a
        href="#"
        data-bs-toggle="dropdown"
        className="d-flex align-items-center justify-content-center user-avatar-icon"
      >
        <FiUser size={22} />
      </a>

      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
        <div className="dropdown-header">
          <h6 className="text-dark mb-0">{user?.username || "Kullanıcı"}</h6>
          <span className="fs-12 fw-medium text-muted">
            {user?.email || ""}
          </span>
        </div>

        <button className="dropdown-item text-danger" onClick={handleLogout}>
          <FiLogOut />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
