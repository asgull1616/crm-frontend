"use client";
import React, { useMemo, useState } from "react";

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

const STATUS = [
  { key: "all", label: "Tümü" },
  { key: "queue", label: "Sıradaki işler" },
  { key: "doing", label: "Yapılıyor" },
  { key: "waiting", label: "Beklemede" },
  { key: "done", label: "Tamamlanan" },
];

const RANGE = [
  { key: "today", label: "Bugün" },
  { key: "week", label: "Bu Hafta" },
  { key: "month", label: "Bu Ay" },
  { key: "all", label: "Tümü" },
];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function isBetween(d, a, b) {
  const t = new Date(d).getTime();
  return t >= a.getTime() && t <= b.getTime();
}
function rangeToDates(key) {
  const now = new Date();
  const s = startOfDay(now);

  if (key === "today") return { from: s, to: endOfDay(now) };

  if (key === "week") {
    const day = now.getDay(); // 0 pazar
    const diffToMon = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMon);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { from: startOfDay(monday), to: endOfDay(sunday) };
  }

  if (key === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: startOfDay(first), to: endOfDay(last) };
  }

  return { from: null, to: null };
}

function statusLabel(key) {
  return (
    {
      queue: "Sıradaki işler",
      doing: "Yapılıyor",
      waiting: "Beklemede",
      done: "Tamamlanan",
    }[key] || key
  );
}

