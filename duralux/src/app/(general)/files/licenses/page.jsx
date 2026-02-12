"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

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
  const toUiItem = (x) => {
    const today = new Date();
    const end = new Date(x.endDate);

    let status = "Aktif";
    if (end < today) status = "Süresi Doldu";
    else if ((end - today) / (1000 * 60 * 60 * 24) < 30)
      status = "Yaklaşıyor";

    return {
      id: x.id,
      name: x.title,
      provider: x.provider,
      start: new Date(x.startDate).toLocaleDateString("tr-TR"),
      end: new Date(x.endDate).toLocaleDateString("tr-TR"),
      status,
    };
  };

  // ✅ LIST
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/files/licenses?page=1&limit=50`,
          {
            method: "GET",
            headers: authHeaders,
          }
        );

        if (!res.ok) {
          console.error("License list failed:", res.status);
          return;
        }

        const json = await res.json();
        const items = (json?.data || []).map(toUiItem);
        setLicenses(items);
      } catch (e) {
        console.error("License list error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders]);

  // ✅ DELETE
  const handleDelete = async (id) => {
    const prev = licenses;
    setLicenses((p) => p.filter((l) => l.id !== id));

    try {
      const res = await fetch(
        `${API_BASE}/api/files/licenses/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) {
        console.error("Delete failed:", res.status);
        setLicenses(prev);
      }
    } catch (e) {
      console.error("Delete error:", e);
      setLicenses(prev);
    }
  };

  // ✅ CREATE
  const handleCreate = async () => {
    if (!newName || !newProvider || !newStart || !newEnd) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/files/licenses`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            title: newName,
            provider: newProvider,
            startDate: newStart,
            endDate: newEnd,
            status: "ACTIVE",
          }),
        }
      );

      if (!res.ok) {
        console.error("Create failed:", res.status);
        return;
      }

      const created = await res.json();
      const uiItem = toUiItem(created);

      setLicenses((prev) => [...prev, uiItem]);

      setNewName("");
      setNewProvider("");
      setNewStart("");
      setNewEnd("");
      setIsOpen(false);
    } catch (e) {
      console.error("Create error:", e);
    }
  };

  return (
    <div className="licenses-wrapper">
      <div className="contracts-header">
        <div>
          <h2>Lisanslar</h2>
          <p>Domain, SSL ve yazılım lisans bilgileri</p>
        </div>

        <button className="btn-gradient" onClick={() => setIsOpen(true)}>
          + Yeni Lisans
        </button>
      </div>

      {loading && <p style={{ marginTop: 10 }}>Yükleniyor...</p>}

      <div className="licenses-grid">
        {licenses.map((item) => (
          <div key={item.id} className="license-card">
            <button
              className="license-delete"
              onClick={() => handleDelete(item.id)}
            >
              ✕
            </button>

            <div className="license-top">
              <div className="license-icon">🔐</div>
              <div className={`license-badge ${item.status}`}>
                {item.status}
              </div>
            </div>

            <div className="license-body">
              <h3>{item.name}</h3>
              <p>{item.provider}</p>

              <div className="license-dates">
                <span>Başlangıç: {item.start}</span>
                <span>Bitiş: {item.end}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Yeni Lisans Ekle</h3>

            <div className="modal-field">
              <label>Lisans Adı</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Sağlayıcı</label>
              <input
                type="text"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Başlangıç Tarihi</label>
              <input
                type="date"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Bitiş Tarihi</label>
              <input
                type="date"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
              />
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