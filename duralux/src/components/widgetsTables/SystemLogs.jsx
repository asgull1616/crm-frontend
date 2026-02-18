"use client";

import React, { useState } from "react";
import CardHeader from "@/components/shared/CardHeader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { FiSearch, FiClock, FiZap } from "react-icons/fi";

const logsData = [
  { id: 1, user: "Ahmet Yılmaz", action: "Sisteme Giriş Yaptı", type: "login", time: "2 dakika önce", initial: "A", color: "#6366f1" },
  { id: 2, user: "Mehmet Demir", action: "Teklif Durumunu Güncelledi", type: "update", time: "15 dakika önce", initial: "M", color: "#8b5cf6" },
  { id: 3, user: "Selin Ak", action: "Yeni Müşteri Eklendi: ABC A.Ş.", type: "create", time: "1 saat önce", initial: "S", color: "#ec4899" },
  { id: 4, user: "Admin", action: "Kritik Ayarlar Değiştirildi", type: "warning", time: "3 saat önce", initial: "A", color: "#f59e0b" },
  { id: 5, user: "Caner Öz", action: "Bir Dosya Sildi", type: "delete", time: "5 saat önce", initial: "C", color: "#ef4444" },
];

const getBadge = (type) => {
  switch (type) {
    case "login":
      return (
        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{ fontSize: "10px", backgroundColor: "#cfe2ff", color: "#084298", border: "1px solid rgba(0,0,0,0.03)" }}
        >
          Giriş
        </span>
      );
    case "update":
      return (
        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{ fontSize: "10px", backgroundColor: "#e7ddff", color: "#4c1d95", border: "1px solid rgba(0,0,0,0.03)" }}
        >
          Güncelleme
        </span>
      );
    case "create":
      return (
        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{ fontSize: "10px", backgroundColor: "#d1e7dd", color: "#0f5132", border: "1px solid rgba(0,0,0,0.03)" }}
        >
          Oluşturma
        </span>
      );
    case "warning":
      return (
        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{ fontSize: "10px", backgroundColor: "#fff3cd", color: "#664d03", border: "1px solid rgba(0,0,0,0.03)" }}
        >
          Kritik
        </span>
      );
    case "delete":
      return (
        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{ fontSize: "10px", backgroundColor: "#f8d7da", color: "#842029", border: "1px solid rgba(0,0,0,0.03)" }}
        >
          Silme
        </span>
      );
    default:
      return (
        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{ fontSize: "10px", backgroundColor: "#e2e3e5", color: "#41464b", border: "1px solid rgba(0,0,0,0.03)" }}
        >
          İşlem
        </span>
      );
  }
};

const SystemLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

  if (isRemoved) return null;

  const filteredLogs = logsData.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-xxl-12 mt-4">
      <div
        className={`card border-0 shadow-sm ${isExpanded ? "card-expand" : ""}`}
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3">
          <CardHeader
            title="Sistem Aktivite Hareketleri"
            refresh={handleRefresh}
            remove={handleDelete}
            expanded={handleExpand}
          />

          <div className="position-relative" style={{ width: "240px" }}>
            <FiSearch
              className="position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ color: "#94a3b8" }}
            />
            <input
              type="text"
              className="form-control border-0 shadow-none ps-5"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontSize: "11px",
                borderRadius: "12px",
                height: "34px",
                backgroundColor: "#f8fafc",
                color: "#0f172a",
              }}
            />
          </div>
        </div>

        {/* BODY */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr className="text-muted text-uppercase fw-bold">
                  <th className="ps-4 py-3 border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Kullanıcı
                  </th>
                  <th className="border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    İşlem Detayı
                  </th>
                  <th className="border-0 text-center" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Tip
                  </th>
                  <th className="text-end pe-4 border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Zaman
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="d-flex align-items-center justify-content-center text-white me-3"
                          style={{
                            background: `linear-gradient(135deg, ${log.color}aa, ${log.color})`,
                            width: "32px",
                            height: "32px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 700,
                            boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
                          }}
                        >
                          {log.initial}
                        </div>
                        <span className="fw-bold" style={{ fontSize: "12px", color: "#0f172a" }}>
                          {log.user}
                        </span>
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="d-flex align-items-center" style={{ fontSize: "12px", color: "#64748b" }}>
                        <FiZap className="me-2" style={{ color: "#f59e0b", opacity: 0.55 }} size={12} />
                        {log.action}
                      </div>
                    </td>

                    <td className="text-center py-3">{getBadge(log.type)}</td>

                    <td className="text-end pe-4 py-3" style={{ fontSize: "11px", color: "#94a3b8" }}>
                      <FiClock className="me-1" size={11} /> {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer bg-transparent border-0 py-3 text-start ps-4">
          <span className="text-muted" style={{ fontSize: "11px", opacity: 0.8 }}>
            Toplam {filteredLogs.length} aktif kayıt
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
