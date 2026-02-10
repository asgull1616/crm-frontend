"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { userService } from "@/lib/services/user.service";

const statusColors = {
  NEW: "secondary",
  IN_PROGRESS: "primary",
  ON_HOLD: "warning",
  COMPLETED: "success",
};

// Sayaç renkleri: ALL (Tümü) orta tonda bir gümüş gri yapıldı
const statusHexCodes = {
  ALL: "#cbd5e0", // Orta ton Gümüş/Gri
  NEW: "#6c757d", // secondary
  IN_PROGRESS: "#0d6efd", // primary
  ON_HOLD: "#ffc107", // warning
  COMPLETED: "#198754", // success
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
      new: tasks.filter((t) => t.status === "NEW").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      onHold: tasks.filter((t) => t.status === "ON_HOLD").length,
      completed: tasks.filter((t) => t.status === "COMPLETED").length,
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

  if (loading)
    return (
      <div className="p-5 text-center fw-bold text-primary">Yükleniyor...</div>
    );

  return (
    <div className="col-12">
      {/* İstatistik Sayaçları */}
      <div className="row g-3 mb-4">
        {[
          { label: "TÜMÜ", count: stats.total, key: "ALL", icon: "📋" },
          { label: "YENİ", count: stats.new, key: "NEW", icon: "🆕" },
          {
            label: "İŞLEMDE",
            count: stats.inProgress,
            key: "IN_PROGRESS",
            icon: "⚡",
          },
          {
            label: "BEKLEMEDE",
            count: stats.onHold,
            key: "ON_HOLD",
            icon: "🕒",
          },
          {
            label: "TAMAMLANDI",
            count: stats.completed,
            key: "COMPLETED",
            icon: "✅",
          },
        ].map((item) => (
          <div className="col" key={item.key}>
            <div
              className="card border-0 shadow-sm h-100 transition-all"
              style={{
                cursor: "pointer",
                backgroundColor:
                  filter === item.key ? statusHexCodes[item.key] : "white",
                color: filter === item.key ? "white" : "inherit",
                borderRadius: "15px",
                transition: "all 0.3s ease",
                borderBottom:
                  filter !== item.key
                    ? `4px solid ${statusHexCodes[item.key]}`
                    : "none",
              }}
              onClick={() => setFilter(item.key)}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div
                      className={`small fw-bold mb-1 ${filter === item.key ? "text-white-50" : "text-muted"}`}
                    >
                      {item.label}
                    </div>
                    <div className="h2 mb-0 fw-bold">{item.count}</div>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "35px",
                      height: "35px",
                      backgroundColor:
                        filter === item.key
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.05)",
                      fontSize: "1rem",
                    }}
                  >
                    {item.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Görev Listesi */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-0">
          <h5 className="mb-0 fw-bold text-dark">Görev Listesi</h5>
          <button
            className="btn text-white px-4 shadow-sm"
            style={{
              backgroundColor: "#E92B63",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
            onClick={() => router.push("/tasks/create")}
          >
            + YENİ GÖREV
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 border-0 text-muted small fw-bold">
                    BAŞLIK
                  </th>
                  <th className="border-0 text-muted small fw-bold">DURUM</th>
                  <th className="border-0 text-muted small fw-bold">ATANAN</th>
                  <th className="border-0 text-muted small fw-bold">BİTİŞ</th>
                  <th className="text-end pe-4 border-0 text-muted small fw-bold">
                    AKSİYON
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="ps-4 fw-bold text-dark">{task.title}</td>
                    <td>
                      <span
                        className={`badge bg-${statusColors[task.status]} px-3 py-2 rounded-pill`}
                        style={{ fontSize: "0.7rem" }}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {getUserLabel(task.assignedUserId)}
                    </td>
                    <td className="text-muted small">
                      {formatDate(task.endDate)}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="Görüntüle"
                          onClick={() => router.push(`/tasks/view/${task.id}`)}
                        >
                          👁️
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Güncelle"
                          onClick={() => router.push(`/tasks/edit/${task.id}`)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Sil"
                          onClick={() => handleDelete(task.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
