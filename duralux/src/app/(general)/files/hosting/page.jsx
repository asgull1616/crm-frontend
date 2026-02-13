"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function HostingPage() {
  const [hostings, setHostings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Şifre toggle kart bazlı
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    ip: "",
    domain: "",
    dbPassword: "",
  });

  const [loading, setLoading] = useState(false);

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
    name: x.title ?? x.name ?? "", // backend'de "title" kullanıyoruz
    provider: x.provider ?? "",
    ip: x.ip ?? "",
    domain: x.domain ?? "",
    dbPassword: x.dbPassword ?? "",
    note: x.note ?? null,
    status: x.status ?? "ACTIVE",
    createdAt: x.createdAt ?? null,
  });

  // ✅ 1) LIST (sayfa açılınca çek)
  useEffect(() => {
    const fetchHostings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/files/hosting?page=1&limit=50`, {
          method: "GET",
          headers: authHeaders,
        });

        if (!res.ok) {
          console.error("Hosting list failed:", res.status);
          return;
        }

        const json = await res.json();
        const items = (json?.data || []).map(toUiItem);
        setHostings(items);
      } catch (e) {
        console.error("Hosting list error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHostings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      provider: "",
      ip: "",
      domain: "",
      dbPassword: "",
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name ?? "",
      provider: item.provider ?? "",
      ip: item.ip ?? "",
      domain: item.domain ?? "",
      dbPassword: item.dbPassword ?? "",
    });
    setIsOpen(true);
  };

  // ✅ 2) CREATE / UPDATE (Kaydet)
  const handleSave = async () => {
    if (!formData.name) return;

    // Backend DTO field isimleri:
    // title, provider, ip, domain, dbPassword, note?, status?
    const payload = {
      title: formData.name,
      provider: formData.provider || null,
      ip: formData.ip || null,
      domain: formData.domain || null,
      dbPassword: formData.dbPassword || null,
      status: "ACTIVE",
    };

    // optimistic UI (bozmadan)
    if (editingId) {
      const prev = hostings;
      setHostings((p) =>
        p.map((h) => (h.id === editingId ? { ...h, ...formData, name: formData.name } : h))
      );

      try {
        const res = await fetch(`${API_BASE}/api/files/hosting/${editingId}`, {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error("Hosting update failed:", res.status);
          setHostings(prev); // rollback
          return;
        }
      } catch (e) {
        console.error("Hosting update error:", e);
        setHostings(prev); // rollback
        return;
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/api/files/hosting`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error("Hosting create failed:", res.status);
          return;
        }

        const created = await res.json();
        const uiItem = toUiItem(created);
        setHostings((prev) => [...prev, uiItem]);
      } catch (e) {
        console.error("Hosting create error:", e);
        return;
      }
    }

    setIsOpen(false);
  };

  // ✅ 3) DELETE
  const handleDelete = async (id) => {
    const prev = hostings;
    setHostings((p) => p.filter((h) => h.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/files/hosting/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.error("Hosting delete failed:", res.status);
        setHostings(prev);
      }
    } catch (e) {
      console.error("Hosting delete error:", e);
      setHostings(prev);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="hosting-wrapper">
      {/* HEADER */}
      <div className="contracts-header">
        <div>
          <h2>Hosting Bilgileri</h2>
          <p>Sunucu ve domain yapılandırmaları</p>
        </div>

        <button className="btn-gradient" onClick={openCreate}>
          + Hosting Ekle
        </button>
      </div>

      {loading && <p style={{ marginTop: 10 }}>Yükleniyor...</p>}

      {/* GRID */}
      <div className="hosting-grid">
        {hostings.map((item) => (
          <div key={item.id} className="hosting-card">
            <button className="hosting-delete" onClick={() => handleDelete(item.id)}>
              ✕
            </button>

            <h3 className="hosting-title">{item.name}</h3>

            <div className="hosting-item">
              <span>Sunucu</span>
              <div>
                {item.provider}
                <button onClick={() => handleCopy(item.provider)}>Kopyala</button>
              </div>
            </div>

            <div className="hosting-item">
              <span>IP</span>
              <div>
                {item.ip}
                <button onClick={() => handleCopy(item.ip)}>Kopyala</button>
              </div>
            </div>

            <div className="hosting-item">
              <span>Domain</span>
              <div>
                {item.domain}
                <button onClick={() => handleCopy(item.domain)}>Kopyala</button>
              </div>
            </div>

            <div className="hosting-item">
              <span>DB Şifre</span>
              <div>
                {visiblePasswords[item.id] ? item.dbPassword : "••••••••••"}
                <button onClick={() => togglePassword(item.id)}>
                  {visiblePasswords[item.id] ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button className="btn-soft" onClick={() => openEdit(item)}>
                Düzenle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editingId ? "Hosting Güncelle" : "Yeni Hosting Ekle"}</h3>

            <div className="modal-field">
              <label>Hosting Adı</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="modal-field">
              <label>Sunucu</label>
              <input
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </div>

            <div className="modal-field">
              <label>IP</label>
              <input
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              />
            </div>

            <div className="modal-field">
              <label>Domain</label>
              <input
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>

            <div className="modal-field">
              <label>DB Şifre</label>
              <input
                value={formData.dbPassword}
                onChange={(e) => setFormData({ ...formData, dbPassword: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>İptal</button>
              <button className="btn-gradient" onClick={handleSave}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}