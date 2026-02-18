"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const toUiStatus = (s) => (s === "ACTIVE" ? "AKTİF" : "PASİF");

const formatTrDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("tr-TR");
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("create"); // create | edit | view
  const [selectedId, setSelectedId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const fileInputRef = useRef(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }, []);

  const jsonHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const uploadHeaders = useMemo(() => {
    const h = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h; // ❌ Content-Type YOK (FormData boundary'i bozmasın)
  }, [token]);

  /* ================= LIST ================= */

  const fetchContracts = useCallback(async () => {
    setLoading(true);

    const res = await fetch(`${API_BASE}/api/files/contracts?page=1&limit=50`, {
      headers: jsonHeaders,
    });

    if (res.ok) {
      const json = await res.json();
      const items = (json?.data || []).map((x) => ({
        id: x.id,
        title: x.title,
        date: formatTrDate(x.createdAt),
        status: toUiStatus(x.status),
        fileUrl: x.fileUrl || null,
      }));
      setContracts(items);
    }

    setLoading(false);
  }, [jsonHeaders]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  /* ================= CUSTOMERS ================= */

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch(`${API_BASE}/api/customers`, {
        headers: jsonHeaders,
      });

      if (!res.ok) return;

      const json = await res.json();
      setCustomers(json?.data || []);
    };

    fetchCustomers();
  }, [jsonHeaders]);

  /* ================= DETAIL ================= */

  const fetchDetail = async (id) => {
    const res = await fetch(`${API_BASE}/api/files/contracts/${id}`, {
      headers: jsonHeaders,
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json;
  };

  const fillForm = (data) => {
    setNewTitle(data.title || "");
    setNewDesc(data.description || "");
    setSelectedCustomer(data.customerId || "");
    setStartDate(data.startDate?.slice(0, 10) || "");
    setEndDate(data.endDate?.slice(0, 10) || "");
    setStatus(data.status || "ACTIVE");
    setNewFile(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setSelectedCustomer("");
    setStartDate("");
    setEndDate("");
    setStatus("ACTIVE");
    setNewFile(null);
    setSelectedId(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreate = () => {
    resetForm();
    setMode("create");
    setIsOpen(true);
  };

  const openView = async (item) => {
    const detail = await fetchDetail(item.id);
    if (!detail) return;

    fillForm(detail);
    setSelectedId(item.id);
    setMode("view");
    setIsOpen(true);
  };

  const openEdit = async (item) => {
    const detail = await fetchDetail(item.id);
    if (!detail) return;

    fillForm(detail);
    setSelectedId(item.id);
    setMode("edit");
    setIsOpen(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!newTitle.trim()) return alert("Sözleşme adı gerekli");
    if (!selectedCustomer) return alert("Firma seçmelisin");

    // create sırasında dosya zorunlu
    if (mode === "create" && !newFile) return alert("Dosya seçmelisin");

    // ✅ CREATE: multipart upload
    if (mode === "create") {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("description", newDesc || "");
      formData.append("customerId", selectedCustomer);
      formData.append("startDate", startDate || "");
      formData.append("endDate", endDate || "");
      formData.append("status", status || "ACTIVE");
      if (newFile) formData.append("file", newFile); // ✅ backend: FileInterceptor('file')

      const res = await fetch(`${API_BASE}/api/files/contracts`, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("CREATE CONTRACT UPLOAD ERROR:", t);
        return alert("Dosya yükleme başarısız. Backend upload endpointini kontrol et.");
      }
    }

    // ✅ EDIT: JSON update (dosya güncellemesi yok)
    if (mode === "edit" && selectedId) {
      const payload = {
        title: newTitle,
        description: newDesc || null,
        customerId: selectedCustomer,
        startDate,
        endDate,
        status,
      };

      const res = await fetch(`${API_BASE}/api/files/contracts/${selectedId}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("UPDATE CONTRACT ERROR:", t);
        return alert("Güncelleme başarısız.");
      }
    }

    await fetchContracts();
    setIsOpen(false);
    resetForm();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/api/files/contracts/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("DELETE CONTRACT ERROR:", t);
      alert("Silme başarısız.");
    }

    await fetchContracts();
  };

  /* ================= RENDER ================= */

  return (
    <>
      <PageHeader />

      <div className="contracts-wrapper">
        <div className="contracts-header">
          <div>
            <h2>Sözleşmeler</h2>
            <p>Proje ile ilgili hukuki belgeler</p>
          </div>
          <button className="btn-gradient" onClick={openCreate}>
            + Yeni Dosya
          </button>
        </div>

        {loading && <p>Yükleniyor...</p>}

        <div className="contracts-grid">
          {contracts.map((item) => (
            <div key={item.id} className="contract-card">
              <div className="card-top">
                <div className="card-icon">📄</div>
                <div className="status-badge">{item.status}</div>
              </div>

              <div className="card-body">
                <h3>{item.title}</h3>
                <span>{item.date}</span>
              </div>

              <div className="card-footer">
                <button className="btn-soft" onClick={() => openView(item)}>
                  Görüntüle
                </button>

                <button className="btn-soft" onClick={() => openEdit(item)}>
                  Düzenle
                </button>

                <button className="btn-danger-soft" onClick={() => handleDelete(item.id)}>
                  Sil
                </button>

                {item.fileUrl ? (
                  <button
                    className="btn-soft"
                    onClick={() =>
                      window.open(
                        item.fileUrl.startsWith("http") ? item.fileUrl : `${API_BASE}${item.fileUrl}`,
                        "_blank"
                      )
                    }
                  >
                    Dosyayı Aç
                  </button>
                ) : (
                  <button className="btn-soft" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                    Dosya Yok
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= MODAL ================= */}
        {isOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>
                {mode === "create" ? "Yeni Sözleşme" : mode === "edit" ? "Sözleşmeyi Düzenle" : "Sözleşme Detayı"}
              </h3>

              <div className="modal-field">
                <label>Sözleşme Adı</label>
                <input
                  disabled={mode === "view"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label>Firma Adı</label>
                <select
                  disabled={mode === "view"}
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Firma Seçiniz</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName || c.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Başlangıç Tarihi</label>
                <input
                  type="date"
                  disabled={mode === "view"}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label>Bitiş Tarihi</label>
                <input
                  type="date"
                  disabled={mode === "view"}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label>Sözleşme Durumu</label>
                <select
                  disabled={mode === "view"}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="PASSIVE">Pasif</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Açıklama</label>
                <textarea
                  disabled={mode === "view"}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label>Dosya</label>

                <label className="fileInputWrap" style={{ opacity: mode === "view" ? 0.6 : 1 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    disabled={mode === "view"}
                    onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <span className="fileBtn">Dosya Seç</span>
                  <span className="fileName">{newFile ? newFile.name : "Dosya seçilmedi"}</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Kapat
                </button>

                {mode !== "view" && (
                  <button type="button" className="btn-gradient" onClick={handleSubmit}>
                    {mode === "create" ? "Oluştur" : "Güncelle"}
                  </button>
                )}
              </div>
            </div>

            {/* ✅ küçük css'i buraya koydum; projende global css'e de taşıyabilirsin */}
            <style jsx>{`
              .fileInputWrap {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border: 1px solid #eee;
                border-radius: 12px;
                background: #fff;
              }
              .fileInputWrap input[type="file"] {
                display: none;
              }
              .fileBtn {
                padding: 8px 12px;
                border-radius: 10px;
                background: #f3f4f6;
                cursor: pointer;
                user-select: none;
                border: 1px solid #eee;
                font-size: 13px;
              }
              .fileName {
                font-size: 13px;
                color: #6b7280;
              }
            `}</style>
          </div>
        )}
      </div>
    </>
  );
}
