"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { projectsApi } from "@/lib/services/projects.service";

const PRIMARY = "#E92B63";
const SOFT = "#FFE4EC";
const STAGES = ["Analiz", "Tasarım", "Kodlama", "Test", "Yayın"];
const FLOW_STATUSES = ["Teklif", "Geliştirme", "Test"];

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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");

      setCustomers([
        { id: "c1", name: "CK Paslanmaz" },
        { id: "c2", name: "Dadaylılar" },
        { id: "c3", name: "Empet" },
        { id: "c4", name: "Kartepe Group" },
      ]);

      try {
        const data = await projectsApi.getById(id);

        const normalized = normalize(
          {
            id: data.id,
            project: data.name,
            customer: data.customer?.companyName || data.customer?.fullName || "",
            type: data.type || "DIGER",
            price: Number(data.price || 0),
            deliveryDate: data.deliveryDate ? toDateInput(data.deliveryDate) : "",
            flowStatus: STATUS_FROM_API[data.status] || "Teklif",
            team: "—",
            stage: "Analiz",
            deposit: 0,
            paymentDates: [],
          },
          id
        );

        if (!mounted) return;
        setProject(normalized);
        sessionStorage.setItem("selectedProject", JSON.stringify(normalized));
      } catch (e) {
        console.error(e);
        if (!mounted) return;

        const cached = sessionStorage.getItem("selectedProject");
        if (cached) setProject(normalize(JSON.parse(cached), id));
        else setProject(normalize({ id }, id));

        setErr(e?.response?.data?.message || "Proje yüklenemedi (backend)");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const finance = useMemo(() => {
    if (!project) return { total: 0, deposit: 0, remaining: 0, progress: 0 };
    const total = toNumber(project.price);
    const deposit = toNumber(project.deposit);
    return {
      total,
      deposit,
      remaining: Math.max(total - deposit, 0),
      progress: total ? Math.min(100, Math.round((deposit / total) * 100)) : 0,
    };
  }, [project]);

  async function handleSave() {
    if (!project) return;

    setSaving(true);
    setErr("");

    try {
      const payload = {
        name: project.project,
        type: project.type || "DIGER",
        status: STATUS_TO_API[project.flowStatus] || "TEKLIF",
        price: Number(toNumber(project.price)),
        deliveryDate: project.deliveryDate ? new Date(project.deliveryDate).toISOString() : null,
      };

      const updated = await projectsApi.update(id, payload);

      const normalized = normalize(
        {
          id: updated.id,
          project: updated.name,
          customer: updated.customer?.companyName || updated.customer?.fullName || project.customer,
          type: updated.type || project.type,
          price: Number(updated.price || project.price || 0),
          deliveryDate: updated.deliveryDate ? toDateInput(updated.deliveryDate) : project.deliveryDate,
          flowStatus: STATUS_FROM_API[updated.status] || project.flowStatus,
          team: project.team,
          stage: project.stage,
          deposit: project.deposit,
          paymentDates: project.paymentDates || [],
        },
        id
      );

      setProject(normalized);
      sessionStorage.setItem("selectedProject", JSON.stringify(normalized));
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 50, fontWeight: 900, color: PRIMARY }}>Yükleniyor...</div>;
  if (!project) return <div style={{ padding: 50, fontWeight: 900, color: "red" }}>Proje bulunamadı.</div>;

  return (
    <>
      <PageHeader />
      <div style={{ padding: 30 }}>
        {err ? <div style={{ marginBottom: 12, color: "red", fontWeight: 900 }}>{err}</div> : null}

        <div style={header}>
          <div style={{ flex: 1 }}>
            <div style={miniTitle}>Proje Kartı</div>

            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                <input style={inputTransparent} value={project.project} onChange={(e) => setProject({ ...project, project: e.target.value })} />
                <select style={selectHeader} value={project.customer} onChange={(e) => setProject({ ...project, customer: e.target.value })}>
                  <option value="">Müşteri Seç...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name} style={{ color: "#333" }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div style={mainTitle}>{project.project}</div>
                <div style={customerText}>{project.customer || "Müşteri seçilmedi"}</div>
              </>
            )}
          </div>
        </div>

        <div style={grid}>
          <Card title="Genel Bilgi">
            <InfoRow label="Tür" isEditing={isEditing} value={project.type} onChange={(v) => setProject({ ...project, type: v })} />
            <InfoRow label="Sorumlu" isEditing={isEditing} value={project.team} onChange={(v) => setProject({ ...project, team: v })} />
            <InfoRow label="Teslim" type="date" isEditing={isEditing} value={project.deliveryDate} onChange={(v) => setProject({ ...project, deliveryDate: v })} />
          </Card>

          <Card title="Durum">
            <div style={{ marginTop: 12 }}>
              {FLOW_STATUSES.map((fs) => (
                <div key={fs} style={timelineRow} onClick={() => isEditing && setProject({ ...project, flowStatus: fs })}>
                  <div style={{ ...timelineDot, background: project.flowStatus === fs ? PRIMARY : "#e5e7eb" }} />
                  <div style={{ fontWeight: project.flowStatus === fs ? 950 : 800, color: project.flowStatus === fs ? PRIMARY : "#344054", cursor: isEditing ? "pointer" : "default" }}>
                    {fs}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Aşamalar">
            <div style={{ marginTop: 12 }}>
              {STAGES.map((s) => (
                <div key={s} style={timelineRow} onClick={() => isEditing && setProject({ ...project, stage: s })}>
                  <div style={{ ...timelineDot, background: project.stage === s ? PRIMARY : "#e5e7eb" }} />
                  <div style={{ fontWeight: project.stage === s ? 950 : 800, color: project.stage === s ? PRIMARY : "#344054", cursor: isEditing ? "pointer" : "default" }}>
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Finans">
            <EditInfoRow label="Toplam Fiyat" type="number" isEditing={isEditing} value={project.price} onChange={(v) => setProject({ ...project, price: v })} />
            <EditInfoRow label="Peşinat" type="number" isEditing={isEditing} value={project.deposit} onChange={(v) => setProject({ ...project, deposit: v })} />
            <div style={infoRowStyle}>
              <span style={infoLabel}>Kalan</span>
              <span style={{ ...infoValue, color: PRIMARY }}>{finance.remaining} TL</span>
            </div>
          </Card>

          <div style={paymentSectionWrapper}>
            <div style={{ flex: 2 }}>
              <Card title="Ödeme Tarihleri">
                {(project.paymentDates || []).length === 0 ? <div style={{ color: "#667085", fontWeight: 900 }}>Ödeme tarihi yok.</div> : null}
              </Card>
            </div>

            <div style={actionButtonGroup}>
              {isEditing ? (
                <button style={saveBtnSide} onClick={handleSave} disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              ) : (
                <button style={editBtnSide} onClick={() => setIsEditing(true)}>
                  Düzenle
                </button>
              )}
              <button style={backBtnSide} onClick={() => router.back()} disabled={saving}>
                Geri
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* UI components */
function Card({ title, children }) {
  return (
    <div style={cardStyle}>
      <div style={cardTitleStyle}>{title}</div>
      {children}
    </div>
  );
}
function InfoRow({ label, value, isEditing, onChange, type = "text" }) {
  return (
    <div style={infoRowStyle}>
      <span style={infoLabel}>{label}</span>
      {isEditing ? <input type={type} style={inputStyle} value={value || ""} onChange={(e) => onChange(e.target.value)} /> : <span style={infoValue}>{value || "—"}</span>}
    </div>
  );
}
function EditInfoRow({ label, value, isEditing, onChange, type = "text" }) {
  return (
    <div style={infoRowStyle}>
      <span style={infoLabel}>{label}</span>
      {isEditing ? <input type={type} style={inputStyle} value={value ?? ""} onChange={(e) => onChange(e.target.value)} /> : <span style={infoValue}>{type === "number" ? `${value || 0} TL` : value || "—"}</span>}
    </div>
  );
}

/* helpers */
function normalize(p, id) {
  return {
    id: p.id ?? id,
    project: p.project ?? "Yeni Proje",
    customer: p.customer ?? "",
    type: p.type ?? "DIGER",
    team: p.team ?? "—",
    deliveryDate: p.deliveryDate ?? "",
    flowStatus: p.flowStatus ?? "Teklif",
    stage: p.stage ?? "Analiz",
    price: p.price ?? 0,
    deposit: p.deposit ?? 0,
    paymentDates: p.paymentDates ?? [],
  };
}
function toNumber(v) {
  const n = Number(String(v).replace(/[^0-9.-]+/g, ""));
  return isNaN(n) ? 0 : n;
}
function toDateInput(anyIso) {
  const d = new Date(anyIso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/* styles */
const header = { background: `linear-gradient(135deg, ${PRIMARY}, #ff6b9a)`, padding: 26, borderRadius: 22, color: "#fff", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 };
const miniTitle = { fontSize: 13, fontWeight: 900, opacity: 0.95 };
const mainTitle = { fontSize: 30, fontWeight: 950, marginTop: 6 };
const customerText = { fontSize: 16, fontWeight: 900, opacity: 0.9, marginTop: 4 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 };
const cardStyle = { background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 16px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(233,43,99,0.10)" };
const cardTitleStyle = { fontSize: 15, fontWeight: 950, marginBottom: 12, color: PRIMARY, borderBottom: "1px solid rgba(233,43,99,0.12)", paddingBottom: 10 };
const infoRowStyle = { display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" };
const infoLabel = { color: "#667085", fontWeight: 900, fontSize: 13 };
const infoValue = { fontWeight: 950, color: "#101828", fontSize: 14 };
const inputStyle = { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", textAlign: "right", width: "160px", outline: "none", fontWeight: "900" };
const inputTransparent = { background: "rgba(255,255,255,0.1)", border: "1px solid #fff", borderRadius: 8, color: "#fff", fontSize: "24px", fontWeight: "900", outline: "none", width: "100%", padding: "5px" };
const selectHeader = { ...inputTransparent, fontSize: "16px", cursor: "pointer" };
const timelineRow = { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 };
const timelineDot = { width: 12, height: 12, borderRadius: 999 };
const paymentSectionWrapper = { display: "flex", gap: 16, gridColumn: "span 2" };
const actionButtonGroup = { display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" };
const sideBtnBase = { padding: "15px 30px", borderRadius: "16px", fontWeight: "900", cursor: "pointer", border: "none", fontSize: "14px", minWidth: "120px" };
const saveBtnSide = { ...sideBtnBase, background: PRIMARY, color: "#fff" };
const editBtnSide = { ...sideBtnBase, background: "#fff", color: PRIMARY, border: `2px solid ${PRIMARY}` };
const backBtnSide = { ...sideBtnBase, background: "#f2f4f7", color: "#667085" };
