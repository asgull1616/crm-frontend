"use client";

import { useEffect, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { authService } from "@/lib/services/auth.service";

const ProfileModal = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    authService
      .me()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

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

        <button
          className="dropdown-item text-danger"
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/authentication/login/minimal";
          }}
        >
          <FiLogOut />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
