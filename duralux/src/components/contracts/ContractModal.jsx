"use client";

export default function ContractModal({
  mode,
  customers,
  values,
  setters,
  fileRef,
  onClose,
  onSubmit,
}) {
  const { newTitle, newDesc, newFile, selectedCustomer, startDate, endDate, status } = values;

  const {
    setNewTitle,
    setNewDesc,
    setNewFile,
    setSelectedCustomer,
    setStartDate,
    setEndDate,
    setStatus,
  } = setters;

  return (
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
          <input disabled={mode === "view"} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
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
          <input type="date" disabled={mode === "view"} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Bitiş Tarihi</label>
          <input type="date" disabled={mode === "view"} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Sözleşme Durumu</label>
          <select disabled={mode === "view"} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
          </select>
        </div>

        <div className="modal-field">
          <label>Açıklama</label>
          <textarea disabled={mode === "view"} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
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
          <button onClick={onClose}>Kapat</button>

          {mode !== "view" && (
            <button className="btn-gradient" onClick={onSubmit}>
              {mode === "create" ? "Oluştur" : "Güncelle"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
