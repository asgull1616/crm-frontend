"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { customerService } from "@/lib/services/customer.service";
import { userService } from "@/lib/services/profile.service";

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

  useEffect(() => {
    customerService.list().then((res) => setCustomers(res?.data?.data ?? res?.data?.items ?? []));
    userService.list({ page: 1, limit: 100 }).then((res) => setUsers(res?.data?.data ?? res?.data?.items ?? []));
  }, []);

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Başlık zorunludur.";
    if (!form.description.trim()) e.description = "Açıklama zorunludur.";
    if (!form.assignedUserId) e.assignedUserId = "Personel seçilmelidir.";
    if (!form.startDate) e.startDate = "Başlangıç zorunludur.";
    if (!form.endDate) e.endDate = "Bitiş zorunludur.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
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

  return (
    <div className="col-12 px-4 py-2">
      <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
        <div className="card-header bg-white border-bottom-0 pt-4 px-4">
          <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
            <i className="bi bi-plus-circle-fill me-2" style={{ color: '#E92B63' }}></i>
            Yeni Görev Oluştur
          </h5>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            {/* SOL TARAF */}
            <div className="col-lg-7 border-end-lg pe-lg-5">
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small text-uppercase mb-2">Görev Başlığı *</label>
                <input
                  placeholder="İşin adını giriniz..."
                  className={`form-control bg-light border-0 ${errors.title ? "is-invalid" : ""}`}
                  style={{ height: '48px', borderRadius: '8px' }}
                  value={form.title}
                  onChange={(e) => { onChange("title", e.target.value); setErrors({ ...errors, title: null }); }}
                />
              </div>

              <div className="row g-3 mb-4">
                {/* PERSONEL SEÇİMİ VE AVATAR */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small text-uppercase mb-2">Atanacak Personel *</label>
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white bg-secondary"
                      style={{ width: '42px', height: '42px', minWidth: '42px' }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <select
                      className={`form-select bg-light border-0 ${errors.assignedUserId ? "is-invalid" : ""}`}
                      style={{ height: '48px' }}
                      value={form.assignedUserId}
                      onChange={(e) => onChange("assignedUserId", e.target.value)}
                    >
                      <option value="">Personel Seç...</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.username || u.email}</option>)}
                    </select>
                  </div>
                </div>

                {/* MÜŞTERİ SEÇİMİ VE AVATAR */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small text-uppercase mb-2">İlgili Müşteri</label>
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white bg-primary-subtle text-primary"
                      style={{ width: '42px', height: '42px', minWidth: '42px', border: '1px solid #eee' }}
                    >
                      <i className="bi bi-building"></i>
                    </div>
                    <select
                      className="form-select bg-light border-0"
                      style={{ height: '48px' }}
                      value={form.customerId}
                      onChange={(e) => onChange("customerId", e.target.value)}
                    >
                      <option value="">Genel / Müşterisiz</option>
                      {customers.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small text-uppercase mb-2">Başlangıç Tarihi</label>
                  <input type="date" className="form-control bg-light border-0" style={{ height: '45px' }} value={form.startDate} onChange={(e) => onChange("startDate", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small text-uppercase mb-2">Bitiş Tarihi</label>
                  <input type="date" className="form-control bg-light border-0" style={{ height: '45px' }} value={form.endDate} onChange={(e) => onChange("endDate", e.target.value)} />
                </div>
              </div>
            </div>

            {/* SAĞ TARAF */}
            <div className="col-lg-5 ps-lg-4">
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small text-uppercase mb-2">Mevcut Durum</label>
                <div className="d-flex gap-2 flex-wrap">
                  {['NEW', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onChange("status", s)}
                      className={`btn btn-sm rounded-pill px-3 fw-bold ${form.status === s ? 'btn-dark' : 'btn-outline-secondary'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {s === 'NEW' ? 'YENİ' : s === 'IN_PROGRESS' ? 'İŞLEMDE' : s === 'ON_HOLD' ? 'BEKLEMEDE' : 'TAMAMLANDI'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-0">
                <label className="form-label fw-bold text-muted small text-uppercase mb-2">Detaylı Açıklama</label>
                <textarea
                  rows={8}
                  placeholder="Görev detaylarını yazınız..."
                  className={`form-control bg-light border-0 ${errors.description ? "is-invalid" : ""}`}
                  style={{ borderRadius: '10px', resize: 'none' }}
                  value={form.description}
                  onChange={(e) => onChange("description", e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
              <button type="button" onClick={() => router.back()} className="btn btn-link text-muted text-decoration-none fw-bold small">VAZGEÇ</button>
              <button
                className="btn px-5 py-2 fw-bold text-white shadow-sm"
                style={{ backgroundColor: "#E92B63", borderRadius: "10px", border: 'none' }}
                onClick={onSubmit}
                disabled={saving}
              >
                {saving ? "KAYDEDİLİYOR..." : "GÖREVİ KAYDET VE LİSTELE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCreateContent;