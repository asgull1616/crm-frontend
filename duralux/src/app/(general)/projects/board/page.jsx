"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/pageHeader/PageHeader";

const PRIMARY = "#E92B63";
const STATUS = ["Teklif", "Geliştirme", "Test"];

export default function ProjectsBoardPage() {
  const router = useRouter();
  
  // PROJE VERİLERİ
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

  // FİLTRELEME MANTIĞI
  const filteredProjects = useMemo(() => {
    if (activeFilter === "Hepsi") return projects;
    return projects.filter((p) => p.flowStatus === activeFilter);
  }, [projects, activeFilter]);

  // DÜZENLEME VE YÖNLENDİRME
  const handleEditNavigation = (p) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(p));
    router.push(`/projects/${p.id}?edit=true`);
  };

  return (
    <>
      <PageHeader />

      <div style={{ padding: 20 }}>
        {/* ÜST KART VE FİLTRELER */}
        <div style={topCard}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 950, color: PRIMARY }}>Projelerimiz</div>
            <div style={{ fontSize: 30, fontWeight: 950, marginTop: 8, color: "#111" }}>Proje Kartları</div>
            
            <div style={topControls}>
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

          <div style={statBox}>
            <div style={statLabel}>Filtrelenen</div>
            <div style={statValue}>{filteredProjects.length} Proje</div>
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
                  <th style={th}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    style={rowStyle}
                    onClick={() => {
                      sessionStorage.setItem("selectedProject", JSON.stringify(p));
                      router.push(`/projects/${p.id}`);
                    }}
                  >
                    <td style={{ ...td, fontWeight: 950 }}>{p.project}</td>
                    <td style={td}>{p.customer}</td>
                    <td style={td}>{p.type}</td>
                    <td style={td}>{formatTL(p.price)}</td>
                    <td style={td}>{p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString("tr-TR") : "-"}</td>
                    <td style={td}><span style={badgeFlow(p.flowStatus)}>{p.flowStatus}</span></td>
                    <td style={td}>
                      <button 
                        style={btnGhostSmall} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditNavigation(p); 
                        }}
                      >
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

/* --- YARDIMCI FONKSİYONLAR --- */
function formatTL(v) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(v || 0);
}

function badgeFlow(flow) {
  const map = {
    Teklif: { bg: "#EEF2FF", fg: "#3730A3" },
    Geliştirme: { bg: "#FFE4EC", fg: PRIMARY },
    Test: { bg: "#FFF7ED", fg: "#9A3412" },
  };
  const c = map[flow] || { bg: "#F2F4F7", fg: "#344054" };
  return { background: c.bg, color: c.fg, padding: "6px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12 };
}

/* --- STİLLER --- */
const topCard = { background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 16px 40px rgba(0,0,0,0.08)", border: "1px solid #f1f1f1", display: "flex", justifyContent: "space-between", alignItems: "center" };
const topControls = { marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };
const filterGroup = { display: "flex", background: "#f2f4f7", padding: 4, borderRadius: 14 };
const filterBtn = { padding: "8px 16px", borderRadius: 10, border: "none", background: "transparent", color: "#667085", fontWeight: 900, fontSize: 13, cursor: "pointer" };
const filterBtnActive = { ...filterBtn, background: "#fff", color: PRIMARY, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const statBox = { minWidth: 150, background: "#fff", border: "1px solid #f1f1f1", borderRadius: 18, padding: 14, textAlign: "center" };
const statLabel = { fontSize: 12, fontWeight: 950, color: "#667085" };
const statValue = { fontSize: 16, fontWeight: 950, color: "#111", marginTop: 4 };
const tableCard = { marginTop: 16, background: "#fff", borderRadius: 22, padding: 14, boxShadow: "0 16px 40px rgba(0,0,0,0.06)", border: "1px solid #f1f1f1" };
const table = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };
const th = { textAlign: "left", padding: 12, fontSize: 13, fontWeight: 950, color: "#344054", borderBottom: "1px solid #F2F4F7" };
const td = { padding: 12, fontSize: 14, color: "#101828", borderBottom: "1px solid #F2F4F7" };
const rowStyle = { cursor: "pointer", transition: "background 0.2s" };
const btnGhostSmall = { padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", background: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer" };