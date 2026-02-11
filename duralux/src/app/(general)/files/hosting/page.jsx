"use client";

import { useState } from "react";

export default function HostingPage() {

  const [hostings, setHostings] = useState([
    {
      id: 1,
      name: "Codyol Production",
      provider: "DigitalOcean",
      ip: "192.168.1.1",
      domain: "codyol.com",
      dbPassword: "superSecret123"
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Şifre toggle kart bazlı
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    ip: "",
    domain: "",
    dbPassword: ""
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      provider: "",
      ip: "",
      domain: "",
      dbPassword: ""
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setHostings(prev =>
        prev.map(h =>
          h.id === editingId ? { ...formData, id: editingId } : h
        )
      );
    } else {
      const newHosting = {
        ...formData,
        id: Date.now()
      };
      setHostings(prev => [...prev, newHosting]);
    }

    setIsOpen(false);
  };

  const handleDelete = (id) => {
    setHostings(prev => prev.filter(h => h.id !== id));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
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

      {/* GRID */}
      <div className="hosting-grid">
        {hostings.map(item => (
          <div key={item.id} className="hosting-card">

            <button
              className="hosting-delete"
              onClick={() => handleDelete(item.id)}
            >
              ✕
            </button>

            <h3 className="hosting-title">{item.name}</h3>

            <div className="hosting-item">
              <span>Sunucu</span>
              <div>
                {item.provider}
                <button onClick={() => handleCopy(item.provider)}>
                  Kopyala
                </button>
              </div>
            </div>

            <div className="hosting-item">
              <span>IP</span>
              <div>
                {item.ip}
                <button onClick={() => handleCopy(item.ip)}>
                  Kopyala
                </button>
              </div>
            </div>

            <div className="hosting-item">
              <span>Domain</span>
              <div>
                {item.domain}
                <button onClick={() => handleCopy(item.domain)}>
                  Kopyala
                </button>
              </div>
            </div>

            <div className="hosting-item">
              <span>DB Şifre</span>
              <div>
                {visiblePasswords[item.id]
                  ? item.dbPassword
                  : "••••••••••"}
                <button onClick={() => togglePassword(item.id)}>
                  {visiblePasswords[item.id] ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                className="btn-soft"
                onClick={() => openEdit(item)}
              >
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

            <h3>
              {editingId
                ? "Hosting Güncelle"
                : "Yeni Hosting Ekle"}
            </h3>

            <div className="modal-field">
              <label>Hosting Adı</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-field">
              <label>Sunucu</label>
              <input
                value={formData.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provider: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-field">
              <label>IP</label>
              <input
                value={formData.ip}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ip: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-field">
              <label>Domain</label>
              <input
                value={formData.domain}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    domain: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-field">
              <label>DB Şifre</label>
              <input
                value={formData.dbPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dbPassword: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>
                İptal
              </button>
              <button
                className="btn-gradient"
                onClick={handleSave}
              >
                Kaydet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
