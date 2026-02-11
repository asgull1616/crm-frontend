"use client";
import React, { useMemo, useState } from "react";

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

const STATUS = [
  "Teklif",
  "Geliştirme",
  "Test",
  "Teslim",
];

const STAGES = [
  "Analiz",
  "Tasarım",
  "Kodlama",
  "Test",
  "Yayın",
];

export default function ProjectsBoardPage() {
  // Proje kartları (örnek data)
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
      status: "Yapım", // senin tabloda böyleydi ama biz status'ü aşağıdaki akışa göre tutacağız
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
      status: "Test",
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
      status: "Teklif",
      flowStatus: "Teklif",
      stage: "Analiz",
      team: "Zeynep",
      paidStatus: "Bekliyor",
      paymentDates: [],
    },
  ]);

  // “tek proje seçimi” (üst dropdown)
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  // modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      id: null,
      project: "",
      customer: "",
      type: "Web",
      price: "",
      deposit: "",
      remaining: "",
      deliveryDate: "",
      flowStatus: "Teklif",
      stage: "Analiz",
      team: "",
      paidStatus: "Bekliyor",
      paymentDatesText: "", // virgüllü metin: 2026-02-15,2026-03-10
    };
  }

  function openCreate() {
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(row) {
    setForm({
      id: row.id,
      project: row.project || "",
      customer: row.customer || "",
      type: row.type || "Web",
      price: row.price ?? "",
      deposit: row.deposit ?? "",
      remaining: row.remaining ?? "",
      deliveryDate: row.deliveryDate || "",
      flowStatus: row.flowStatus || "Teklif",
      stage: row.stage || "Analiz",
      team: row.team || "",
      paidStatus: row.paidStatus || "Bekliyor",
      paymentDatesText: (row.paymentDates || []).join(","),
    });
    setOpen(true);
  }

  function save() {
    if (!form.project.trim() || !form.customer.trim()) return;

    const price = toNumber(form.price);
    const deposit = toNumber(form.deposit);
    const remaining = form.remaining === "" ? "" : toNumber(form.remaining);

    const parsedPaymentDates = form.paymentDatesText
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const payload = {
      id: form.id || `p-${Math.random().toString(36).slice(2, 10)}`,
      project: form.project.trim(),
      customer: form.customer.trim(),
      type: form.type,
      price,
      deposit,
      remaining: remaining === "" ? Math.max(price - deposit, 0) : remaining,
      deliveryDate: form.deliveryDate,
      flowStatus: form.flowStatus,
      stage: form.stage,
      team: form.team.trim(),
      paidStatus: form.paidStatus,
      paymentDates: parsedPaymentDates,
    };

    setProjects((prev) => {
      const exists = prev.some((p) => p.id === payload.id);
      const next = exists ? prev.map((p) => (p.id === payload.id ? payload : p)) : [payload, ...prev];
      // seçili proje yoksa otomatik seç
      if (!selectedProjectId) setSelectedProjectId(payload.id);
      return next;
    });

    setOpen(false);
  }

  function removeProject(id) {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      // seçili silindiyse ilkini seç
      if (selectedProjectId === id) setSelectedProjectId(next[0]?.id || "");
      return next;
    });
  }

  function renameSelected() {
    if (!selectedProject) return;
    setForm({
      ...emptyForm(),
      ...selectedProject,
      paymentDatesText: (selectedProject.paymentDates || []).join(","),
    });
    setOpen(true);
  }

  return (
    <div style={{ padding: 20 }}>
      {/* ÜST KART */}
      <div style={topCard}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 950, color: PRIMARY }}>Projelerimiz</div>
          <div style={{ fontSize: 30, fontWeight: 950, marginTop: 8, color: "#111" }}>
            Proje Kartları
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, marginTop: 8, color: "#667085" }}>
            Her satır = tek proje kartı. Detayı “Düzenle” ile modal içinde yönetebilirsin.
          </div>

          {/* ÜST KONTROLLER */}
          <div style={topControls}>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={select}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project || "İsimsiz Proje"}
                </option>
              ))}
            </select>

            <button style={btnGhost} onClick={openCreate}>+ Yeni Proje</button>
            <button style={btnGhost} onClick={renameSelected}>Proje Adı / Düzenle</button>

            <button
              style={btnDanger}
              onClick={() => selectedProject && removeProject(selectedProject.id)}
              disabled={!selectedProject}
            >
              Proje Sil
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={statBox}>
            <div style={statLabel}>Toplam Proje</div>
            <div style={statValue}>{projects.length}</div>
          </div>

          <div style={statBox}>
            <div style={statLabel}>Seçili</div>
            <div style={statValue}>{selectedProject?.project || "-"}</div>
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
                <th style={th}>Peşinat</th>
                <th style={th}>Kalan</th>
                <th style={th}>Teslim</th>
                <th style={th}>Durum</th>
                <th style={th}>Aşama</th>
                <th style={th}>Finans</th>
                <th style={th}>İşlem</th>
              </tr>
            </thead>

            <tbody>
            {projects.map((p) => (
                <tr
                key={p.id}
                style={{
                    ...(selectedProjectId === p.id ? selectedRow : {}),
                    cursor: "pointer",
                }}
                onClick={() => {
                sessionStorage.setItem("selectedProject", JSON.stringify(p));
                window.location.href = `/projects/${p.id}`;
                }}
                >
                <td style={{ ...td, fontWeight: 950 }}>{p.project}</td>
                <td style={td}>{p.customer}</td>
                <td style={td}>{p.type}</td>
                <td style={td}>{formatTL(p.price)}</td>
                <td style={td}>{formatTL(p.deposit)}</td>
                <td style={td}>{formatTL(p.remaining)}</td>
                <td style={td}>
                    {p.deliveryDate
                    ? new Date(p.deliveryDate).toLocaleDateString("tr-TR")
                    : "-"}
                </td>
                <td style={td}>
                    <span style={badgeFlow(p.flowStatus)}>
                    {p.flowStatus}
                    </span>
                </td>
                <td style={td}>
                    <span style={badgeStage(p.stage)}>
                    {p.stage}
                    </span>
                </td>
                <td style={td}>
                    <span style={badgePay(p.paidStatus)}>
                    {p.paidStatus}
                    </span>
                </td>
                <td style={td}>
                    <div style={{ display: "flex", gap: 8 }}>
                    <button
                        style={btnGhostSmall}
                        onClick={(e) => {
                        e.stopPropagation(); // row click'i tetiklemesin
                        setSelectedProjectId(p.id);
                        openEdit(p);
                        }}
                    >
                        Düzenle
                    </button>

                    <button
                        style={btnDangerSmall}
                        onClick={(e) => {
                        e.stopPropagation(); // row click'i tetiklemesin
                        removeProject(p.id);
                        }}
                    >
                        Sil
                    </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div style={modalOverlay} onMouseDown={() => setOpen(false)}>
          <div style={modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={dot} />
                <div style={{ fontWeight: 950, fontSize: 18 }}>
                  {form.id ? "Proje Düzenle" : "Yeni Proje"}
                </div>
              </div>
              <button style={xBtn} onClick={() => setOpen(false)}>✕</button>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              {/* Genel Bilgi */}
              <div style={sectionTitle}>Genel Bilgi</div>

              <div style={grid2}>
                <Field label="Proje adı">
                  <Input value={form.project} onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))} />
                </Field>
                <Field label="Müşteri">
                  <Input value={form.customer} onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))} />
                </Field>
              </div>

              <div style={grid2}>
                <Field label="Tür">
                  <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} style={select}>
                    <option>Web</option>
                    <option>Yazılım</option>
                    <option>Mobil</option>
                  </select>
                </Field>
                <Field label="Sorumlu ekip/kişi">
                  <Input value={form.team} onChange={(e) => setForm((p) => ({ ...p, team: e.target.value }))} placeholder="Örn: Şerif / ESA Team" />
                </Field>
              </div>

              <Field label="Başlangıç / Teslim tarihi (Teslim)">
                <Input type="date" value={form.deliveryDate} onChange={(e) => setForm((p) => ({ ...p, deliveryDate: e.target.value }))} />
              </Field>

              {/* Durum Akışı */}
              <div style={sectionTitle}>Durum</div>
              <Field label="Durum akışı (Teklif → Geliştirme → Test → Teslim)">
                <select value={form.flowStatus} onChange={(e) => setForm((p) => ({ ...p, flowStatus: e.target.value }))} style={select}>
                  {STATUS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              {/* Aşamalar */}
              <div style={sectionTitle}>Aşamalar</div>
              <Field label="Aşama (Analiz → Tasarım → Kodlama → Test → Yayın)">
                <select value={form.stage} onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))} style={select}>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              {/* Finans */}
              <div style={sectionTitle}>Finans</div>
              <div style={grid3}>
                <Field label="Satış fiyatı (TL)">
                  <Input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="30000" />
                </Field>
                <Field label="Peşinat (TL)">
                  <Input value={form.deposit} onChange={(e) => setForm((p) => ({ ...p, deposit: e.target.value }))} placeholder="5000" />
                </Field>
                <Field label="Kalan (TL) (boş bırakırsan otomatik)">
                  <Input value={form.remaining} onChange={(e) => setForm((p) => ({ ...p, remaining: e.target.value }))} placeholder="20000" />
                </Field>
              </div>

              <div style={grid2}>
                <Field label="Ödeme tarihleri (virgülle)">
                  <Input
                    value={form.paymentDatesText}
                    onChange={(e) => setForm((p) => ({ ...p, paymentDatesText: e.target.value }))}
                    placeholder="2026-02-15,2026-03-10"
                  />
                </Field>

                <Field label="Ödeme durumu">
                  <select value={form.paidStatus} onChange={(e) => setForm((p) => ({ ...p, paidStatus: e.target.value }))} style={select}>
                    <option>Ödendi</option>
                    <option>Bekliyor</option>
                  </select>
                </Field>
              </div>
            </div>

            <div style={modalFooter}>
              <button style={btnGhost} onClick={() => setOpen(false)}>İptal</button>
              <button style={btnPrimary} onClick={save}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* helpers */
