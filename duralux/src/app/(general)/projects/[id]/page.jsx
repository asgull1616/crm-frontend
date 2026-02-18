"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { projectsApi } from "@/lib/services/projects.service";
import { customerService } from "@/lib/services/customer.service";

// ✅ EKLENDİ
import { taskService } from "@/lib/services/task.service";
import { userService } from "@/lib/services/user.service";

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

  // ✅ EKLENDİ: görevler + filtreler
  const [taskUsers, setTaskUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskFilters, setTaskFilters] = useState({
    assignedUserId: "",
    status: "",
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const [projRes, custRes] = await Promise.all([
          projectsApi.getById(id),
          customerService.list({ limit: 100 })
        ]);

        const data = projRes;
        const custData = custRes.data?.data || custRes.data || [];
        setCustomers(Array.isArray(custData) ? custData : []);

        const normalized = normalize(
          {
            id: data.id,
            project: data.name,
            customer: data.customer?.companyName || data.customer?.fullName || "",
            customerId: data.customerId || "",
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

  // ✅ EKLENDİ: proje bazlı görevleri çek
  useEffect(() => {
    let mounted = true;

    async function loadTasks() {
      if (!id) return;
      setTasksLoading(true);

      try {
        const [taskRes, userRes] = await Promise.all([
          taskService.list({
            page: 1,
            limit: 200,
            projectId: id,
            assignedUserId: taskFilters.assignedUserId || undefined,
            status: taskFilters.status || undefined,
          }),
          userService.list({ page: 1, limit: 200 }),
        ]);

        const taskData = taskRes?.data?.data ?? [];
        const userData = userRes?.data?.data ?? [];

        if (!mounted) return;
        setTasks(Array.isArray(taskData) ? taskData : []);
        setTaskUsers(Array.isArray(userData) ? userData : []);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setTasks([]);
        setTaskUsers([]);
      } finally {
        if (mounted) setTasksLoading(false);
      }
    }

    loadTasks();

    return () => {
      mounted = false;
    };
  }, [id, taskFilters.assignedUserId, taskFilters.status]);

  const taskUserMap = useMemo(() => {
    const m = new Map();
    taskUsers.forEach((u) => m.set(u.id, u));
    return m;
  }, [taskUsers]);

  const getUserLabel = (uid) => {
    if (!uid) return "-";
    const u = taskUserMap.get(uid);
    return u ? `${u.username ?? u.email ?? "Kullanıcı"}` : uid;
  };

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
        customerId: project.customerId || null,
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
          customerId: updated.customerId || project.customerId,
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
                <select
                  style={selectHeader}
                  value={project.customerId || ""}
                  onChange={(e) => {
                    const cid = e.target.value;
                    const c = customers.find((x) => x.id === cid);
                    setProject({
                      ...project,
                      customerId: cid,
                      customer: c ? c.companyName || c.fullName : "",
                    });
                  }}
                >
                  <option value="">Müşteri Seç...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} style={{ color: "#333" }}>
                      {c.companyName || c.fullName || "İsimsiz"}
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

          {/* ✅ EKLENDİ: GÖREVLER */}
          <Card title="Görevler">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <select
                style={{ ...inputStyle, width: "220px", textAlign: "left" }}
                value={taskFilters.assignedUserId}
                onChange={(e) => setTaskFilters((p) => ({ ...p, assignedUserId: e.target.value }))}
              >
                <option value="">Tüm Çalışanlar</option>
                {taskUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username || u.email}
                  </option>
                ))}
              </select>

              <select
                style={{ ...inputStyle, width: "200px", textAlign: "left" }}
                value={taskFilters.status}
                onChange={(e) => setTaskFilters((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="">Tüm Durumlar</option>
                <option value="NEW">Yeni</option>
                <option value="IN_PROGRESS">İşlemde</option>
                <option value="ON_HOLD">Beklemede</option>
                <option value="COMPLETED">Tamamlandı</option>
              </select>

              <button
                onClick={() => setTaskFilters({ assignedUserId: "", status: "" })}
                style={{
                  ...sideBtnBase,
                  padding: "10px 14px",
                  minWidth: 0,
                  background: "#fff",
                  color: PRIMARY,
                  border: `1px solid rgba(233,43,99,0.35)`,
                }}
                type="button"
              >
                Filtreyi Sıfırla
              </button>

              <button
                onClick={() => router.push(`/tasks/create?projectId=${id}`)}
                style={{
                  ...sideBtnBase,
                  padding: "10px 14px",
                  minWidth: 0,
                  background: PRIMARY,
                  color: "#fff",
                }}
                type="button"
              >
                + Görev Ekle
              </button>
            </div>

            {tasksLoading ? (
              <div style={{ padding: 12, fontWeight: 900, color: "#667085" }}>
                Görevler yükleniyor...
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ padding: 12, fontWeight: 900, color: "#667085" }}>
                Bu projede görev bulunamadı.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                  <thead>
                    <tr style={{ color: "#667085", fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>
                      <th style={{ textAlign: "left", padding: "6px 10px" }}>Görev Adı</th>
                      <th style={{ textAlign: "left", padding: "6px 10px" }}>Durum</th>
                      <th style={{ textAlign: "left", padding: "6px 10px" }}>Atanan</th>
                      <th style={{ textAlign: "left", padding: "6px 10px" }}>Bitiş</th>
                      <th style={{ textAlign: "right", padding: "6px 10px" }}>Aksiyon</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((t) => (
                      <tr
                        key={t.id}
                        style={{
                          background: "#fff",
                          boxShadow: "0 10px 24px rgba(16,24,40,0.06)",
                          borderRadius: 14,
                        }}
                      >
                        <td style={{ padding: "12px 10px", fontWeight: 950, color: "#101828" }}>
                          {t.title}
                        </td>

                        <td style={{ padding: "12px 10px", fontWeight: 900 }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "6px 10px",
                              borderRadius: 999,
                              background:
                                t.status === "COMPLETED"
                                  ? "#ECFDF5"
                                  : t.status === "ON_HOLD"
                                    ? "#FFFBEB"
                                    : t.status === "IN_PROGRESS"
                                      ? "#EEF2FF"
                                      : "#F1F5F9",
                              color:
                                t.status === "COMPLETED"
                                  ? "#065F46"
                                  : t.status === "ON_HOLD"
                                    ? "#92400E"
                                    : t.status === "IN_PROGRESS"
                                      ? "#3730A3"
                                      : "#0F172A",
                              fontSize: 12,
                            }}
                          >
                            {t.status === "NEW"
                              ? "Yeni"
                              : t.status === "IN_PROGRESS"
                                ? "İşlemde"
                                : t.status === "ON_HOLD"
                                  ? "Beklemede"
                                  : "Tamamlandı"}
                          </span>
                        </td>

                        <td style={{ padding: "12px 10px", fontWeight: 900, color: "#344054" }}>
                          {getUserLabel(t.assignedUserId)}
                        </td>

                        <td style={{ padding: "12px 10px", fontWeight: 900, color: "#344054" }}>
                          {t.endDate ? new Date(t.endDate).toLocaleDateString("tr-TR") : "-"}
                        </td>

                        <td style={{ padding: "12px 10px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => router.push(`/tasks/view/${t.id}`)}
                              style={{
                                ...sideBtnBase,
                                padding: "10px 12px",
                                minWidth: 0,
                                background: "#fff",
                                color: "#344054",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              Görüntüle
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/tasks/edit/${t.id}`)}
                              style={{
                                ...sideBtnBase,
                                padding: "10px 12px",
                                minWidth: 0,
                                background: "#fff",
                                color: PRIMARY,
                                border: `1px solid rgba(233,43,99,0.35)`,
                              }}
                            >
                              Düzenle
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
    customerId: p.customerId ?? "",
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
