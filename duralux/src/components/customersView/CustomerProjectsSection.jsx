"use client";
import React, { useEffect, useState } from "react";
import { FiPackage, FiExternalLink, FiCalendar, FiTag } from "react-icons/fi";
import { projectsApi } from "@/lib/services/projects.service";
import Link from "next/link";

const CustomerProjectsSection = ({ customerId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) loadProjects();
  }, [customerId]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.list({ customerId });
      // projectsApi.list returns res.items or res (if it's already res.data)
      const list = res?.items || res?.data?.items || res?.data || [];
      setProjects(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Projeler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      TEKLIF: { label: "Teklif", color: "#3b82f6", bg: "#eff6ff" },
      GELISTIRME: { label: "Geliştirme", color: "#f59e0b", bg: "#fffbeb" },
      TEST: { label: "Test", color: "#10b981", bg: "#ecfdf5" },
    };
    const s = statusMap[status] || { label: status, color: "#6b7280", bg: "#f3f4f6" };
    return (
      <span 
        className="px-2 py-1 rounded-pill fw-bold" 
        style={{ fontSize: "10px", color: s.color, backgroundColor: s.bg }}
      >
        {s.label}
      </span>
    );
  };

  const cardStyle = { borderRadius: "25px", background: "#ffffff" };

  return (
    <div className="card border-0 shadow-sm p-4 h-100" style={cardStyle}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: "#374151" }}>
          <FiPackage className="text-muted" /> Müşteriye Ait Projeler
        </h6>
        <Link href="/projects/board" className="btn btn-sm btn-light rounded-pill px-3 text-muted fw-bold" style={{ fontSize: "11px" }}>
          Tümünü Gör
        </Link>
      </div>

      {loading ? (
        <p className="text-muted small">Yükleniyor...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted small mb-0">Bu müşteriye ait henüz bir proje bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="vstack gap-3">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="p-3 border rounded-3 position-relative hover-shadow transition-all"
              style={{ borderColor: "#f1f5f9" }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1 text-dark fs-14">{project.name}</h6>
                  <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: "11px" }}>
                    <span className="d-flex align-items-center gap-1">
                      <FiTag size={12} /> {project.type || "Diğer"}
                    </span>
                    {project.deliveryDate && (
                      <span className="d-flex align-items-center gap-1">
                        <FiCalendar size={12} /> {new Date(project.deliveryDate).toLocaleDateString("tr-TR")}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(project.status)}
              </div>
              
              <Link 
                href={`/projects/${project.id}`} 
                className="stretched-link d-none"
              ></Link>
              
              <div className="d-flex justify-content-end mt-2">
                 <Link href={`/projects/${project.id}`} className="text-primary text-decoration-none d-flex align-items-center gap-1 fw-bold" style={{ fontSize: "12px" }}>
                   Detaya Git <FiExternalLink size={12} />
                 </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .transition-all { transition: all 0.3s ease; }
        .hover-shadow:hover { 
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerProjectsSection;
