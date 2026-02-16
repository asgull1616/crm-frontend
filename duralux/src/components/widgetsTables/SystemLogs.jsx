"use client";

import React, { useState } from "react";
import CardHeader from "@/components/shared/CardHeader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { FiSearch, FiClock, FiUser, FiZap } from "react-icons/fi";

const logsData = [
  { id: 1, user: "Ahmet Yılmaz", action: "Sisteme Giriş Yaptı", type: "login", time: "2 dakika önce", initial: "A", color: "#6366f1" },
  { id: 2, user: "Mehmet Demir", action: "Teklif Durumunu Güncelledi", type: "update", time: "15 dakika önce", initial: "M", color: "#8b5cf6" },
  { id: 3, user: "Selin Ak", action: "Yeni Müşteri Eklendi: ABC A.Ş.", type: "create", time: "1 saat önce", initial: "S", color: "#ec4899" },
  { id: 4, user: "Admin", action: "Kritik Ayarlar Değiştirildi", type: "warning", time: "3 saat önce", initial: "A", color: "#f59e0b" },
  { id: 5, user: "Caner Öz", action: "Bir Dosya Sildi", type: "delete", time: "5 saat önce", initial: "C", color: "#ef4444" },
];

const getBadge = (type) => {
    switch (type) {
        case 'login': return <span className="crm-badge bg-soft-info text-info">Giriş</span>
        case 'update': return <span className="crm-badge bg-soft-primary text-primary">Güncelleme</span>
        case 'create': return <span className="crm-badge bg-soft-success text-success">Oluşturma</span>
        case 'warning': return <span className="crm-badge bg-soft-warning text-warning">Kritik</span>
        case 'delete': return <span className="crm-badge bg-soft-danger text-danger">Silme</span>
        default: return <span className="crm-badge bg-soft-secondary text-secondary">İşlem</span>
    }
}

const SystemLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

  if (isRemoved) return null;

  const filteredLogs = logsData.filter((log) =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-xxl-12 mt-4">
      <div className={`card stretch stretch-full border-0 ${isExpanded ? "card-expand" : ""}`} 
        style={{ 
          borderRadius: "24px", 
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
          background: "linear-gradient(to bottom, #ffffff, #fcfcfd)"
        }}>
        
        <div className="d-flex justify-content-between align-items-center pe-4 py-2">
          <CardHeader title="Sistem Aktivite Hareketleri" refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />
          
          <div className="search-box position-relative" style={{ width: "280px" }}>
            <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }} />
            <input
              type="text"
              className="form-control border-0 shadow-none ps-5"
              placeholder="Kullanıcı veya işlem ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                fontSize: "13px", 
                borderRadius: "12px", 
                backgroundColor: "#f1f5f9",
                height: "40px"
              }}
            />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="bg-light-subtle">
                  <th className="ps-4 py-4 border-0 text-muted small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Kullanıcı</th>
                  <th className="border-0 text-muted small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>İşlem Detayı</th>
                  <th className="border-0 text-center text-muted small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Durum</th>
                  <th className="text-end pe-4 border-0 text-muted small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Zaman Akışı</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="transition-all">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm me-3"
                          style={{ 
                            width: "38px", 
                            height: "38px", 
                            fontSize: "14px",
                            background: `linear-gradient(135deg, ${log.color}aa, ${log.color})` 
                          }}
                        >
                          {log.initial}
                        </div>
                        <div>
                          <span className="fw-bold d-block text-dark mb-0 fs-14">{log.user}</span>
                          <span className="text-muted" style={{ fontSize: "13px" }}>IP Adresi Gizlendi</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-muted fs-15">
                        <FiZap className="me-2 text-warning opacity-50" />
                        {log.action}
                      </div>
                    </td>
                    <td className="text-center">{getBadge(log.type)}</td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center text-muted small bg-light px-3 py-1 rounded-pill">
                        <FiClock className="me-1" size={12} />
                        {log.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-transparent border-0 py-4 text-center">
          <p className="text-muted small fw-medium mb-0">
            <span className="badge bg-dark text-white rounded-pill px-3 me-2">{filteredLogs.length}</span>
            Aktif hareket listeleniyor
          </p>
        </div>
      </div>

      <style jsx>{`
        .transition-all { transition: all 0.2s ease-in-out; cursor: pointer; }
        .transition-all:hover { background-color: #f8fafc; transform: scale(1.002); }
      `}</style>
    </div>
  );
};

export default SystemLogs;