function toNumber(v) {
  if (v === null || v === undefined) return 0;
  const s = String(v).replaceAll(".", "").replaceAll(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function formatTL(v) {
  const n = Number(v || 0);
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n} TL`;
  }
}

/* small components */
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 950, color: "#344054" }}>{label}</div>
      {children}
    </div>
  );
}

function Input(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

/* badges */
function badgeFlow(flow) {
  const map = {
    Teklif: { bg: "#EEF2FF", fg: "#3730A3" },
    Geliştirme: { bg: "#FFE4EC", fg: PRIMARY },
    Test: { bg: "#FFF7ED", fg: "#9A3412" },
    Teslim: { bg: "#ECFDF3", fg: "#027A48" },
  };
  const c = map[flow] || { bg: "#F2F4F7", fg: "#344054" };
  return {
    background: c.bg,
    color: c.fg,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    border: "1px solid rgba(0,0,0,0.04)",
    whiteSpace: "nowrap",
  };
}

function badgeStage(stage) {
  return {
    background: "#F9FAFB",
    color: "#344054",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    border: "1px solid rgba(0,0,0,0.04)",
    whiteSpace: "nowrap",
  };
}

function badgePay(paid) {
  const c = paid === "Ödendi"
    ? { bg: "#ECFDF3", fg: "#027A48" }
    : { bg: "#FFE4EC", fg: PRIMARY };
  return {
    background: c.bg,
    color: c.fg,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    border: "1px solid rgba(0,0,0,0.04)",
    whiteSpace: "nowrap",
  };
}

/* styles */
const topCard = {
  background: "#fff",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  border: "1px solid #f1f1f1",
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const topControls = {
  marginTop: 14,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const statBox = {
  minWidth: 180,
  background: "#fff",
  border: "1px solid #f1f1f1",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
};

const statLabel = { fontSize: 12, fontWeight: 950, color: "#667085" };
const statValue = { fontSize: 14, fontWeight: 950, color: "#111", marginTop: 6 };

const tableCard = {
  marginTop: 16,
  background: "#fff",
  borderRadius: 22,
  padding: 14,
  boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
  border: "1px solid #f1f1f1",
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  minWidth: 1100,
};

const th = {
  textAlign: "left",
  padding: 12,
  fontSize: 13,
  fontWeight: 950,
  color: "#344054",
  borderBottom: "1px solid #F2F4F7",
  whiteSpace: "nowrap",
};

const td = {
  padding: 12,
  fontSize: 14,
  fontWeight: 800,
  color: "#101828",
  borderBottom: "1px solid #F2F4F7",
  verticalAlign: "middle",
};

const selectedRow = {
  background: "rgba(233,43,99,0.06)",
};

const btnPrimary = {
  padding: "12px 16px",
  borderRadius: 16,
  border: "none",
  background: PRIMARY,
  color: "#fff",
  fontWeight: 950,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(233,43,99,0.3)",
};

const btnGhost = {
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};

const btnDanger = {
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(233,43,99,0.22)",
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  fontWeight: 950,
  cursor: "pointer",
};

const btnGhostSmall = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 950,
  cursor: "pointer",
  fontSize: 13,
};

const btnDangerSmall = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(233,43,99,0.22)",
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  fontWeight: 950,
  cursor: "pointer",
  fontSize: 13,
};

const select = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 900,
  fontSize: 14,
  outline: "none",
  minWidth: 220,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  outline: "none",
  fontSize: 14,
  fontWeight: 900,
};

const sectionTitle = {
  fontSize: 14,
  fontWeight: 950,
  color: PRIMARY,
  marginTop: 4,
};

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 };

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(17,17,17,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 9999,
};

const modal = {
  width: "100%",
  maxWidth: 760,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 26px 80px rgba(0,0,0,0.25)",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
};

const modalHeader = {
  padding: 16,
  borderBottom: "1px solid #f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const modalFooter = {
  padding: 16,
  borderTop: "1px solid #f0f0f0",
  background: "rgba(255,255,255,0.65)",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const dot = {
  width: 10,
  height: 10,
  borderRadius: 999,
  background: PRIMARY,
  boxShadow: "0 0 0 6px rgba(233,43,99,0.12)",
};

const xBtn = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: "1px solid #eee",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 950,
};
