"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { userService } from "@/lib/services/user.service";
import { projectsApi } from "@/lib/services/projects.service"; // ✅ EKLENDİ

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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  // ✅ Backend filtreleri
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      NEW: tasks.filter((t) => t.status === "NEW").length,
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      ON_HOLD: tasks.filter((t) => t.status === "ON_HOLD").length,
      COMPLETED: tasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [tasks]);

  // ✅ Stat filtreleri UI tarafında kalsın
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
      const [taskRes, userRes, projectRes] = await Promise.all([
        taskService.list({
          page: 1,
          limit: 100,
          projectId: selectedProject || undefined,
          assignedUserId: selectedUser || undefined,
        }),
        userService.list({ page: 1, limit: 100 }),
        projectsApi.list({ page: 1, limit: 200 }),
      ]);

      const taskData = taskRes?.data?.data ?? [];
      const userData = userRes?.data?.data ?? [];
      const projectData = projectRes?.data ?? projectRes?.items ?? projectRes ?? [];

      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedProject, selectedUser]);

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
    { key: "IN_PROGRESS", title: "İşlemde", subtitle: "Devam eden", value: stats.IN_PROGRESS },
    { key: "ON_HOLD", title: "Beklemede", subtitle: "Duraklatılan", value: stats.ON_HOLD },
    { key: "COMPLETED", title: "Tamamlandı", subtitle: "Bitirilen", value: stats.COMPLETED },
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

      {/* ✅ ÇALIŞAN + PROJE FİLTRELERİ */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <label className="text-muted small fw-semibold mb-1 d-block">Çalışan</label>
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ borderRadius: 12 }}
          >
            <option value="">Tümü</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-5">
          <label className="text-muted small fw-semibold mb-1 d-block">Proje</label>
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ borderRadius: 12 }}
          >
            <option value="">Tümü</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            style={{ borderRadius: 12 }}
            onClick={() => {
              setSelectedUser("");
              setSelectedProject("");
            }}
          >
            Filtreyi Temizle
          </button>
        </div>
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
            <div className="table-responsive task-table-wrap">
              <table className="table align-middle mb-0">
                <thead style={{ background: "#F8FAFC" }}>
                  <tr className="text-muted small">
                    <th className="ps-4 py-3 border-0 fw-semibold">Görev Adı</th>
                    <th className="py-3 border-0 fw-semibold">Proje</th>
                    <th className="py-3 border-0 fw-semibold">Durum</th>
                    <th className="py-3 border-0 fw-semibold">Atanan</th>
                    <th className="py-3 border-0 fw-semibold">Bitiş</th>
                    <th className="py-3 border-0 fw-semibold task-actions-th">
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
                      <tr key={task.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                        <td className="ps-4 py-3">
                          <div className="fw-semibold text-dark">{task.title}</div>
                        </td>

                        <td className="py-3 text-muted small">
                          {task.project?.name ?? "-"}
                        </td>

                        <td className="py-3">
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

                        <td className="py-3 task-actions-td">
                          <div className="task-actions">
                            <button
                              className="btn btn-sm btn-outline-secondary task-action-btn"
                              title="Görüntüle"
                              onClick={() => router.push(`/tasks/view/${task.id}`)}
                            >
                              Görüntüle
                            </button>

                            <button
                              className="btn btn-sm btn-outline-primary task-action-btn"
                              title="Güncelle"
                              onClick={() => router.push(`/tasks/edit/${task.id}`)}
                            >
                              Düzenle
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger task-action-btn"
                              title="Sil"
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

      <style jsx global>{`
        /* ===== FILTRE KARTLARI PEMBE HOVER ===== */
        .task-filter-card {
          transition: all 0.25s ease;
        }
        .task-filter-card:hover {
          transform: translateY(-4px);
          background: #fff0f6;
          border: 1px solid #f8a5c2 !important;
          box-shadow: 0 12px 28px rgba(233, 43, 99, 0.18);
        }
        .task-filter-card.active,
        .task-filter-card.active:hover {
          background: linear-gradient(135deg, #ffe4ec, #ffc1d6) !important;
          border: 1px solid #e92b63 !important;
          box-shadow: 0 14px 34px rgba(233, 43, 99, 0.25);
        }

        /* ✅ EN KRİTİK DÜZELTME: SAĞDAN KIRPILMAYI BİTİR */
        .task-table-wrap {
          padding-right: 18px; /* butonlar sağa yapışmasın */
        }

        /* ✅ SADECE AKSİYON BUTONLARINI ZORLA DÜZELT (theme override'ını kır) */
.task-actions {
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 10px !important;
  flex-wrap: nowrap !important;
}

.task-action-btn {
  /* theme’in verdiği fixed width/padding’i ez */
  width: auto !important;
  min-width: 88px !important;     /* yazılar sığsın */
  padding: 7px 12px !important;   /* rahat */
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  white-space: nowrap !important;
  line-height: 1 !important;
  letter-spacing: 0 !important;
  font-size: 12px !important;
}

/* Aksiyon kolonunun daralmasını engelle */
.task-actions-th,
.task-actions-td {
  min-width: 300px !important;
  white-space: nowrap !important;
}

.task-actions-td {
  text-align: right !important;
}


        @media (max-width: 520px) {
          .task-table-wrap {
            padding-right: 10px;
          }
          .task-actions-th,
          .task-actions-td {
            width: 220px;
            min-width: 220px;
          }
          .task-actions {
            flex-wrap: wrap;
            gap: 6px;
          }
          .task-action-btn {
            padding: 6px 8px;
          }
        }
      `}</style>
    </div>
  );
}
