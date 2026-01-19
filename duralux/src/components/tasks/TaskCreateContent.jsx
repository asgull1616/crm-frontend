"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { customerService } from "@/lib/services/customer.service";

const initialForm = {
  title: "",
  description: "",
  customerId: "",
  startDate: "",
  endDate: "",
  status: "NEW",
};

const TaskCreateContent = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    customerService
      .list()
      .then((res) => {
        setCustomers(res?.data?.data ?? []);
      })
      .catch(() => {
        alert("Müşteriler yüklenemedi");
      });
  }, []);

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

  const onSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== ""),
      );

      await taskService.create(payload);
      router.push("/tasks/list");
    } catch (err) {
      console.error(err);
      alert("Görev oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="col-lg-8">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Yeni Görev</h5>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Başlık *</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Açıklama</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>

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

          <div className="row">
            <div className="col">
              <label className="form-label">Başlangıç</label>
              <input
                type="date"
                className="form-control"
                value={form.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
              />
            </div>

            <div className="col">
              <label className="form-label">Bitiş</label>
              <input
                type="date"
                className="form-control"
                value={form.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label">Durum</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
            >
              <option value="NEW">Yeni</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="ON_HOLD">Beklemede</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
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
