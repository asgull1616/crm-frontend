"use client";

import { useState } from "react";

export default function ContractsPage() {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      title: "Hizmet Sözleşmesi",
      date: "12.02.2026",
      status: "AKTİF",
    },
    {
      id: 2,
      title: "Gizlilik Anlaşması",
      date: "05.11.2025",
      status: "AKTİF",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleDelete = (id) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;

    const newContract = {
      id: Date.now(),
      title: newTitle,
      date: new Date().toLocaleDateString("tr-TR"),
      status: "AKTİF",
    };

    setContracts((prev) => [...prev, newContract]);
    setNewTitle("");
    setIsOpen(false);
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
              <button className="btn-soft">İndir</button>
              <button
                className="btn-danger-soft"
                onClick={() => handleDelete(item.id)}
              >
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
        <textarea placeholder="Sözleşme hakkında kısa açıklama..." />
      </div>

      <div className="modal-field">
        <label>Dosya Yükle</label>
        <input type="file" />
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
