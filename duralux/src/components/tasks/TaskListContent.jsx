"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";

const statusColors = {
  NEW: "secondary",
  IN_PROGRESS: "primary",
  ON_HOLD: "warning",
  COMPLETED: "success",
};

const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString("tr-TR") : "-";

export default function TaskListContent() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskService.list({ page: 1, limit: 10 });
      const { data } = res?.data ?? {};
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Görevler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openView = (task) => {
    router.push(`/tasks/view/${task.id}`);
  };

  // ✅ EDIT -> ROUTE
  const openEdit = (task) => {
    router.push(`/tasks/edit/${task.id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Görev silinsin mi?")) return;
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız");
    }
  };

  if (loading) return <div className="col-12">Yükleniyor...</div>;

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Görevler</h5>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => router.push("/tasks/create")}
          >
            + Yeni Görev
          </button>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Durum</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th className="text-end">Aksiyon</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Henüz görev yok
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          statusColors[task.status] ?? "secondary"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>{formatDate(task.startDate)}</td>
                    <td>{formatDate(task.endDate)}</td>

                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => openView(task)}
                        >
                          Görüntüle
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(task)}
                        >
                          Güncelle
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(task.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
