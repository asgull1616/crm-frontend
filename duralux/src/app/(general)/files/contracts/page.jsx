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

  // ✅ mevcut dosyayı edit/view modunda göstermek için
  const [existingFileName, setExistingFileName] = useState("");
  const [existingFileUrl, setExistingFileUrl] = useState("");

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
    return h;
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

    // ✅ mevcut dosya bilgisi (input'a basamayız, state'te gösteriyoruz)
    setExistingFileName(data.fileName || "");
    setExistingFileUrl(data.fileUrl || "");

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

    // ✅ mevcut dosya bilgisi reset
    setExistingFileName("");
    setExistingFileUrl("");

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
      if (newFile) formData.append("file", newFile);

      const res = await fetch(`${API_BASE}/api/files/contracts`, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
      });

      if (!res.ok) return alert("Dosya yükleme başarısız.");
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
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      });

      if (!res.ok) return alert("Güncelleme başarısız.");
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

    if (!res.ok) alert("Silme başarısız.");
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

              <div className="card-footer actions-grid">
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
                        item.fileUrl.startsWith("http")
                          ? item.fileUrl
                          : `${API_BASE}${item.fileUrl}`,
                        "_blank"
                      )
                    }
                  >
                    Dosyayı Aç
                  </button>
                ) : (
                  <button className="btn-soft" disabled>
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
                {mode === "create"
                  ? "Yeni Sözleşme"
                  : mode === "edit"
                    ? "Sözleşmeyi Düzenle"
                    : "Sözleşme Detayı"}
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

              {/* ✅ SADECE DOSYA ALANI GÜNCELLENDİ */}
              <div className="modal-field">
                <label>Dosya</label>

                <div className="fileRow" style={{ opacity: mode === "view" ? 0.6 : 1 }}>
                  <label className="fileInputWrap">
                    <input
                      ref={fileInputRef}
                      type="file"
                      disabled={mode === "view"}
                      onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <span className="fileBtn">Dosya Seç</span>
                    <span className="fileName">
                      {newFile
                        ? newFile.name
                        : existingFileName
                          ? `Mevcut dosya: ${existingFileName}`
                          : "Dosya seçilmedi"}
                    </span>
                  </label>

                  {!newFile && existingFileUrl && (
                    <button
                      type="button"
                      className="fileOpenBtn"
                      onClick={() =>
                        window.open(
                          existingFileUrl.startsWith("http")
                            ? existingFileUrl
                            : `${API_BASE}${existingFileUrl}`,
                          "_blank"
                        )
                      }
                    >
                      Dosyayı Aç
                    </button>
                  )}
                </div>
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
          </div>
        )}
      </div>

      {/* ✅ CSS kesin uygulansın diye global verdim */}
      <style jsx global>{`
        .actions-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
          padding-top: 14px !important;
          align-items: stretch !important;
        }

        .actions-grid button {
          width: 100% !important;
          min-height: 46px !important;
          border-radius: 16px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        @media (max-width: 520px) {
          .actions-grid {
            grid-template-columns: 1fr !important;
          }
        }

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
          white-space: nowrap;
        }
        .fileName {
          font-size: 13px;
          color: #6b7280;
        }

        /* ✅ yeni eklenenler */
        .fileRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fileOpenBtn {
          height: 42px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid #eee;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          white-space: nowrap;
        }
        .fileOpenBtn:hover {
          background: #f7f7f7;
        }

        /* =========================================================
           ✅ SADECE SÖZLEŞME KARTI BOYUTU KÜÇÜLTME (KOD BOZULMADAN)
        ========================================================= */
        .contract-card {
          padding: 12px !important;
          border-radius: 14px !important;
          gap: 8px !important;
          min-height: unset !important;
        }

        .card-icon {
          width: 34px !important;
          height: 34px !important;
          font-size: 16px !important;
          border-radius: 10px !important;
        }

        .card-body h3 {
          font-size: 15px !important;
        }

        .card-body span {
          font-size: 11px !important;
        }

        .status-badge {
          font-size: 10px !important;
          padding: 3px 8px !important;
        }

        /* aynı class'ı küçültme amaçlı override ediyoruz */
        .actions-grid {
          gap: 6px !important;
          padding-top: 6px !important;
        }

        .actions-grid button {
          min-height: 34px !important;
          font-size: 11px !important;
          border-radius: 10px !important;
        }
      `}</style>
    </>
  );
}
