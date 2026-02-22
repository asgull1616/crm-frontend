"use client";
import React, { useEffect, useState } from "react";
import CardHeader from "@/components/shared/CardHeader";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";
import { activityService } from "@/lib/services/activity.service";

const timeAgoTR = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dakika önce`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} saat önce`;
  const day = Math.floor(hour / 24);
  return `${day} gün önce`;
};

const typeBadge = (type) => {
  const t = String(type || "").toUpperCase();

  if (t.includes("LOGIN")) return { bg: "#dbeafe", text: "#1d4ed8", label: "Giriş" };
  if (t.includes("TASK")) return { bg: "#dcfce7", text: "#166534", label: "Task" };
  if (t.includes("PROPOSAL")) return { bg: "#e0f2fe", text: "#075985", label: "Teklif" };
  if (t.includes("UPDATED") || t.includes("CHANGED"))
    return { bg: "#e9d5ff", text: "#6b21a8", label: "Güncelleme" };
  if (t.includes("CREATED")) return { bg: "#dcfce7", text: "#166534", label: "Oluşturma" };
  if (t.includes("DELETED")) return { bg: "#fee2e2", text: "#991b1b", label: "Silme" };

  return { bg: "#f1f5f9", text: "#334155", label: type || "-" };
};

const SystemLogs = ({ title = "Sistem Aktivite Hareketleri (Görev, Teklif, Proje)"}) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isRemoved) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        // ✅ son 5 aktivite
        const res = await activityService.list({ page: 1, limit: 5 });
        const data = res?.data ?? {};
        // backend şu an "data" döndürüyor: { meta, data: [...] }
        setItems(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.log("activities list error:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [refreshKey, isRemoved]);

  if (isRemoved) return null;

  return (
    <div className="col-xxl-12">
      <div
        className={`card border-0 shadow-sm ${isExpanded ? "card-expand" : ""} ${
          refreshKey ? "card-loading" : ""
        }`}
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        {/* Header */}
        <div className="px-4 pt-3">
          <CardHeader
            title={title}
            refresh={handleRefresh}
            remove={handleDelete}
            expanded={handleExpand}
          />
        </div>

        {/* Body */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr className="text-muted text-uppercase fw-bold">
                  <th className="ps-4 py-3 border-0" style={{ fontSize: 10, letterSpacing: "0.6px" }}>
                    Kullanıcı
                  </th>
                  <th className="py-3 border-0" style={{ fontSize: 10, letterSpacing: "0.6px" }}>
                    İşlem Detayı
                  </th>
                  <th className="py-3 border-0" style={{ fontSize: 10, letterSpacing: "0.6px" }}>
                    Tip
                  </th>
                  <th className="py-3 border-0 text-end pe-4" style={{ fontSize: 10, letterSpacing: "0.6px" }}>
                    Zaman
                  </th>
                </tr>
              </thead>

              <tbody>
                {!loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="ps-4 py-4" style={{ fontSize: 12, color: "#64748b" }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  items.map((a) => {
                    // ✅ Senin backend list() şu an createdByUser include etmiyor olabilir.
                    // Bu yüzden güvenli fallback kullanıyoruz:
                    const u = a.createdByUser || null;
                    const name = u?.fullName || u?.username || "—";
                    const initial = name?.trim?.()?.substring?.(0, 1) || "U";
                    const badge = typeBadge(a.type);

                    return (
                      <tr key={a.id} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {u?.avatarUrl ? (
                              <div style={{ width: 34, height: 34, borderRadius: 12, overflow: "hidden" }}>
                                <Image width={34} height={34} src={u.avatarUrl} alt="avatar" />
                              </div>
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center text-white"
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 12,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  background: "linear-gradient(135deg, #94a3b8, #475569)",
                                }}
                              >
                                {initial}
                              </div>
                            )}

                            <div style={{ lineHeight: 1.1 }}>
                              <div style={{ fontWeight: 800, fontSize: 12, color: "#0f172a" }}>
                                {name}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                                {u?.email ?? ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3" style={{ fontSize: 12, color: "#475569" }}>
                          {a.title}
                        </td>

                        <td className="py-3">
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px 12px",
                              borderRadius: 999,
                              fontWeight: 800,
                              fontSize: 11,
                              minWidth: 130,
                              backgroundColor: badge.bg,
                              color: badge.text,
                              border: "1px solid rgba(0,0,0,0.03)",
                            }}
                          >
                            {badge.label}
                          </span>
                        </td>

                        <td className="py-3 text-end pe-4" style={{ fontSize: 11, color: "#94a3b8" }}>
                          {timeAgoTR(a.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CardLoader refreshKey={refreshKey || loading} />
      </div>
    </div>
  );
};

export default SystemLogs;
