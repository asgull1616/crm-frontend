"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { licenseService } from "@/lib/services/license.service";

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= UI MAP ================= */

  const toUiItem = (x) => {
    if (!x || !x.endDate) return null;

    const today = new Date();
    const end = new Date(x.endDate);

    const diffDays = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    let status = "ACTIVE";
    if (diffDays < 0) status = "EXPIRED";
    else if (diffDays <= 30) status = "SOON";

    return {
      id: x.id,
      name: x.title,
      provider: x.provider,
      start: x.startDate
        ? new Date(x.startDate).toLocaleDateString("tr-TR")
        : "-",
      end: x.endDate ? new Date(x.endDate).toLocaleDateString("tr-TR") : "-",
      status,
      remainingDays: diffDays,
    };
  };

  /* ================= LIST ================= */

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        const res = await licenseService.list(1, 50);

        const items = (res?.data || []).map(toUiItem).filter(Boolean);

        setLicenses(items);
      } catch (e) {
        console.error("License list error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const prev = licenses;
    setLicenses((p) => p.filter((l) => l.id !== id));

    try {
      await licenseService.delete(id);
    } catch (e) {
      console.error("Delete error:", e);
      setLicenses(prev);
    }
  };

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    if (!newName || !newProvider || !newStart || !newEnd) return;

    try {
      const created = await licenseService.create({
        title: newName,
        provider: newProvider,
        startDate: newStart,
        endDate: newEnd,
        status: "ACTIVE",
      });

      setLicenses((prev) => [...prev, toUiItem(created)]);

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
    <>
      <PageHeader />
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
            <div key={item.id} className={`license-card ${item.status}`}>
              <button
                className="license-delete"
                onClick={() => handleDelete(item.id)}
              >
                ✕
              </button>

              <div className="license-top">
                <div className="license-icon">🔐</div>

                <div className={`license-badge ${item.status}`}>
                  {item.status === "ACTIVE" && "Aktif"}
                  {item.status === "SOON" && "Yaklaşıyor"}
                  {item.status === "EXPIRED" && "Süresi Doldu"}
                </div>
              </div>

              <div className="license-body">
                <h3>{item.name}</h3>
                <p>{item.provider}</p>

                <div className="license-dates">
                  <span>Başlangıç: {item.start}</span>
                  <span>Bitiş: {item.end}</span>
                </div>

                {item.status !== "EXPIRED" && (
                  <div className="license-remaining">
                    {item.remainingDays} gün kaldı
                  </div>
                )}
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
    </>
  );
}
