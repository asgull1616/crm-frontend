"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { projectsApi } from "@/lib/services/projects.service";
import { customerService } from "@/lib/services/customer.service";

const PRIMARY = "#E92B63";
const STATUS = ["Teklif", "Geliştirme", "Test"];

const STATUS_TO_API = {
  Teklif: "TEKLIF",
  Geliştirme: "GELISTIRME",
  Test: "TEST",
};

const STATUS_FROM_API = {
  TEKLIF: "Teklif",
  GELISTIRME: "Geliştirme",
  TEST: "Test",
};

function extractList(res) {
  // axios -> res.data, bazen direkt array dönüyor olabilir
  const data = res?.data ?? res;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
}

function mapProject(p) {
  return {
    id: p.id,
    project: p.name ?? p.project ?? "",
    customer: p.customer?.companyName || p.customer?.fullName || p.customerName || "",
    type: p.type || "DIGER",
    price: Number(p.price || 0),
    deliveryDate: p.deliveryDate ? new Date(p.deliveryDate).toISOString().slice(0, 10) : "",
    flowStatus: STATUS_FROM_API[p.status] || p.flowStatus || "Teklif",
  };
}

export default function ProjectsBoardPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]); // ✅ Müşteri listesi
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Hepsi");

  // modal
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    customerId: "", // ✅ customerName yerine customerId
    type: "YAZILIM", // ✅ backend enum
    price: "",
    deliveryDate: "",
    status: "Teklif",
  });

  // ✅ Müşterileri çek
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerService.list({ limit: 100 });
        const list = res.data?.data || res.data || [];
        setCustomers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Customers list error:", err);
      }
    };
    fetchCustomers();
  }, []);

  const loadProjects = useCallback(async () => {
    setErr("");
    try {
      setLoading(true);

      // ✅ cache bust + no-cache (service tarafında da ekleyeceğiz)
      const res = await projectsApi.list();
      const list = extractList(res);
      const mapped = list.map(mapProject);

      setProjects(mapped);
    } catch (e) {
      console.error("Projects list error:", e);
      setErr(e?.response?.data?.message || "Projeler yüklenemedi");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "Hepsi") return projects;
    return projects.filter((p) => p.flowStatus === activeFilter);
  }, [projects, activeFilter]);

  const handleEditNavigation = (p) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(p));
    router.push(`/projects/${p.id}?edit=true`);
  };

  const handleRowNavigation = (p) => {
    sessionStorage.setItem("selectedProject", JSON.stringify(p));
    router.push(`/projects/${p.id}`);
  };

  function openCreate() {
    setErr("");
    setForm({
      name: "",
      customerId: "",
      type: "YAZILIM",
      price: "",
      deliveryDate: "",
      status: "Teklif",
    });
    setOpen(true);
  }

  async function createProject() {
    if (!form.name.trim()) return setErr("Proje adı zorunlu");
    if (!form.price || Number(form.price) <= 0) return setErr("Fiyat zorunlu");

    setSaving(true);
    setErr("");

    try {
      const payload = {
        name: form.name.trim(),
        customerId: form.customerId || null, // ✅ Seçilen müşteri ID'si
        type: form.type, // ✅ WEB/MOBIL/YAZILIM/TASARIM/DIGER
        status: STATUS_TO_API[form.status] || "TEKLIF",
        price: Number(form.price),
        deliveryDate: form.deliveryDate ? new Date(form.deliveryDate).toISOString() : null,
      };

      await projectsApi.create(payload);
      setOpen(false);

      // ✅ listeyi tekrar çek
      await loadProjects();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Proje eklenemedi (backend)");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id) {
    const ok = confirm("Bu projeyi silmek istiyor musun?");
    if (!ok) return;

    setSaving(true);
    setErr("");

    try {
      await projectsApi.delete(id);
      await loadProjects();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Silinemedi (backend)");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader />

      <div style={{ padding: 20 }}>
        {/* ÜST KART */}
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

              <button onClick={openCreate} style={btnPrimary}>
                + Proje Ekle
              </button>

              <button onClick={loadProjects} style={btnGhost} disabled={loading || saving}>
                Yenile
              </button>
            </div>

            {err ? <div style={{ marginTop: 10, color: "red", fontWeight: 900 }}>{err}</div> : null}
            {loading ? <div style={{ marginTop: 10, color: "#667085", fontWeight: 900 }}>Yükleniyor...</div> : null}
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
                  <th style={th}>İşlemler</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id} style={rowStyle} onClick={() => handleRowNavigation(p)}>
                    <td style={{ ...td, fontWeight: 950 }}>{p.project}</td>
                    <td style={td}>{p.customer || "—"}</td>
                    <td style={td}>{p.type}</td>
                    <td style={td}>{formatTL(p.price)}</td>
                    <td style={td}>{p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString("tr-TR") : "-"}</td>
                    <td style={td}>
                      <span style={badgeFlow(p.flowStatus)}>{p.flowStatus}</span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={btnGhostSmall}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNavigation(p);
                          }}
                        >
                          Düzenle
                        </button>

                        <button
                          style={btnDangerSmall}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(p.id);
                          }}
                          disabled={saving}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...td, color: "#667085", fontWeight: 900, padding: 18 }}>
                      Kayıt yok.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: PROJE EKLE */}
      {open ? (
        <div style={modalOverlay} onMouseDown={() => setOpen(false)}>
          <div style={modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={{ fontWeight: 950, fontSize: 16 }}>Proje Ekle</div>
              <button style={xBtn} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              {err ? <div style={{ color: "red", fontWeight: 900 }}>{err}</div> : null}

              <Field label="Proje Adı">
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>

              <Field label="İlgili Müşteri">
                <select
                  style={select}
                  value={form.customerId}
                  onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))}
                >
                  <option value="">Müşteri Seçin</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName || c.companyName || "İsimsiz Müşteri"}
                    </option>
                  ))}
                </select>
              </Field>

              <div style={grid2}>
                <Field label="Tür">
                  <select style={select} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                    <option value="WEB">WEB</option>
                    <option value="MOBIL">MOBIL</option>
                    <option value="YAZILIM">YAZILIM</option>
                    <option value="TASARIM">TASARIM</option>
                    <option value="DIGER">DIGER</option>
                  </select>
                </Field>

                <Field label="Durum">
                  <select style={select} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={grid2}>
                <Field label="Fiyat (TL)">
                  <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
                </Field>

                <Field label="Teslim Tarihi">
                  <Input type="date" value={form.deliveryDate} onChange={(e) => setForm((p) => ({ ...p, deliveryDate: e.target.value }))} />
                </Field>
              </div>
            </div>

            <div style={modalFooter}>
              <button style={btnGhost} onClick={() => setOpen(false)} disabled={saving}>
                İptal
              </button>
              <button style={btnPrimary} onClick={createProject} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* helpers */
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

