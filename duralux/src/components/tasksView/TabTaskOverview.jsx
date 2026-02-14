"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCalendar, FiClock, FiUser, FiUserCheck, FiExternalLink, FiFileText } from "react-icons/fi";
import { taskService } from "@/lib/services/task.service";
import { userService } from "@/lib/services/profile.service";

const statusLabel = { NEW: "Yeni", IN_PROGRESS: "Devam Ediyor", ON_HOLD: "Beklemede", COMPLETED: "Tamamlandı" };
const statusColors = { NEW: "#6c757d", IN_PROGRESS: "#0d6efd", ON_HOLD: "#ffc107", COMPLETED: "#198754" };

const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' }) : "-";

export default function TabTaskOverview({ taskId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);

  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  const assignedUserLabel = useMemo(() => {
    const u = userMap.get(task?.assignedUserId);
    return u ? u.username : "Atanmamış";
  }, [task?.assignedUserId, userMap]);

  useEffect(() => {
    const load = async () => {
      try {
        const [taskRes, userRes] = await Promise.all([
          taskService.findOne(taskId),
          userService.list({ page: 1, limit: 100 }),
        ]);
        setTask(taskRes?.data?.data ?? taskRes?.data ?? null);
        setUsers(userRes?.data?.data ?? []);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    if (taskId) load();
  }, [taskId]);

  if (loading || !task) return null;

  const customer = task.customer ?? null;

  const handleEdit = () => {
    router.push(`/tasks/edit/${taskId}`);
  };

  return (
    <div className="tab-pane fade active show p-0" id="overviewTab" style={{ marginTop: '-15px' }}>
      {/* 1. ÜST SAYAÇ KARTLARI */}
      <div className="row g-3 mb-3 mt-0">
        {[
          { label: "DURUM", val: statusLabel[task.status] || task.status, col: statusColors[task.status], border: true },
          { label: "SORUMLU", val: assignedUserLabel, col: "#333", icon: <FiUserCheck className="me-2 text-primary"/> },
          { label: "BAŞLANGIÇ", val: formatDate(task.startDate), col: "#333", icon: <FiCalendar className="me-2 text-info"/> },
          { label: "TERMİN", val: formatDate(task.endDate), col: "#dc3545", icon: <FiClock className="me-2"/> }
        ].map((item, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', borderLeft: item.border ? `5px solid ${item.col}` : 'none' }}>
              <div className="card-body p-3 text-start">
                <small className="text-muted fw-bold d-block mb-1" style={{fontSize: '0.65rem'}}>{item.label}</small>
                <h6 className="mb-0 fw-bold" style={{ color: item.col, fontSize: '0.85rem' }}>{item.icon}{item.val}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* SOL KOLON: SADECE GÖREV BİLGİLERİ */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4 text-start">
              <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                <FiFileText className="text-primary me-2" size={20}/>
                <h6 className="fw-bold mb-0 text-dark text-uppercase">GÖREV BİLGİLERİ</h6>
              </div>
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-1 text-uppercase" style={{fontSize: '0.65rem'}}>Başlık</label>
                <div className="h5 fw-bold text-dark">{task.title}</div>
              </div>
              <div className="mb-0">
                <label className="small fw-bold text-muted mb-1 text-uppercase" style={{fontSize: '0.65rem'}}>Tanım / Açıklama</label>
                <div className="bg-light p-3 rounded-3 text-muted" style={{ minHeight: '350px', maxHeight: '500px', overflowY: 'auto', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  {task.description || "Bu görev için açıklama girilmemiştir."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: ZAMAN AKIŞI VE MÜŞTERİ BİLGİSİ */}
        <div className="col-xl-4 d-flex flex-column gap-3 text-start">
          
          {/* ZAMAN AKIŞI */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 text-dark border-bottom pb-2 text-uppercase">Zaman Akışı</h6>
              <div className="mb-4 d-flex align-items-center">
                <div className="bg-light p-2 rounded-circle me-3 text-primary"><FiCalendar size={18}/></div>
                <div>
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '0.6rem' }}>OLUŞTURULMA</small>
                  <span className="fw-bold small text-dark">{formatDate(task.createdAt)}</span>
                </div>
              </div>
              <div className="mb-4 d-flex align-items-center">
                <div className="bg-light p-2 rounded-circle me-3 text-info"><FiClock size={18}/></div>
                <div>
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '0.6rem' }}>SON GÜNCELLEME</small>
                  <span className="fw-bold small text-dark">{formatDate(task.updatedAt)}</span>
                </div>
              </div>
              <div className="d-grid gap-2 pt-2">
                <button 
                  className="btn btn-primary fw-bold py-2 rounded-3 border-0 shadow-sm" 
                  style={{ backgroundColor: '#4e73df' }}
                  onClick={handleEdit}
                >
                  DÜZENLE
                </button>
              </div>
            </div>
          </div>

          {/* İLGİLİ MÜŞTERİ (Buraya Taşındı) */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <div className="d-flex align-items-center">
                  <FiUser className="text-primary me-2" size={20}/>
                  <h6 className="fw-bold mb-0 text-dark small text-uppercase">İlgili Müşteri</h6>
                </div>
                {customer?.id && <FiExternalLink className="text-primary cursor-pointer" size={16} onClick={() => router.push(`/customers/view/${customer.id}`)}/>}
              </div>
              {customer ? (
                <div className="d-flex flex-column gap-3">
                  <div>
                    <small className="text-muted d-block fw-bold mb-1" style={{fontSize: '0.6rem'}}>AD SOYAD</small>
                    <span className="fw-bold small text-dark">{customer.fullName || customer.name}</span>
                  </div>
                  <div>
                    <small className="text-muted d-block fw-bold mb-1" style={{fontSize: '0.6rem'}}>E-POSTA</small>
                    <span className="fw-bold small text-dark d-block text-truncate">{customer.email || "-"}</span>
                  </div>
                  <div>
                    <small className="text-muted d-block fw-bold mb-1" style={{fontSize: '0.6rem'}}>TELEFON</small>
                    <span className="fw-bold small text-dark">{customer.phone || "-"}</span>
                  </div>
                </div>
              ) : <div className="text-muted small py-1 italic">Müşteri atanmamış.</div>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}