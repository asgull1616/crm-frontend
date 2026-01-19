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

const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString("tr-TR") : "-";

export default function TaskListContent() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  const getUserLabel = (id) => {
    if (!id) return "-";
    const u = userMap.get(id);
    return u ? `${u.username} (${u.email})` : id; // bulunamazsa id göster
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, userRes] = await Promise.all([
        taskService.list({ page: 1, limit: 10 }),
        userService.list({ page: 1, limit: 100 }), // ✅ Max 100
      ]);

      const taskData = taskRes?.data?.data ?? [];
      const userData = userRes?.data?.data ?? [];

      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
      alert("Görevler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openView = (task) => {
    router.push(`/tasks/view/${task.id}`);
  };

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
  className="btn btn-sm text-white"
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
  }}
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
                <th>Atanan</th>
                <th>Oluşturan</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th className="text-end">Aksiyon</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    Henüz görev yok
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>

                    <td>
                      <span
                        className={`badge bg-${statusColors[task.status] ?? "secondary"}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td>{getUserLabel(task.assignedUserId)}</td>
                    <td>{getUserLabel(task.createdByUserId)}</td>

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
