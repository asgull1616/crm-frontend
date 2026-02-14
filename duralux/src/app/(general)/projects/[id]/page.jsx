"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";

const PRIMARY = "#E92B63";
const SOFT = "#FFE4EC";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // 1) sessionStorage (board'dan tıklayınca gelir)
    const ss = safeParse(sessionStorage.getItem("selectedProject"));
    if (ss && String(ss.id) === String(id)) {
      setProject(normalize(ss, id));
      return;
    }

    // 2) localStorage (projeleri sakladıysan buradan bulur)
    const ls = safeParse(localStorage.getItem("projects"));
    if (Array.isArray(ls)) {
      const found = ls.find((p) => String(p.id) === String(id));
      if (found) {
        setProject(normalize(found, id));
        return;
      }
    }

    // 3) fallback: hiç data yoksa bile sayfa çalışsın
    setProject(
      normalize(
        {
          id,
          project: "Proje bulunamadı",
          customer: "—",
          type: "—",
          team: "—",
          deliveryDate: "",
          flowStatus: "Teklif",
          stage: "Analiz",
          price: 0,
          deposit: 0,
          paymentDates: [],
        },
        id
      )
    );
  }, [id]);

  const finance = useMemo(() => {
    if (!project) return null;
    const total = toNumber(project.price);
    const deposit = toNumber(project.deposit);
    const remaining =
      project.remaining === "" || project.remaining == null
        ? Math.max(total - deposit, 0)
        : toNumber(project.remaining);
    const progress = total ? Math.min(100, Math.round((deposit / total) * 100)) : 0;
    return { total, deposit, remaining, progress };
  }, [project]);

  if (!project) return <div style={{ padding: 30, fontWeight: 900 }}>Yükleniyor...</div>;

  return (<>
    <PageHeader />
    <div style={{ padding: 30 }}>
      {/* HEADER */}
      <div style={header}>
        <div>
          <div style={miniTitle}>Proje Kartı</div>
          <div style={mainTitle}>{project.project}</div>
          <div style={customer}>{project.customer}</div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={pillSoft}>{project.type || "—"}</span>
            <span style={pillStrong}>{project.flowStatus || "—"}</span>
            <span style={pillSoft}>{project.stage || "—"}</span>
          </div>
        </div>

        <button style={backBtn} onClick={() => window.history.back()}>
          ← Geri
        </button>
      </div>

      {/* GRID */}
      <div style={grid}>
        {/* GENEL */}
        <Card title="Genel Bilgi">
          <Info label="Tür" value={project.type} />
          <Info label="Sorumlu" value={project.team || "—"} />
          <Info label="Teslim Tarihi" value={project.deliveryDate ? formatTR(project.deliveryDate) : "—"} />
        </Card>

        {/* AŞAMA / TIMELINE */}
        <Card title="Aşamalar">
          <Timeline stage={project.stage || "Analiz"} />
        </Card>

        {/* FİNANS */}
        <Card title="Finans">
          <Info label="Toplam Fiyat" value={formatTL(finance.total)} />
          <Info label="Peşinat" value={formatTL(finance.deposit)} />
          <Info label="Kalan" value={formatTL(finance.remaining)} />

          <div style={{ marginTop: 16 }}>
            <div style={progressBarBg}>
              <div style={{ ...progressBarFill, width: `${finance.progress}%` }} />
            </div>
            <div style={progressText}>%{finance.progress} ödendi</div>

            <div style={{ marginTop: 10 }}>
              <span style={badgePay(project.paidStatus || "Bekliyor")}>
                {project.paidStatus || "Bekliyor"}
              </span>
            </div>
          </div>
        </Card>

        {/* ÖDEME PLAN */}
        <Card title="Ödeme Tarihleri">
          {Array.isArray(project.paymentDates) && project.paymentDates.length > 0 ? (
            project.paymentDates.map((d, i) => (
              <div key={i} style={paymentCard}>
                {formatTR(d)}
              </div>
            ))
          ) : (
            <div style={{ color: "#667085", fontWeight: 800 }}>
              Ödeme tarihi eklenmemiş.
            </div>
          )}
        </Card>
      </div>
    </div></>
  );
}

