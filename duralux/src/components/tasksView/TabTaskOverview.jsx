"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import { taskService } from "@/lib/services/task.service";
import { userService } from "@/lib/services/user.service"; // ✅ YENİ

const statusLabel = {
  NEW: "Yeni",
  IN_PROGRESS: "Devam Ediyor",
  ON_HOLD: "Beklemede",
  COMPLETED: "Tamamlandı",
};

const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString("tr-TR") : "-";

export default function TabTaskOverview({ taskId }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);

  const [users, setUsers] = useState([]); // ✅ YENİ

  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  const assignedUserLabel = useMemo(() => {
    const id = task?.assignedUserId;
    if (!id) return "-";
    const u = userMap.get(id);
    return u ? `${u.username} (${u.email})` : id;
  }, [task?.assignedUserId, userMap]);

  const resolvedStatus = useMemo(() => {
    const s = task?.status;
    return statusLabel[s] ?? s ?? "-";
  }, [task?.status]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [taskRes, userRes] = await Promise.all([
          taskService.findOne(taskId),
          userService.list({ page: 1, limit: 100 }), // ✅ Max 100
        ]);

        const t = taskRes?.data?.data ?? taskRes?.data ?? null;
        const u = userRes?.data?.data ?? [];

        if (!mounted) return;
        setTask(t);
        setUsers(Array.isArray(u) ? u : []);
      } catch (e) {
        console.error(e);
        if (mounted) {
          setTask(null);
          setUsers([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (taskId) load();
    return () => {
      mounted = false;
    };
  }, [taskId]);

  if (loading) {
    return (
      <div className="tab-pane fade active show" id="overviewTab">
        <div className="card stretch stretch-full">
          <div className="card-body">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="tab-pane fade active show" id="overviewTab">
        <div className="card stretch stretch-full">
          <div className="card-body">Görev bulunamadı.</div>
        </div>
      </div>
    );
  }

  const customer = task.customer ?? null;

  return (
    <div className="tab-pane fade active show" id="overviewTab">
      <div className="row">
        <div className="col-lg-12">
          <div className="card stretch stretch-full">
            <div className="card-body task-header d-md-flex align-items-center justify-content-between">
              <div className="me-4">
                <h4 className="mb-2 fw-bold d-flex">
                  <span className="text-truncate-1-line">Görev Detayları</span>
                </h4>
                <div className="text-muted">{task.title}</div>
              </div>

              <div className="mt-4 mt-md-0">
                <div className="d-flex gap-2">
                  <a
                    href="#"
                    className="btn btn-icon"
                    title="Tamamlandı olarak işaretle"
                    onClick={(e) => e.preventDefault()}
                  >
                    <FiCheckCircle size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT */}
        <div className="col-xl-8">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label">Görev</label>
                  <p className="mb-0">{task.title}</p>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">Durum</label>
                  <p className="mb-0">{resolvedStatus}</p>
                </div>

                {/* ✅ YENİ: Atanan kişi */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">Atanan Kişi</label>
                  <p className="mb-0">{assignedUserLabel}</p>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">Başlangıç Tarihi</label>
                  <p className="mb-0">{formatDate(task.startDate)}</p>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">Bitiş Tarihi</label>
                  <p className="mb-0">{formatDate(task.endDate)}</p>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Tanım</label>
                  <p className="mb-0">{task.description || "-"}</p>
                </div>
              </div>

              {/* CUSTOMER CARD */}
              <div className="card mb-0 mt-3">
                <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                  <span>Müşteri</span>
                  {customer?.id ? (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        router.push(`/customers/view/${customer.id}`)
                      }
                    >
                      Gör
                    </button>
                  ) : null}
                </div>

                <div className="card-body">
                  {customer ? (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Ad Soyad</label>
                        <p className="mb-0">
                          {customer.fullName ?? customer.name ?? "-"}
                        </p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">E-posta</label>
                        <p className="mb-0">{customer.email ?? "-"}</p>
                      </div>

                      <div className="col-md-6 mb-0">
                        <label className="form-label">Telefon</label>
                        <p className="mb-0">{customer.phone ?? "-"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted">
                      Bu görev için müşteri bilgisi bulunamadı.
                    </div>
                  )}
                </div>
              </div>
              {/* /CUSTOMER CARD */}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-xl-4">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label">Oluşturulma</label>
                <p className="mb-0">{formatDate(task.createdAt)}</p>
              </div>

              <div className="mb-0">
                <label className="form-label">Güncellenme</label>
                <p className="mb-0">{formatDate(task.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
