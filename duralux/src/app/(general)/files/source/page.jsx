"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// UI type -> API type (backend enum farklıysa burayı değiştirirsin)
const toApiType = (uiType) => {
  // Eğer backend enum "FRONTEND/BACKEND/LIVE" ise:
  if (uiType === "Frontend") return "FRONTEND";
  if (uiType === "Backend") return "BACKEND";
  if (uiType === "Live") return "LIVE";
  return "OTHER";
};

// API type -> UI type
const toUiType = (apiType) => {
  if (apiType === "FRONTEND") return "Frontend";
  if (apiType === "BACKEND") return "Backend";
  if (apiType === "LIVE") return "Live";
  // bazı backend’lerde "GITHUB" gibi gelebilir → UI’da GitHub diye görünmesin istemiyorsan burayı düzenleriz
  return apiType || "Frontend";
};

export default function SourceLinksPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("Frontend");

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }, []);

  const authHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  // Backend -> UI map
  const toUiItem = (x) => ({
    id: x.id,
    title: x.title,
    url: x.url,
    type: toUiType(x.type),
  });

  // ✅ LIST
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/files/source-links?page=1&limit=50`,
          {
            method: "GET",
            headers: authHeaders,
          }
        );

        if (!res.ok) {
          console.error("Source links list failed:", res.status);
          return;
        }

        const json = await res.json();
        const items = (json?.data || []).map(toUiItem);
        setLinks(items);
      } catch (e) {
        console.error("Source links list error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders]);

  const handleDelete = async (id) => {
    const prev = links;
    setLinks((p) => p.filter((l) => l.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/files/source-links/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.error("Delete failed:", res.status);
        setLinks(prev);
      }
    } catch (e) {
      console.error("Delete error:", e);
      setLinks(prev);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handleCreate = async () => {
    if (!newTitle || !newUrl) return;

    try {
      const res = await fetch(`${API_BASE}/api/files/source-links`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: newTitle,
          url: newUrl,
          type: toApiType(newType),
        }),
      });

      if (!res.ok) {
        console.error("Create failed:", res.status);
        return;
      }

      const created = await res.json();
      const uiItem = toUiItem(created);

      setLinks((prev) => [...prev, uiItem]);

      setNewTitle("");
      setNewUrl("");
      setNewType("Frontend");
      setIsOpen(false);
    } catch (e) {
      console.error("Create error:", e);
    }
  };

  return (  <><PageHeader />
    <div className="source-wrapper">
      <div className="contracts-header">
        <div>
          <h2>Kaynak Kod Linkleri</h2>
          <p>Frontend, backend ve canlı site bağlantıları</p>
        </div>
        <button className="btn-gradient" onClick={() => setIsOpen(true)}>
          + Yeni Link
        </button>
      </div>

      {loading && <p style={{ marginTop: 10 }}>Yükleniyor...</p>}

      <div className="source-grid">
        {links.map((item) => (
          <div key={item.id} className="source-card">
            <button className="source-delete" onClick={() => handleDelete(item.id)}>
              <span>✕</span>
            </button>

            <div className="source-top">
              <div className="source-icon">🔗</div>
              <div className={`source-badge ${item.type}`}>{item.type}</div>
            </div>

            <div className="source-body">
              <h3>{item.title}</h3>
              <p>{item.url}</p>
            </div>

            <div className="source-footer">
              <button className="btn-soft" onClick={() => handleCopy(item.url)}>
                Kopyala
              </button>

              <a href={item.url} target="_blank" className="btn-gradient" rel="noreferrer">
                Git
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Yeni Link Ekle</h3>

            <div className="modal-field">
              <label>Link Başlığı</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>URL</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Tip</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Live">Canlı</option>
              </select>
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
    </div></>
  );
}