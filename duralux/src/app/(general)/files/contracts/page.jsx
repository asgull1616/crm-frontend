"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";

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

  const [mode, setMode] = useState("create"); // create | view | edit
  const [selectedId, setSelectedId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  // ✅ fileRef tanımlı olmalı
  const fileRef = useRef(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }, []);

  // JSON istekleri (GET liste vb)
  const authHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  // FormData istekleri (POST/PATCH file upload) -> Content-Type koyma!
  const authOnlyHeaders = useMemo(() => {
    const h = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  /* ================= LIST ================= */

  const fetchContracts = useCallback(async () => {
    setLoading(true);

    // ✅ cache bust + no-store (304/cache yüzünden eski data gelmesin)
    const url = `${API_BASE}/api/files/contracts?page=1&limit=50&_t=${Date.now()}`;

    const res = await fetch(url, {
      headers: authHeaders,
      cache: "no-store",
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
    } else {
      console.error("fetchContracts failed:", res.status);
    }

    setLoading(false);
  }, [authHeaders]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  /* ================= CUSTOMERS ================= */

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch(`${API_BASE}/api/customers?_t=${Date.now()}`, {
        headers: authHeaders,
        cache: "no-store",
      });

      if (!res.ok) return;

      const json = await res.json();
      setCustomers(json?.data || []);
    };

    fetchCustomers();
  }, [authHeaders]);

  /* ================= DETAIL ================= */

  const fetchDetail = async (id) => {
    const res = await fetch(`${API_BASE}/api/files/contracts/${id}?_t=${Date.now()}`, {
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json;
  };

  const fillForm = (data) => {
    setNewTitle(data.title || "");
    setNewDesc(data.description || "");
    setSelectedCustomer(data.customerId || data.customer?.id || "");
    setStartDate(data.startDate?.slice(0, 10) || "");
    setEndDate(data.endDate?.slice(0, 10) || "");
    setStatus(data.status || "ACTIVE");
    setNewFile(null);

    // ✅ file input'u temizle (aynı dosyayı tekrar seçebilmek için)
    if (fileRef.current) fileRef.current.value = "";
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

    if (fileRef.current) fileRef.current.value = "";
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
    // backend enum: ACTIVE / INACTIVE
    const normalizedStatus = status === "ACTIVE" ? "ACTIVE" : "INACTIVE";

    const fd = new FormData();
    fd.append("title", newTitle);
    fd.append("status", normalizedStatus);

    if (newDesc) fd.append("description", newDesc);
    if (selectedCustomer) fd.append("customerId", selectedCustomer);
    if (startDate) fd.append("startDate", startDate);
    if (endDate) fd.append("endDate", endDate);

    // ✅ state null kalsa bile ref'ten dosyayı al
    const fileToSend = newFile || fileRef.current?.files?.[0];
    if (fileToSend) fd.append("file", fileToSend);

    let res;

    if (mode === "create") {
      res = await fetch(`${API_BASE}/api/files/contracts`, {
        method: "POST",
        headers: authOnlyHeaders,
        body: fd,
      });
    }

    if (mode === "edit" && selectedId) {
      res = await fetch(`${API_BASE}/api/files/contracts/${selectedId}`, {
        method: "PATCH",
        headers: authOnlyHeaders,
        body: fd,
      });
    }

    // ✅ hata varsa sessiz geçme
    if (!res || !res.ok) {
      const txt = res ? await res.text().catch(() => "") : "";
      console.error("save failed:", res?.status, txt);
      alert(`Kaydetme başarısız! (${res?.status || "no response"})`);
      return;
    }

    // ✅ UI’yı anında güncelle (cache olsa bile görünsün)
    if (mode === "edit" && selectedId) {
      setContracts((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, title: newTitle } : c))
      );
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
      alert("Silme başarısız!");
      return;
    }

    await fetchContracts();
  };

  /* ================= RENDER ================= */

  return (
    <div className="contracts-wrapper">
      {/* ✅ sadece bu sayfaya özel layout fix */}
      <style jsx>{`
        .contract-card .card-footer {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          align-items: stretch;
        }
        .contract-card .card-footer .btn-soft,
        .contract-card .card-footer .btn-danger-soft {
          width: 100%;
          justify-content: center;
        }
        .contract-card .card-body h3 {
          word-break: break-word;
        }
      `}</style>

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
                <option value="INACTIVE">Pasif</option>
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
              <input
                ref={fileRef}
                type="file"
                disabled={mode === "view"}
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />

              {newFile && (
                <div style={{ fontSize: 12, marginTop: 6 }}>
                  Seçilen dosya: <b>{newFile.name}</b> ({Math.round(newFile.size / 1024)} KB)
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
              >
                Kapat
              </button>

              {mode !== "view" && (
                <button className="btn-gradient" onClick={handleSubmit}>
                  {mode === "create" ? "Oluştur" : "Güncelle"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