function badge(key) {
  const map = {
    queue: { bg: "#EEF2FF", fg: "#3730A3" },
    doing: { bg: "#FFE4EC", fg: "#E92B63" },
    waiting: { bg: "#FFF7ED", fg: "#9A3412" },
    done: { bg: "#ECFDF3", fg: "#027A48" },
  };
  const c = map[key] || { bg: "#F2F4F7", fg: "#344054" };
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

function formatTR(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

export default function ProgramPlanPage() {
  const [rows, setRows] = useState([
    {
      id: "r1",
      startDate: "2026-02-12",
      endDate: "2026-02-13",
      title: "Landing page onay",
      type: "Web",
      project: "CK Web",
      assignee: "Şerif",
      stage: "Tasarım",
      status: "doing",
    },
    {
      id: "r2",
      startDate: "2026-02-13",
      endDate: "2026-02-14",
      title: "API test",
      type: "Yazılım",
      project: "CRM",
      assignee: "Ahmet",
      stage: "Test",
      status: "done",
    },
    {
      id: "r3",
      startDate: "2026-02-14",
      endDate: "2026-02-18",
      title: "Store görsel",
      type: "Mobil",
      project: "Empet App",
      assignee: "Zeynep",
      stage: "Yayın",
      status: "waiting",
    },
  ]);

  const [rangeKey, setRangeKey] = useState("week");
  const [statusKey, setStatusKey] = useState("all");

  // modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    startDate: "",
    endDate: "",
    title: "",
    type: "",
    project: "",
    assignee: "",
    stage: "",
    status: "queue",
  });

  const filtered = useMemo(() => {
    const { from, to } = rangeToDates(rangeKey);

    return rows.filter((r) => {
      const statusOk = statusKey === "all" ? true : r.status === statusKey;

      let dateOk = true;
      if (from && to) {
        const s = startOfDay(r.startDate);
        const e = endOfDay(r.endDate || r.startDate);
        dateOk = isBetween(s, from, to) || isBetween(e, from, to) || (s <= from && e >= to);
      }

      return statusOk && dateOk;
    });
  }, [rows, rangeKey, statusKey]);

  function openCreate() {
    setForm({
      id: null,
      startDate: "",
      endDate: "",
      title: "",
      type: "",
      project: "",
      assignee: "",
      stage: "",
      status: "queue",
    });
    setOpen(true);
  }

  function openEdit(row) {
    setForm({ ...row });
    setOpen(true);
  }

  function save() {
    if (!form.title.trim() || !form.startDate) return;

    const safe = {
      ...form,
      title: form.title.trim(),
      endDate: form.endDate || form.startDate,
    };

    if (safe.id) {
      setRows((prev) => prev.map((r) => (r.id === safe.id ? safe : r)));
    } else {
      setRows((prev) => [{ ...safe, id: `r-${Math.random().toString(36).slice(2, 10)}` }, ...prev]);
    }
    setOpen(false);
  }

  function remove(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div style={wrap}>
      {/* Header */}
      <div style={cardHeader}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 950, color: PRIMARY }}>Program</div>
          <div style={{ fontSize: 28, fontWeight: 950, color: "#111", marginTop: 8 }}>
            Plan & Akış
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#667085", marginTop: 8 }}>
            Burada işlerin başlangıç–bitiş tarihlerini planlarsın. Pano ise anlık takibi gösterir.
          </div>
        </div>

        <button onClick={openCreate} style={btnPrimary}>
          + Plan Ekle
        </button>
      </div>

      {/* Filters */}
      <div style={filters}>
        <div style={filterBox}>
          <div style={filterTitle}>Zaman filtresi</div>
          <div style={chips}>
            {RANGE.map((r) => (
              <button
                key={r.key}
                onClick={() => setRangeKey(r.key)}
                style={rangeKey === r.key ? chipActive : chip}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div style={filterBox}>
          <div style={filterTitle}>Durum filtresi</div>
          <select value={statusKey} onChange={(e) => setStatusKey(e.target.value)} style={select}>
            {STATUS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Başlangıç</th>
                <th style={th}>Bitiş</th>
                <th style={th}>Başlık</th>
                <th style={th}>Tür</th>
                <th style={th}>Proje</th>
                <th style={th}>Sorumlu</th>
                <th style={th}>Aşama</th>
                <th style={th}>Durum</th>
                <th style={th}>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={td}>{formatTR(r.startDate)}</td>
                  <td style={td}>{formatTR(r.endDate)}</td>
                  <td style={{ ...td, fontWeight: 950 }}>{r.title}</td>
                  <td style={td}>{r.type}</td>
                  <td style={td}>{r.project}</td>
                  <td style={td}>{r.assignee}</td>
                  <td style={td}>{r.stage}</td>
                  <td style={td}>
                    <span style={badge(r.status)}>{statusLabel(r.status)}</span>
                  </td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={btnGhost} onClick={() => openEdit(r)}>
                        Düzenle
                      </button>
                      <button style={btnDanger} onClick={() => remove(r.id)}>
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td style={{ ...td, padding: 18, color: "#667085" }} colSpan={9}>
                    Bu filtreye uygun kayıt yok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div style={modalOverlay} onMouseDown={() => setOpen(false)}>
          <div style={modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={dot} />
                <div style={{ fontWeight: 950, fontSize: 18 }}>
                  {form.id ? "Plan Düzenle" : "Plan Ekle"}
                </div>
              </div>
              <button style={xBtn} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              <div style={grid2}>
                <Field label="Başlangıç tarihi">
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  />
                </Field>

                <Field label="Bitiş tarihi">
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  />
                </Field>
              </div>

              <Field label="Başlık">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Örn: API test"
                />
              </Field>

              <div style={grid2}>
                <Field label="Tür">
                  <Input
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    placeholder="Web / Yazılım / Mobil"
                  />
                </Field>

                <Field label="Proje">
                  <Input
                    value={form.project}
                    onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}
                    placeholder="CRM / CK Web"
                  />
                </Field>
              </div>

              <div style={grid2}>
                <Field label="Sorumlu">
                  <Input
                    value={form.assignee}
                    onChange={(e) => setForm((p) => ({ ...p, assignee: e.target.value }))}
                    placeholder="Sude / Ahmet"
                  />
                </Field>

                <Field label="Aşama">
                  <Input
                    value={form.stage}
                    onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))}
                    placeholder="Tasarım / Test / Yayın"
                  />
                </Field>
              </div>

              <Field label="Durum">
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  style={select}
                >
                  {STATUS.filter((s) => s.key !== "all").map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div style={modalFooter}>
              <button style={btnGhost} onClick={() => setOpen(false)}>
                İptal
              </button>
              <button style={btnPrimary} onClick={save}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- small components (FIX: Field/Input) --- */
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

/* styles */
const wrap = { padding: 20 };

const cardHeader = {
  background: "#fff",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  border: "1px solid #f1f1f1",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const filters = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "1fr 360px",
  gap: 16,
};

const filterBox = {
  background: "#fff",
  borderRadius: 22,
  padding: 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  border: "1px solid #f1f1f1",
};

const filterTitle = { fontWeight: 950, fontSize: 14, color: "#111", marginBottom: 10 };
const chips = { display: "flex", gap: 10, flexWrap: "wrap" };

const chip = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};

const chipActive = {
  ...chip,
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  border: "1px solid rgba(233,43,99,0.22)",
};

const tableCard = {
  marginTop: 16,
  background: "#fff",
  borderRadius: 22,
  padding: 14,
  boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
  border: "1px solid #f1f1f1",
};

const table = { width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 950 };

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
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};

const btnDanger = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(233,43,99,0.22)",
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  fontWeight: 950,
  cursor: "pointer",
};

const select = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 900,
  fontSize: 14,
  outline: "none",
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
  maxWidth: 640,
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

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
