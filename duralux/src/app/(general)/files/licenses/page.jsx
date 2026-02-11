"use client";

import { useState } from "react";

export default function LicensesPage() {

  const [licenses, setLicenses] = useState([
    {
      id: 1,
      name: "SSL Sertifikası",
      provider: "Let's Encrypt",
      start: "01.01.2026",
      end: "01.01.2027",
      status: "Aktif"
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const handleDelete = (id) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
  };

  const calculateStatus = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    if (end < today) return "Süresi Doldu";

    const diffDays = (end - today) / (1000 * 60 * 60 * 24);
    if (diffDays < 30) return "Yaklaşıyor";

    return "Aktif";
  };

  const handleCreate = () => {
    if (!newName || !newProvider || !newStart || !newEnd) return;

    const status = calculateStatus(newEnd);

    const newLicense = {
      id: Date.now(),
      name: newName,
      provider: newProvider,
      start: newStart,
      end: newEnd,
      status
    };

    setLicenses(prev => [...prev, newLicense]);

    setNewName("");
    setNewProvider("");
    setNewStart("");
    setNewEnd("");
    setIsOpen(false);
  };

  return (
    <div className="licenses-wrapper">

      {/* HEADER */}
      <div className="contracts-header">
        <div>
          <h2>Lisanslar</h2>
          <p>Domain, SSL ve yazılım lisans bilgileri</p>
        </div>

        <button className="btn-gradient" onClick={() => setIsOpen(true)}>
          + Yeni Lisans
        </button>
      </div>

      {/* GRID */}
      <div className="licenses-grid">
        {licenses.map(item => (
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

      {/* MODAL */}
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
              <button onClick={() => setIsOpen(false)}>
                İptal
              </button>

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
