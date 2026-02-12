"use client";
import React, { useMemo, useState } from "react";

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

// "Teslim" kısmı buradan kaldırıldı
const STATUS = ["Teklif", "Geliştirme", "Test"];
const STAGES = ["Analiz", "Tasarım", "Kodlama", "Test", "Yayın"];

export default function ProjectsBoardPage() {
  const [projects, setProjects] = useState([
    {
      id: "p1",
      project: "CK Web",
      customer: "CK Paslanmaz",
      type: "Web",
      price: 30000,
      deposit: 0,
      remaining: 20000,
      deliveryDate: "2026-03-15",
      flowStatus: "Geliştirme",
      stage: "Kodlama",
      team: "Şerif",
      paidStatus: "Bekliyor",
      paymentDates: ["2026-02-15", "2026-03-10"],
    },
    {
      id: "p2",
      project: "CRM V2",
      customer: "Dadaylılar",
      type: "Yazılım",
      price: 45000,
      deposit: 5000,
      remaining: 0,
      deliveryDate: "2026-02-10",
      flowStatus: "Test",
      stage: "Test",
      team: "Sude",
      paidStatus: "Ödendi",
      paymentDates: ["2026-02-01"],
    },
    {
      id: "p3",
      project: "Mobil App",
      customer: "Empet",
      type: "Mobil",
      price: 60000,
      deposit: 0,
      remaining: 60000,
      deliveryDate: "2026-03-30",
      flowStatus: "Teklif",
      stage: "Analiz",
      team: "Zeynep",
      paidStatus: "Bekliyor",
      paymentDates: [],
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("Hepsi");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "Hepsi") return projects;
    return projects.filter((p) => p.flowStatus === activeFilter);
  }, [projects, activeFilter]);

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      id: null, project: "", customer: "", type: "Web", price: "",
      deposit: "", remaining: "", deliveryDate: "", flowStatus: "Teklif",
      stage: "Analiz", team: "", paidStatus: "Bekliyor", paymentDatesText: "",
    };
  }

  function openCreate() { setForm(emptyForm()); setOpen(true); }
  
  function openEdit(row) {
    setForm({
      ...row,
      paymentDatesText: (row.paymentDates || []).join(","),
    });
    setOpen(true);
  }

  function save() {
    if (!form.project.trim() || !form.customer.trim()) return;
    const price = toNumber(form.price);
    const deposit = toNumber(form.deposit);
    const payload = {
      ...form,
      id: form.id || `p-${Math.random().toString(36).slice(2, 10)}`,
      price,
      deposit,
      remaining: form.remaining === "" ? Math.max(price - deposit, 0) : toNumber(form.remaining),
      paymentDates: form.paymentDatesText.split(",").map(x => x.trim()).filter(Boolean)
    };
    setProjects(prev => {
      const exists = prev.some(p => p.id === payload.id);
      return exists ? prev.map(p => p.id === payload.id ? payload : p) : [payload, ...prev];
    });
    setOpen(false);
  }

  function removeProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div style={{ padding: 20 }}>
      {/* ÜST KART */}
      <div style={topCard}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 950, color: PRIMARY }}>Projelerimiz</div>
          <div style={{ fontSize: 30, fontWeight: 950, marginTop: 8, color: "#111" }}>Proje Kartları</div>
          
          <div style={topControls}>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={select}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.project || "İsimsiz Proje"}</option>
              ))}
            </select>
            <button style={btnGhost} onClick={openCreate}>+ Yeni Proje</button>
            
            <div style={filterGroup}>
              {["Hepsi", ...STATUS].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  style={activeFilter === status ? filterBtnActive : filterBtn}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={statBox}>
            <div style={statLabel}>Filtrelenen</div>
            <div style={statValue}>{filteredProjects.length} Proje</div>
          </div>
        </div>
      </div>

      {/* TABLO */}
      <div style={tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Proje</th>
                <th style={th}>Müşteri</th>
                <th style={th}>Tür</th>
                <th style={th}>Fiyat</th>
                <th style={th}>Teslim</th>
                <th style={th}>Durum</th>
                <th style={th}>Finans</th>
                <th style={th}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} 
                    style={{ ...(selectedProjectId === p.id ? selectedRow : {}), cursor: "pointer" }}
                    onClick={() => {
                        sessionStorage.setItem("selectedProject", JSON.stringify(p));
                        window.location.href = `/projects/${p.id}`;
                    }}
                >
                  <td style={{ ...td, fontWeight: 950 }}>{p.project}</td>
                  <td style={td}>{p.customer}</td>
                  <td style={td}>{p.type}</td>
                  <td style={td}>{formatTL(p.price)}</td>
                  <td style={td}>{p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString("tr-TR") : "-"}</td>
                  <td style={td}><span style={badgeFlow(p.flowStatus)}>{p.flowStatus}</span></td>
                  <td style={td}><span style={badgePay(p.paidStatus)}>{p.paidStatus}</span></td>
                  <td style={td}>
                    <button style={btnGhostSmall} onClick={(e) => { e.stopPropagation(); openEdit(p); }}>Düzenle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div style={modalOverlay} onClick={() => setOpen(false)}>
            <div style={modal} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: 20 }}>
                    <h3 style={{ marginBottom: 15 }}>{form.id ? "Proje Düzenle" : "Yeni Proje Ekle"}</h3>
                    <div style={{ display: "grid", gap: 10 }}>
                        <input style={inputStyle} placeholder="Proje Adı" value={form.project} onChange={e => setForm({...form, project: e.target.value})} />
                        <input style={inputStyle} placeholder="Müşteri" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} />
                        <select style={select} value={form.flowStatus} onChange={e => setForm({...form, flowStatus: e.target.value})}>
                            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button style={btnPrimary} onClick={save}>Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

