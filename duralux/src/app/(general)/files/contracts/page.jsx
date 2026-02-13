"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Backend status -> UI status
const toUiStatus = (s) => (s === "ACTIVE" ? "AKTİF" : "PASİF");

// UI status -> Backend status
const toApiStatus = (s) => (s === "AKTİF" ? "ACTIVE" : "PASSIVE");

// Backend date -> "tr-TR" string
const formatTrDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("tr-TR");
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Modal fields (UI bozmayalım diye ekledik)
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken"); // sende farklı key ise değiştir
  }, []);

  const authHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  // ✅ 1) LIST: sayfa açılınca backend’den çek
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/files/contracts?page=1&limit=50`, {
          method: "GET",
          headers: authHeaders,
        });

        if (!res.ok) {
          console.error("Contracts list failed:", res.status);
          setLoading(false);
          return;
        }

        const json = await res.json();

        // Bizim backend list response: { meta, data }
        const items = (json?.data || []).map((x) => ({
          id: x.id,
          title: x.title,
          date: formatTrDate(x.createdAt),
          status: toUiStatus(x.status),
          fileUrl: x.fileUrl, // indir için
          description: x.description ?? null,
        }));

        setContracts(items);
      } catch (e) {
        console.error("Contracts list error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders]);

  // ✅ 2) DELETE
  const handleDelete = async (id) => {
    // UI bozmadan optimistic sil
    const prev = contracts;
    setContracts((p) => p.filter((c) => c.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/files/contracts/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.error("Delete failed:", res.status);
        setContracts(prev); // geri al
      }
    } catch (e) {
      console.error("Delete error:", e);
      setContracts(prev); // geri al
    }
  };

  // ✅ 3) CREATE
  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    // Şu an backend ContractFile create dto: title, fileUrl, status
    // Frontta file upload var ama backend’te upload endpoint yok. Şimdilik fileUrl zorunlu.
    // Upload’u sonraki adımda (multer/s3) ekleyeceğiz.
    const fileUrl = newFile ? newFile.name : ""; // şimdilik placeholder
    // 👉 Eğer backend fileUrl required ise boş gönderme: aşağıdaki satırı değiştir.
    const safeFileUrl = fileUrl || "https://example.com/placeholder.pdf";

    try {
      const res = await fetch(`${API_BASE}/api/files/contracts`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: newTitle,
          fileUrl: safeFileUrl,
          status: "ACTIVE",
          // description backend’de yoksa ignored olur (istersen schema/service’e ekleriz)
          description: newDesc || undefined,
        }),
      });

      if (!res.ok) {
        console.error("Create failed:", res.status);
        return;
      }

      const created = await res.json();

      const newItem = {
        id: created.id,
        title: created.title,
        date: formatTrDate(created.createdAt),
        status: toUiStatus(created.status),
        fileUrl: created.fileUrl,
        description: created.description ?? null,
      };

      setContracts((prev) => [...prev, newItem]);
      setNewTitle("");
      setNewDesc("");
      setNewFile(null);
      setIsOpen(false);
    } catch (e) {
      console.error("Create error:", e);
    }
  };

  // ✅ 4) DOWNLOAD (indir)
  const handleDownload = (item) => {
    if (!item.fileUrl) return;
    // yeni sekmede aç
    window.open(item.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="contracts-wrapper">
      {/* HEADER */}
      <div className="contracts-header">
        <div>
          <h2>Sözleşmeler</h2>
          <p>Proje ile ilgili hukuki belgeler</p>
        </div>
        <button className="btn-gradient" onClick={() => setIsOpen(true)}>
          + Yeni Dosya
        </button>
      </div>

      {/* küçük bilgi (UI bozmadan) */}
      {loading && <p style={{ marginTop: 10 }}>Yükleniyor...</p>}

      {/* GRID */}
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
              <button className="btn-soft" onClick={() => handleDownload(item)}>
                İndir
              </button>
              <button className="btn-danger-soft" onClick={() => handleDelete(item.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Yeni Sözleşme Oluştur</h3>

            <div className="modal-field">
              <label>Sözleşme Adı</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Örn: Hizmet Sözleşmesi"
              />
            </div>

            <div className="modal-field">
              <label>Açıklama</label>
              <textarea
                placeholder="Sözleşme hakkında kısa açıklama..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Dosya Yükle</label>
              <input
                type="file"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />
              {/* Not: gerçek upload endpoint yoksa fileUrl üretilemez. */}
            </div>

            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>İptal</button>
              <button className="btn-gradient" onClick={handleCreate}>
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}