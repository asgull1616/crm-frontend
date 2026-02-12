"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { userService } from "@/lib/services/user.service";

const statusMeta = {
  NEW: { label: "Yeni", chipBg: "#F1F5F9", chipText: "#0F172A" },
  IN_PROGRESS: { label: "İşlemde", chipBg: "#EEF2FF", chipText: "#3730A3" },
  ON_HOLD: { label: "Beklemede", chipBg: "#FFFBEB", chipText: "#92400E" },
  COMPLETED: { label: "Tamamlandı", chipBg: "#ECFDF5", chipText: "#065F46" },
};

const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString("tr-TR") : "-";

export default function TaskListContent() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      NEW: tasks.filter((t) => t.status === "NEW").length,
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      ON_HOLD: tasks.filter((t) => t.status === "ON_HOLD").length,
      COMPLETED: tasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  const getUserLabel = (id) => {
    if (!id) return "-";
    const u = userMap.get(id);
    return u ? `${u.username} (${u.email})` : id;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, userRes] = await Promise.all([
        taskService.list({ page: 1, limit: 100 }),
        userService.list({ page: 1, limit: 100 }),
      ]);
      const taskData = taskRes?.data?.data ?? [];
      const userData = userRes?.data?.data ?? [];
      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  const statCards = [
    { key: "ALL", title: "Tümü", subtitle: "Toplam görev", value: stats.total },
    { key: "NEW", title: "Yeni", subtitle: "Yeni açılan", value: stats.NEW },
    {
      key: "IN_PROGRESS",
      title: "İşlemde",
      subtitle: "Devam eden",
      value: stats.IN_PROGRESS,
    },
    {
      key: "ON_HOLD",
      title: "Beklemede",
      subtitle: "Duraklatılan",
      value: stats.ON_HOLD,
    },
    {
      key: "COMPLETED",
      title: "Tamamlandı",
      subtitle: "Bitirilen",
      value: stats.COMPLETED,
    },
  ];

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="fw-semibold text-muted">Yükleniyor…</div>
      </div>
    );
  }

  return (
    <div className="col-12">
      {/* ÜST BAR */}
      <div className="d-flex align-items-center justify-content-end mb-3">


        <button
          className="btn btn-sm text-white px-3"
          style={{
            backgroundColor: "#E92B63",
            borderRadius: "10px",
            fontWeight: 700,
          }}
          onClick={() => router.push("/tasks/create")}
        >
          + Yeni Görev
        </button>
      </div>

      {/* İSTATİSTİK / FİLTRE KARTLARI */}
      <div className="row g-3 mb-4">
        {statCards.map((c) => {
          const active = filter === c.key;
          const width =
            stats.total === 0 ? 0 : Math.min(100, (c.value / stats.total) * 100);

          return (
            <div className="col-12 col-md" key={c.key}>
              <button
                type="button"
                className="w-100 text-start border-0 p-0 bg-transparent"
                onClick={() => setFilter(c.key)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card h-100 task-filter-card"
                  style={{
                    borderRadius: 14,
                    border: active ? "1px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: active
                      ? "0 8px 24px rgba(17,24,39,0.12)"
                      : "0 6px 18px rgba(17,24,39,0.06)",
                    transition: "all .2s ease",
                  }}
                >

                  <div className="card-body py-3">
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <div className="fw-semibold text-dark">{c.title}</div>
                        <div className="text-muted small">{c.subtitle}</div>
                      </div>
                      <div
                        className="fw-bold"
                        style={{
                          fontSize: 22,
                          color: active ? "#111827" : "#374151",
                        }}
                      >
                        {c.value}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div
                        style={{
                          height: 4,
                          borderRadius: 999,
                          background: "#F3F4F6",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${width}%`,
                            background: active ? "#111827" : "#9CA3AF",
                            borderRadius: 999,
                            transition: "width .18s ease",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* LİSTE KARTI */}
      <div
        className="card border-0"
        style={{
          borderRadius: 16,
          boxShadow: "0 10px 28px rgba(17,24,39,0.08)",
        }}
      >
        <div
          className="card-header bg-white border-0 d-flex align-items-center justify-content-between"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        >
          <div className="fw-bold text-dark">
            Görev Listesi{" "}
            <span className="text-muted fw-normal">({filteredTasks.length})</span>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => fetchAll()}
            title="Yenile"
          >
            ↻ Yenile
          </button>
        </div>

        <div className="card-body p-0">
          {filteredTasks.length === 0 ? (
            <div className="p-5 text-center">
              <div className="fw-semibold text-dark mb-1">Kayıt bulunamadı</div>
              <div className="text-muted small mb-3">
                Bu filtre için gösterilecek görev yok.
              </div>
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => setFilter("ALL")}
              >
                Filtreyi kaldır
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead style={{ background: "#F8FAFC" }}>
                  <tr className="text-muted small">
                    <th className="ps-4 py-3 border-0 fw-semibold">Başlık</th>
                    <th className="py-3 border-0 fw-semibold">Durum</th>
                    <th className="py-3 border-0 fw-semibold">Atanan</th>
                    <th className="py-3 border-0 fw-semibold">Bitiş</th>
                    <th className="py-3 pe-4 border-0 fw-semibold text-end">
                      Aksiyon
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((task) => {
                    const meta =
                      statusMeta[task.status] || {
                        label: task.status,
                        chipBg: "#F3F4F6",
                        chipText: "#111827",
                      };

                    return (
                      <tr
                        key={task.id}
                        style={{ borderTop: "1px solid #F1F5F9" }}
                      >
                        <td className="ps-4 py-3">
                          <div className="fw-semibold text-dark">{task.title}</div>
                        </td>

                        <td className="ps-4 py-4">


                          <span
                            className="px-2 py-1"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              borderRadius: 999,
                              background: meta.chipBg,
                              color: meta.chipText,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 999,
                                background: meta.chipText,
                                display: "inline-block",
                              }}
                            />
                            {meta.label}
                          </span>
                        </td>

                        <td className="py-3 text-muted small">
                          {getUserLabel(task.assignedUserId)}
                        </td>

                        <td className="py-3 text-muted small">
                          {formatDate(task.endDate)}
                        </td>

                        <td className="pe-4 text-end">
                          <div className="action-group">

                            <button
                              className="action-btn view"
                              onClick={() => router.push(`/tasks/view/${task.id}`)}
                            >
                              Görüntüle
                            </button>

                            <button
                              className="action-btn edit"
                              onClick={() => router.push(`/tasks/edit/${task.id}`)}
                            >
                              Düzenle
                            </button>

                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(task.id)}
                            >
                              Sil
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
