"use client";

import React, { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiUserPlus, FiTrendingUp } from "react-icons/fi";
import { dashboardService } from "@/lib/services/dashboard.service";

export default function CustomersStatistics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getCustomerStats();
        setData(res.data);
      } catch (err) {
        console.error("Customer stats error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStyles = (color) => {
    const styles = {
      primary: {
        bg: "rgba(233, 43, 99, 0.1)",
        icon: "#E92B63",
        trend: "#E92B63",
      },
      success: {
        bg: "rgba(159, 184, 160, 0.15)",
        icon: "#9FB8A0",
        trend: "#9FB8A0",
      },
      info: {
        bg: "rgba(59, 130, 246, 0.1)",
        icon: "#3B82F6",
        trend: "#3B82F6",
      },
      warning: {
        bg: "rgba(233, 43, 99, 0.05)",
        icon: "#b54d6a",
        trend: "#b54d6a",
      },
    };

    return styles[color] || styles.primary;
  };

  if (loading) {
    return (
      <div className="col-12 text-center text-muted py-4">Yükleniyor...</div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Toplam Müşteri",
      value: data.total?.toLocaleString("tr-TR"),
      icon: <FiUsers />,
      color: "primary",
      trend: "—",
    },
    {
      label: "Aktif Müşteriler",
      value: data.active?.toLocaleString("tr-TR"),
      icon: <FiUserCheck />,
      color: "success",
      trend: "—",
    },
    {
      label: "İletişim Kuruldu",
      value: data.contacted?.toLocaleString("tr-TR"),
      icon: <FiUserPlus />,
      color: "info",
      trend: "—",
    },
    {
      label: "Kaybedildi",
      value: data.lost?.toLocaleString("tr-TR"),
      icon: <FiTrendingUp />,
      color: "warning",
      trend: "—",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => {
        const style = getStyles(stat.color);

        return (
          <div className="col-xxl-3 col-md-6 mb-4" key={index}>
            <div
              className="card border-0 shadow-sm h-100 bg-white"
              style={{ borderRadius: "24px" }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h2
                      className="fw-bold mb-1"
                      style={{ color: "#1e293b", letterSpacing: "-1px" }}
                    >
                      {stat.value}
                    </h2>
                    <p className="text-muted small fw-medium text-uppercase mb-0">
                      {stat.label}
                    </p>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: style.bg,
                      color: style.icon,
                      fontSize: 24,
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top border-light">
                  <span
                    className="small fw-bold"
                    style={{ color: style.trend }}
                  >
                    <FiTrendingUp className="me-1" /> {stat.trend}
                  </span>
                  <span className="text-muted small ms-2">
                    geçen aydan beri
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