/* styles */
const topCard = {
  background: "#fff",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  border: "1px solid #f1f1f1",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
};

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
const btnDangerSmall = { padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(233,43,99,0.25)", background: "#FFE4EC", color: PRIMARY, fontSize: 12, fontWeight: 900, cursor: "pointer" };

const btnPrimary = { padding: "10px 14px", borderRadius: 14, border: "none", background: PRIMARY, color: "#fff", fontWeight: 950, cursor: "pointer", boxShadow: "0 10px 26px rgba(233,43,99,0.25)" };
const btnGhost = { padding: "10px 14px", borderRadius: 14, border: "1px solid #eee", background: "#fff", fontWeight: 950, cursor: "pointer" };

const select = { width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #eee", background: "#fff", fontWeight: 900, fontSize: 14, outline: "none" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 14, border: "1px solid #eee", outline: "none", fontSize: 14, fontWeight: 900 };

const modalOverlay = { position: "fixed", inset: 0, background: "rgba(17,17,17,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 9999 };
const modal = { width: "100%", maxWidth: 640, borderRadius: 20, background: "rgba(255,255,255,0.92)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 26px 80px rgba(0,0,0,0.25)", backdropFilter: "blur(10px)", overflow: "hidden" };
const modalHeader = { padding: 16, borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" };
const modalFooter = { padding: 16, borderTop: "1px solid #f0f0f0", background: "rgba(255,255,255,0.65)", display: "flex", justifyContent: "flex-end", gap: 10 };
const xBtn = { width: 38, height: 38, borderRadius: 12, border: "1px solid #eee", background: "#fff", cursor: "pointer", fontWeight: 950 };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
