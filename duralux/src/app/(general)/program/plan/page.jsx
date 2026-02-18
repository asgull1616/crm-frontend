"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { programPlanApi } from "@/lib/services/programPlan.service";

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

/** ✅ Filtre dropdown'ı backend ile uyumlu (query param: status) */
const STATUS = [
  { key: "tumu", label: "Tümü" },
  { key: "siradaki-isler", label: "Sıradaki işler" },
  { key: "yapiliyor", label: "Yapılıyor" },
  { key: "beklemede", label: "Beklemede" },
  { key: "tamamlanan", label: "Tamamlanan" },
];

/** ✅ Backend time param: today/week/month/all */
const RANGE = [
  { key: "today", label: "Bugün" },
  { key: "week", label: "Bu Hafta" },
  { key: "month", label: "Bu Ay" },
  { key: "all", label: "Tümü" },
];

/** UI (modal) status -> API enum */
const STATUS_TO_API = {
  queue: "NEXT",
  doing: "IN_PROGRESS",
  waiting: "WAITING",
  done: "DONE",
};

/** API enum -> UI badge */
const STATUS_FROM_API = {
  NEXT: "queue",
  IN_PROGRESS: "doing",
  WAITING: "waiting",
  DONE: "done",
};

const TYPE_TO_API = (v) => {
  const x = (v || "").toLowerCase();
  if (x.includes("mobil")) return "MOBIL";
  if (x.includes("web")) return "WEB";
  if (x.includes("tasarım") || x.includes("tasarim")) return "TASARIM";
  if (x.includes("backend")) return "BACKEND";
  if (x.includes("frontend")) return "FRONTEND";
  return "DIGER";
};

const STAGE_TO_API = (v) => {
  const x = (v || "").toLowerCase();
  if (x.includes("analiz")) return "ANALIZ";
  if (x.includes("tasarım") || x.includes("tasarim")) return "TASARIM";
  if (x.includes("kod")) return "KODLAMA";
  if (x.includes("test")) return "TEST";
  if (x.includes("yayın") || x.includes("yayin")) return "YAYIN";
  return "DIGER";
};

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
    fontWeight: 500,
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
  const [rows, setRows] = useState([]);
  const [rangeKey, setRangeKey] = useState("week");
  const [statusKey, setStatusKey] = useState("tumu");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    startDate: "",
    endDate: "",
    title: "",
    type: "",
    project: "",
    assignee: "", // sadece gösterim (şimdilik)
    assigneeId: null, // ileride dropdown yapınca dolduracağız
    stage: "",
    status: "queue", // UI status key
  });

  async function fetchPlans() {
    setLoading(true);
    setError("");
    try {
      const data = await programPlanApi.list({
        time: rangeKey,
        status: statusKey,
      });

      const mapped = (data || []).map((x) => ({
        id: x.id,
        startDate: x.startDate,
        endDate: x.endDate,
        title: x.title,
        type: x.type, // enum (MOBIL/WEB/...)
        project: x.projectName || "",
        assignee: x.assignee?.username || "",
        assigneeId: x.assigneeId || null,
        stage: x.stage, // enum
        status: STATUS_FROM_API[x.status] || "queue", // badge için
      }));

      setRows(mapped);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Planlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey, statusKey]);

  function openCreate() {
    setForm({
      id: null,
      startDate: "",
      endDate: "",
      title: "",
      type: "",
      project: "",
      assignee: "",
      assigneeId: null,
      stage: "",
      status: "queue",
    });
    setOpen(true);
  }

  function openEdit(row) {
    // date input yyyy-mm-dd ister, iso geldiyse düzelt
    const toYMD = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");
    setForm({
      ...row,
      startDate: toYMD(row.startDate),
      endDate: toYMD(row.endDate),
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.startDate) return;

    const payload = {
      title: form.title.trim(),
      type: TYPE_TO_API(form.type),
      projectName: form.project?.trim() || null,
      startDate: form.startDate, // YYYY-MM-DD OK
      endDate: form.endDate || form.startDate,
      stage: STAGE_TO_API(form.stage),
      status: STATUS_TO_API[form.status] || "NEXT",
      assigneeId: form.assigneeId || undefined,
    };

    try {
      if (form.id) {
        await programPlanApi.update(form.id, payload);
      } else {
        await programPlanApi.create(payload);
      }
      setOpen(false);
      await fetchPlans();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Kaydedilemedi");
    }
  }

  async function remove(id) {
    const ok = confirm("Bu planı silmek istiyor musun?");
    if (!ok) return;

    try {
      await programPlanApi.remove(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Silinemedi");
    }
  }

  return (
    <>
      <PageHeader title="Program Plan" />

      <div style={wrap}>
        {/* Header */}
        <div style={cardHeader}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: PRIMARY }}>Program</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: "#111", marginTop: 8 }}>
              Plan & Akış
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#667085", marginTop: 8 }}>
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
          {loading ? (
            <div style={{ padding: 12, fontWeight: 500 }}>Yükleniyor...</div>
          ) : error ? (
            <div style={{ padding: 12, fontWeight: 500, color: "red" }}>{error}</div>
          ) : null}

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
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={td}>{formatTR(r.startDate)}</td>
                    <td style={td}>{formatTR(r.endDate)}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{r.title}</td>
                    <td style={td}>{r.type}</td>
                    <td style={td}>{r.project}</td>
                    <td style={td}>{r.assignee || "-"}</td>
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

                {rows.length === 0 ? (
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
                  <div style={{ fontWeight: 500, fontSize: 18 }}>
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
                  <Field label="Sorumlu (şimdilik text)">
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
                    <option value="queue">Sıradaki işler</option>
                    <option value="doing">Yapılıyor</option>
                    <option value="waiting">Beklemede</option>
                    <option value="done">Tamamlanan</option>
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
    </>
  );
}

/* --- small components --- */
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#344054" }}>{label}</div>
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

const filterTitle = { fontWeight: 500, fontSize: 14, color: "#111", marginBottom: 10 };
const chips = { display: "flex", gap: 10, flexWrap: "wrap" };

const chip = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 500,
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
  fontWeight: 500,
  color: "#344054",
  borderBottom: "1px solid #F2F4F7",
  whiteSpace: "nowrap",
};

const td = {
  padding: 12,
  fontSize: 14,
  fontWeight: 500,
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
  fontWeight: 500,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(233,43,99,0.3)",
};

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 500,
  cursor: "pointer",
};

const btnDanger = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(233,43,99,0.22)",
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  fontWeight: 500,
  cursor: "pointer",
};

const select = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 500,
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
  fontWeight: 500,
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
  fontWeight: 500,
};

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
