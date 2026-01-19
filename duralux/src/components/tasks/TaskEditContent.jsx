"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { customerService } from "@/lib/services/customer.service";

const toInputDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const initialForm = {
  title: "",
  description: "",
  customerId: "",
  startDate: "",
  endDate: "",
  status: "NEW",
};

const statusOptions = [
  { value: "NEW", label: "Yeni" },
  { value: "IN_PROGRESS", label: "Devam Ediyor" },
  { value: "ON_HOLD", label: "Beklemede" },
  { value: "COMPLETED", label: "Tamamlandı" },
];

export default function TaskEditContent({ taskId }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(true);

  const [task, setTask] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);

  const canSave = useMemo(
    () => !saving && !!form.title.trim(),
    [saving, form.title],
  );

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert("Başlık zorunludur");
      return false;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      alert("Bitiş tarihi başlangıçtan önce olamaz");
      return false;
    }
    return true;
  };

  // 1) Task'ı getir ve formu doldur
  useEffect(() => {
    let mounted = true;

    const loadTask = async () => {
      setLoading(true);
      try {
        const res = await taskService.findOne(taskId);
        const t = res?.data?.data ?? res?.data ?? null;

        if (!mounted) return;

        setTask(t);
        setForm({
          title: t?.title ?? "",
          description: t?.description ?? "",
          customerId: t?.customerId ?? "",
          startDate: toInputDate(t?.startDate),
          endDate: toInputDate(t?.endDate),
          status: t?.status ?? "NEW",
        });
      } catch (e) {
        console.error("TASK FINDONE ERROR:", e?.response?.data ?? e);
        if (mounted) setTask(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (taskId) loadTask();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  // 2) Customers listesi
  useEffect(() => {
    let mounted = true;

    const loadCustomers = async () => {
      setCustomersLoading(true);
      try {
        const res = await customerService.list({ page: 1, limit: 50 });
        const data = res?.data?.data ?? res?.data ?? [];
        if (!mounted) return;
        setCustomers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("CUSTOMER LIST ERROR:", e?.response?.data ?? e);
        alert("Müşteriler yüklenemedi");
        if (mounted) setCustomers([]);
      } finally {
        if (mounted) setCustomersLoading(false);
      }
    };

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // boş stringleri göndermeyelim (API tarafında disconnect logic'i var)
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== ""),
      );

      await taskService.update(taskId, payload);

      router.push(`/tasks/view/${taskId}`);
    } catch (e) {
      console.error("TASK UPDATE ERROR:", e?.response?.data ?? e);
      alert("Görev güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="col-12">Yükleniyor...</div>;

  if (!task) {
    return (
      <div className="col-12">
        <div className="card">
          <div className="card-body">Görev bulunamadı.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-8">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Görev Düzenle</h5>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => router.push(`/tasks/view/${taskId}`)}
            disabled={saving}
          >
            Detaya Dön
          </button>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Başlık *</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Açıklama</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Müşteri</label>
            <select
              className="form-select"
              value={form.customerId}
              onChange={(e) => onChange("customerId", e.target.value)}
              disabled={customersLoading || saving}
            >
              <option value="">
                {customersLoading ? "Yükleniyor..." : "Seçiniz"}
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName ?? c.name ?? "(İsimsiz)"}
                </option>
              ))}
            </select>

            {task.customer?.fullName && !customersLoading ? (
              <div className="form-text">
                Mevcut: <b>{task.customer.fullName}</b>
              </div>
            ) : null}
          </div>

          <div className="row">
            <div className="col">
              <label className="form-label">Başlangıç</label>
              <input
                type="date"
                className="form-control"
                value={form.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="col">
              <label className="form-label">Bitiş</label>
              <input
                type="date"
                className="form-control"
                value={form.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label">Durum</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
              disabled={saving}
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              className="btn btn-light"
              onClick={() => router.push("/tasks/list")}
              disabled={saving}
            >
              İptal
            </button>

            <button
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={!canSave}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
