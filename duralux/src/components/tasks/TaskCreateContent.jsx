"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { customerService } from "@/lib/services/customer.service";
import { userService } from "@/lib/services/user.service";

const initialForm = {
  title: "",
  description: "",
  customerId: "",
  assignedUserId: "",
  startDate: "",
  endDate: "",
  status: "NEW",
};

const TaskCreateContent = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // -----------------------
  // FETCH DATA
  // -----------------------
  useEffect(() => {
    customerService.list().then((res) => {
      setCustomers(res?.data?.data ?? res?.data?.items ?? []);
    });

    userService.list({ page: 1, limit: 100 }).then((res) => {
      setUsers(res?.data?.data ?? res?.data?.items ?? []);
    });
  }, []);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // -----------------------
  // VALIDATION (DTO UYUMLU)
  // -----------------------
  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = "Başlık zorunludur.";
    if (!form.description.trim()) e.description = "Açıklama zorunludur.";
    if (!form.assignedUserId)
      e.assignedUserId = "Görev atanacak kullanıcı seçilmelidir.";
    if (!form.startDate) e.startDate = "Başlangıç tarihi zorunludur.";
    if (!form.endDate) e.endDate = "Bitiş tarihi zorunludur.";
    if (!form.status) e.status = "Durum seçilmelidir.";

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "Bitiş tarihi başlangıçtan önce olamaz.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // -----------------------
  // SUBMIT
  // -----------------------
  const onSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        assignedUserId: form.assignedUserId,
        customerId: form.customerId || undefined,
        status: form.status,
        startDate: `${form.startDate}T00:00:00.000Z`,
        endDate: `${form.endDate}T00:00:00.000Z`,
      };

      await taskService.create(payload);
      router.push("/tasks/list");
    } catch (err) {
      console.error(err);
      alert("Görev oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="col-lg-8">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Yeni Görev</h5>
        </div>

        <div className="card-body">
          {/* TITLE */}
          <div className="mb-3">
            <label className="form-label">Başlık *</label>
            <input
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              value={form.title}
              onChange={(e) => {
                onChange("title", e.target.value);
                setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && (
              <div className="text-danger mt-1">{errors.title}</div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label">Açıklama *</label>
            <textarea
              rows={4}
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              value={form.description}
              onChange={(e) => {
                onChange("description", e.target.value);
                setErrors({ ...errors, description: null });
              }}
            />
            {errors.description && (
              <div className="text-danger mt-1">{errors.description}</div>
            )}
          </div>

          {/* ASSIGNED USER */}
          <div className="mb-3">
            <label className="form-label">Görev Atanacak Kişi *</label>
            <select
              className={`form-select ${errors.assignedUserId ? "is-invalid" : ""}`}
              value={form.assignedUserId}
              onChange={(e) => {
                onChange("assignedUserId", e.target.value);
                setErrors({ ...errors, assignedUserId: null });
              }}
            >
              <option value="">Seçiniz</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username || u.email}
                </option>
              ))}
            </select>
            {errors.assignedUserId && (
              <div className="text-danger mt-1">{errors.assignedUserId}</div>
            )}
          </div>

          {/* CUSTOMER (OPTIONAL) */}
          <div className="mb-3">
            <label className="form-label">Müşteri</label>
            <select
              className="form-select"
              value={form.customerId}
              onChange={(e) => onChange("customerId", e.target.value)}
            >
              <option value="">Seçiniz</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* DATES */}
          <div className="row">
            <div className="col">
              <label className="form-label">Başlangıç *</label>
              <input
                type="date"
                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                value={form.startDate}
                onChange={(e) => {
                  onChange("startDate", e.target.value);
                  setErrors({ ...errors, startDate: null });
                }}
              />
              {errors.startDate && (
                <div className="text-danger mt-1">{errors.startDate}</div>
              )}
            </div>

            <div className="col">
              <label className="form-label">Bitiş *</label>
              <input
                type="date"
                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                value={form.endDate}
                onChange={(e) => {
                  onChange("endDate", e.target.value);
                  setErrors({ ...errors, endDate: null });
                }}
              />
              {errors.endDate && (
                <div className="text-danger mt-1">{errors.endDate}</div>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="mt-3">
            <label className="form-label">Durum *</label>
            <select
              className={`form-select ${errors.status ? "is-invalid" : ""}`}
              value={form.status}
              onChange={(e) => {
                onChange("status", e.target.value);
                setErrors({ ...errors, status: null });
              }}
            >
              <option value="NEW">Yeni</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="ON_HOLD">Beklemede</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
            {errors.status && (
              <div className="text-danger mt-1">{errors.status}</div>
            )}
          </div>

          <div className="mt-4 text-end">
            <button
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={saving}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCreateContent;
