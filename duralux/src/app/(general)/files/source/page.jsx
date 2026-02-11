"use client";

import { useState } from "react";

export default function SourceLinksPage() {

  const [isOpen, setIsOpen] = useState(false);

  const [links, setLinks] = useState([
    {
      id: 1,
      title: "Frontend Repo",
      url: "https://github.com/codyol/frontend",
      type: "GitHub",
    },
    {
      id: 2,
      title: "Backend Repo",
      url: "https://github.com/codyol/backend",
      type: "GitHub",
    },
    {
      id: 3,
      title: "Canlı Site",
      url: "https://codyol.com",
      type: "Live",
    },
  ]);
const handleDelete = (id) => {
  setLinks((prev) => prev.filter((l) => l.id !== id));
};

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("Frontend");

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handleCreate = () => {
    if (!newTitle || !newUrl) return;

    const newLink = {
      id: Date.now(),
      title: newTitle,
      url: newUrl,
      type: newType,
    };

    setLinks((prev) => [...prev, newLink]);

    setNewTitle("");
    setNewUrl("");
    setNewType("Frontend");
    setIsOpen(false);
  };

  return (
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

      <div className="source-grid">
        {links.map((item) => (
          <div key={item.id} className="source-card">
   <button
    className="source-delete"
    onClick={() => handleDelete(item.id)}
  >
    <span>✕</span>
  </button>
            <div className="source-top">
              <div className="source-icon">🔗</div>
              <div className={`source-badge ${item.type}`}>
                {item.type}
              </div>
            </div>


            <div className="source-body">
              <h3>{item.title}</h3>
              <p>{item.url}</p>
            </div>

            <div className="source-footer">
              <button
                className="btn-soft"
                onClick={() => handleCopy(item.url)}
              >
                Kopyala
              </button>

              <a
                href={item.url}
                target="_blank"
                className="btn-gradient"
              >
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
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Live">Canlı</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>
                İptal
              </button>

              <button
                className="btn-gradient"
                onClick={handleCreate}
              >
                Oluştur
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
