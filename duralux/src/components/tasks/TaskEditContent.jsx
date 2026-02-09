"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";
import { customerService } from "@/lib/services/customer.service";

const toInputDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split('T')[0];
};

const statusOptions = [
  { value: "NEW", label: "YENİ" },
  { value: "IN_PROGRESS", label: "İŞLEMDE" },
  { value: "ON_HOLD", label: "BEKLEMEDE" },
  { value: "COMPLETED", label: "TAMAMLANDI" },
];

export default function TaskEditContent({ taskId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    customerId: "",
    startDate: "",
    endDate: "",
    status: "NEW",
  });

  const canSave = useMemo(() => !saving && !!form.title.trim(), [saving, form.title]);
  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [taskRes, custRes] = await Promise.all([
          taskService.findOne(taskId),
          customerService.list({ page: 1, limit: 100 })
        ]);
        const t = taskRes?.data?.data ?? taskRes?.data;
        setForm({
          title: t?.title ?? "",
          description: t?.description ?? "",
          customerId: t?.customerId ?? "",
          startDate: toInputDate(t?.startDate),
          endDate: toInputDate(t?.endDate),
          status: t?.status ?? "NEW",
        });
        setCustomers(custRes?.data?.data ?? custRes?.data ?? []);
      } catch (e) {
        console.error("Yükleme Hatası:", e);
      } finally {
        setLoading(false);
      }
    };
    if (taskId) loadData();
  }, [taskId]);

  const onSubmit = async () => {
    setSaving(true);
    try {
      await taskService.update(taskId, form);
      router.push(`/tasks/view/${taskId}`);
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Yükleniyor...</div>;

  return (
    <div className="col-12 w-100 p-2" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="card border-0 shadow-sm" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>
        <div className="card-body px-5 pt-5 pb-2">
          
          <div className="d-flex align-items-center mb-5">
            <div style={{ width: '4px', height: '24px', backgroundColor: '#E92B63', borderRadius: '10px', marginRight: '15px' }}></div>
            <h4 className="fw-bold m-0" style={{ color: '#1a202c', letterSpacing: '-0.5px' }}>Görev Düzenle</h4>
          </div>

          <div className="row g-5">
            {/* Sol Taraf: Temel Bilgiler */}
            <div className="col-lg-7">
              <div className="mb-4">
                <label className="text-uppercase fw-bold mb-2 d-flex align-items-center" style={{ fontSize: '0.7rem', color: '#a0aec0', letterSpacing: '0.5px' }}>
                  <span className="me-2">📋</span> GÖREV BAŞLIĞI *
                </label>
                <input
                  className="form-control border-0"
                  style={{ 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '16px', 
                    padding: '18px 22px', 
                    fontSize: '1rem',
                    color: '#2d3748',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  value={form.title}
                  onChange={(e) => onChange("title", e.target.value)}
                  placeholder="Başlığı buraya girin..."
                />
              </div>

              <div className="mb-4">
                <label className="text-uppercase fw-bold mb-2 d-flex align-items-center" style={{ fontSize: '0.7rem', color: '#a0aec0', letterSpacing: '0.5px' }}>
                  <span className="me-2">👤</span> İLGİLİ MÜŞTERİ
                </label>
                <select
                  className="form-select border-0 cursor-pointer"
                  style={{ backgroundColor: '#f7fafc', borderRadius: '16px', padding: '18px 22px', fontSize: '1rem', color: '#2d3748' }}
                  value={form.customerId}
                  onChange={(e) => onChange("customerId", e.target.value)}
                >
                  <option value="">Genel / Müşterisiz</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-uppercase fw-bold mb-2 d-flex align-items-center" style={{ fontSize: '0.7rem', color: '#a0aec0' }}>
                    <span className="me-2">📅</span> BAŞLANGIÇ
                  </label>
                  <input type="date" className="form-control border-0 shadow-none" style={{ backgroundColor: '#f7fafc', borderRadius: '16px', padding: '16px', color: '#2d3748' }} value={form.startDate} onChange={(e) => onChange("startDate", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="text-uppercase fw-bold mb-2 d-flex align-items-center" style={{ fontSize: '0.7rem', color: '#a0aec0' }}>
                    <span className="me-2">⌛</span> BİTİŞ
                  </label>
                  <input type="date" className="form-control border-0 shadow-none" style={{ backgroundColor: '#f7fafc', borderRadius: '16px', padding: '16px', color: '#2d3748' }} value={form.endDate} onChange={(e) => onChange("endDate", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Durum ve Açıklama */}
            <div className="col-lg-5">
              <div className="mb-5">
                <label className="text-uppercase fw-bold mb-3 d-block" style={{ fontSize: '0.7rem', color: '#a0aec0', letterSpacing: '0.5px' }}>MEVCUT DURUM</label>
                <div className="d-flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="btn fw-bold transition-all"
                      style={{
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        padding: '12px 18px',
                        backgroundColor: form.status === opt.value ? '#2D4356' : '#ffffff',
                        color: form.status === opt.value ? '#ffffff' : '#2D4356',
                        border: '2px solid #2D4356',
                        boxShadow: form.status === opt.value ? '0 4px 12px rgba(45, 67, 86, 0.2)' : 'none',
                        transform: form.status === opt.value ? 'translateY(-1px)' : 'none'
                      }}
                      onClick={() => onChange("status", opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-0">
                <label className="text-uppercase fw-bold mb-2 d-flex align-items-center" style={{ fontSize: '0.7rem', color: '#a0aec0' }}>
                  <span className="me-2">📝</span> DETAYLI AÇIKLAMA
                </label>
                <textarea
                  className="form-control border-0"
                  rows={6}
                  style={{ 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '20px', 
                    padding: '22px', 
                    fontSize: '0.95rem', 
                    resize: 'none', 
                    color: '#2d3748',
                    lineHeight: '1.6'
                  }}
                  value={form.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  placeholder="Görevle ilgili notlarınızı buraya ekleyebilirsiniz..."
                />
              </div>
            </div>
          </div>

          {/* Footer Eylemleri */}
          <div className="d-flex justify-content-between align-items-center py-5 mt-2">
            <button 
              className="btn fw-bold text-uppercase p-0 border-0" 
              style={{ color: '#cbd5e0', fontSize: '0.8rem', letterSpacing: '1px', transition: 'color 0.2s' }} 
              onClick={() => router.back()}
              onMouseOver={(e) => e.target.style.color = '#718096'}
              onMouseOut={(e) => e.target.style.color = '#cbd5e0'}
            >
              VAZGEÇ
            </button>
            <button
              className="btn text-white px-5 py-3 fw-bold border-0"
              style={{ 
                backgroundColor: '#E92B63', 
                borderRadius: '16px', 
                fontSize: '0.9rem',
                boxShadow: '0 10px 20px rgba(233, 43, 99, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onClick={onSubmit}
              disabled={!canSave || saving}
              onMouseOver={(e) => !saving && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 24px rgba(233, 43, 99, 0.3)')}
              onMouseOut={(e) => (e.target.style.transform = 'none', e.target.style.boxShadow = '0 10px 20px rgba(233, 43, 99, 0.2)')}
            >
              {saving ? 'İŞLENİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}