/* ---------- helpers ---------- */
function safeParse(v) {
  try {
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function normalize(p, id) {
  return {
    id: p.id ?? id,
    project: p.project ?? p.name ?? "",
    customer: p.customer ?? "—",
    type: p.type ?? "—",
    team: p.team ?? p.owner ?? "—",
    deliveryDate: p.deliveryDate ?? "",
    flowStatus: p.flowStatus ?? "Teklif",
    stage: p.stage ?? "Analiz",
    price: p.price ?? 0,
    deposit: p.deposit ?? 0,
    remaining: p.remaining ?? "",
    paidStatus: p.paidStatus ?? "Bekliyor",
    paymentDates: p.paymentDates ?? [],
  };
}

function toNumber(v) {
  if (v === null || v === undefined || v === "") return 0;
  const s = String(v).replaceAll(".", "").replaceAll(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function formatTR(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTL(n) {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));
  } catch {
    return `${n} TL`;
  }
}

/* ---------- UI components ---------- */
function Card({ title, children }) {
  return (
    <div style={card}>
      <div style={cardTitle}>{title}</div>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <span style={infoValue}>{value}</span>
    </div>
  );
}

function Timeline({ stage }) {
  const stages = ["Analiz", "Tasarım", "Kodlama", "Test", "Yayın"];
  return (
    <div style={{ marginTop: 12 }}>
      {stages.map((s) => {
        const active = s === stage;
        return (
          <div key={s} style={timelineRow}>
            <div style={{ ...timelineDot, background: active ? PRIMARY : "#e5e7eb" }} />
            <div style={{ fontWeight: active ? 950 : 800, color: active ? PRIMARY : "#344054" }}>
              {s}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- styles ---------- */
const header = {
  background: `linear-gradient(135deg, ${PRIMARY}, #ff6b9a)`,
  padding: 26,
  borderRadius: 22,
  color: "#fff",
  marginBottom: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 14,
  boxShadow: "0 18px 50px rgba(233,43,99,0.28)",
};

const miniTitle = { fontSize: 13, fontWeight: 900, opacity: 0.95 };
const mainTitle = { fontSize: 30, fontWeight: 950, marginTop: 6 };
const customer = { fontSize: 14, fontWeight: 900, opacity: 0.92, marginTop: 6 };

const pillSoft = {
  background: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.25)",
  padding: "8px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 950,
};

const pillStrong = {
  background: "#fff",
  color: PRIMARY,
  padding: "8px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 950,
};

const backBtn = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.16)",
  color: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 16,
};

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
  border: "1px solid rgba(233,43,99,0.10)",
};

const cardTitle = {
  fontSize: 15,
  fontWeight: 950,
  marginBottom: 12,
  color: PRIMARY,
  borderBottom: "1px solid rgba(233,43,99,0.12)",
  paddingBottom: 10,
};

const infoRow = { display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 12 };
const infoLabel = { color: "#667085", fontWeight: 900, fontSize: 13 };
const infoValue = { fontWeight: 950, color: "#101828", fontSize: 14, textAlign: "right" };

const timelineRow = { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 };
const timelineDot = { width: 12, height: 12, borderRadius: 999 };

const progressBarBg = { background: "#f2f4f7", borderRadius: 999, height: 10, overflow: "hidden" };
const progressBarFill = { background: PRIMARY, height: 10, borderRadius: 999 };
const progressText = { fontSize: 12, fontWeight: 900, color: "#667085", marginTop: 6 };

const paymentCard = {
  background: SOFT,
  padding: 12,
  borderRadius: 14,
  marginBottom: 10,
  fontWeight: 950,
  border: "1px solid rgba(233,43,99,0.14)",
};

function badgePay(paid) {
  const isPaid = paid === "Ödendi";
  return {
    background: isPaid ? "#ECFDF3" : SOFT,
    color: isPaid ? "#027A48" : PRIMARY,
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 950,
    fontSize: 12,
    border: "1px solid rgba(0,0,0,0.04)",
  };
}