/* --- YARDIMCI FONKSİYONLAR --- */
function toNumber(v) {
  if (v === null || v === undefined || v === "") return 0;
  const s = String(v).replaceAll(".", "").replaceAll(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function formatTL(v) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(v || 0);
}

/* --- BADGE STİLLERİ --- */
function badgeFlow(flow) {
  const map = {
    Teklif: { bg: "#EEF2FF", fg: "#3730A3" },
    Geliştirme: { bg: "#FFE4EC", fg: PRIMARY },
    Test: { bg: "#FFF7ED", fg: "#9A3412" },
  };
  const c = map[flow] || { bg: "#F2F4F7", fg: "#344054" };
  return { background: c.bg, color: c.fg, padding: "6px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12 };
}

function badgePay(paid) {
  const isPaid = paid === "Ödendi";
  return { background: isPaid ? "#ECFDF3" : "#FFE4EC", color: isPaid ? "#027A48" : PRIMARY, padding: "6px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12 };
}

/* --- TÜM STİLLER --- */
const topCard = { background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 16px 40px rgba(0,0,0,0.08)", border: "1px solid #f1f1f1", display: "flex", justifyContent: "space-between", alignItems: "center" };
const topControls = { marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };
const filterGroup = { display: "flex", background: "#f2f4f7", padding: 4, borderRadius: 14, marginLeft: 10 };
const filterBtn = { padding: "8px 16px", borderRadius: 10, border: "none", background: "transparent", color: "#667085", fontWeight: 900, fontSize: 13, cursor: "pointer" };
const filterBtnActive = { ...filterBtn, background: "#fff", color: PRIMARY, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const statBox = { minWidth: 150, background: "#fff", border: "1px solid #f1f1f1", borderRadius: 18, padding: 14, textAlign: "center" };
const statLabel = { fontSize: 12, fontWeight: 950, color: "#667085" };
const statValue = { fontSize: 16, fontWeight: 950, color: "#111", marginTop: 4 };
const tableCard = { marginTop: 16, background: "#fff", borderRadius: 22, padding: 14, boxShadow: "0 16px 40px rgba(0,0,0,0.06)", border: "1px solid #f1f1f1" };
const table = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };
const th = { textAlign: "left", padding: 12, fontSize: 13, fontWeight: 950, color: "#344054", borderBottom: "1px solid #F2F4F7" };
const td = { padding: 12, fontSize: 14, color: "#101828", borderBottom: "1px solid #F2F4F7" };
const selectedRow = { background: "rgba(233,43,99,0.05)" };
const btnPrimary = { padding: "12px 20px", borderRadius: 12, border: "none", background: PRIMARY, color: "#fff", fontWeight: 900, cursor: "pointer" };
const btnGhost = { padding: "10px 15px", borderRadius: 12, border: "1px solid #eee", background: "#fff", fontWeight: 900, cursor: "pointer" };
const btnGhostSmall = { padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", background: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer" };
const select = { padding: "10px", borderRadius: 10, border: "1px solid #eee", outline: "none" };
const inputStyle = { padding: "10px", borderRadius: 10, border: "1px solid #eee", width: "100%" };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modal = { background: "#fff", borderRadius: 20, width: "90%", maxWidth: "400px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" };