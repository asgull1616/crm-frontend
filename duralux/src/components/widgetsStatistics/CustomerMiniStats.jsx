"use client";

import React, { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiUserPlus, FiTrendingUp, FiActivity } from "react-icons/fi";
import { dashboardService } from "@/lib/services/dashboard.service";

export default function CustomerMiniStats() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getCustomerStats();
        setData(res?.data || res);
      } catch (err) {
        console.error("Müşteri istatistikleri çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-md-3">
            <div className="card border-0 shadow-sm p-3 placeholder-glow" style={{ borderRadius: "16px" }}>
              <div className="placeholder col-4 mb-2"></div>
              <div className="placeholder col-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Toplam", value: data.total || 0, icon: <FiUsers />, bg: "#f0f4ff", color: "#3b82f6", desc: "Müşteri" },
    { label: "Aktif", value: data.active || 0, icon: <FiUserCheck />, bg: "#ecfdf5", color: "#10b981", desc: "Üye" },
    { label: "Görüşülen", value: data.contacted || 0, icon: <FiUserPlus />, bg: "#fef3c7", color: "#f59e0b", desc: "Potansiyel" },
    { label: "Kayıp", value: data.lost || 0, icon: <FiTrendingUp />, bg: "#fff1f2", color: "#f43f5e", desc: "Müşteri" }
  ];

  return (
    <div className="mb-4">
      {/* BAŞLIK KISMI - Finansal Grafikle Uyumlu */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>Müşteri Portföyü</h5>
          <p className="text-muted small mb-0">Müşteri tabanınızın güncel dağılımı</p>
        </div>
        <div className="bg-white shadow-sm p-2 rounded-3 text-secondary">
          <FiActivity size={18} />
        </div>
      </div>

      <div className="row g-3">
        {stats.map((item, index) => (
          <div className="col-xl-3 col-sm-6" key={index}>
            <div 
              className="card border-0 shadow-sm transition-hover h-100" 
              style={{ 
                borderRadius: "16px", 
                transition: "all 0.2s ease-in-out",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.02)"
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: "42px", 
                      height: "42px", 
                      backgroundColor: item.bg, 
                      color: item.color,
                      fontSize: "20px",
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </div>

                  <div className="ms-3 overflow-hidden">
                    <p className="text-muted mb-0 small fw-medium text-truncate" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {item.label}
                    </p>
                    <div className="d-flex align-items-baseline gap-1">
                      <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                        {item.value.toLocaleString("tr-TR")}
                      </h5>
                      <span className="text-muted small" style={{ fontSize: "10px" }}>{item.desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .transition-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08) !important;
          border-color: rgba(0,0,0,0.05) !important;
        }
      `}</style>
    </div>
  );
}