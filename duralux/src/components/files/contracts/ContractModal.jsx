"use client";

export default function ContractModal({
  isOpen,
  onClose,
  mode,
  customers,
  formData,
  setFormData,
  onSubmit,
  fileInputRef,
}) {
  if (!isOpen) return null;

  const isView = mode === "view";

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
          <input
            disabled={isView}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="modal-field">
          <label>Firma Adı</label>
          <select
            disabled={isView}
            value={formData.customerId}
            onChange={(e) =>
              setFormData({ ...formData, customerId: e.target.value })
            }
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
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Başlangıç</label>
              <input
                type="date"
                disabled={isView}
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Bitiş</label>
              <input
                type="date"
                disabled={isView}
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="modal-field">
          <label>Sözleşme Durumu</label>
          <select
            disabled={isView}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="ACTIVE">Aktif</option>
            <option value="PASSIVE">Pasif</option>
          </select>
        </div>

        <div className="modal-field">
          <label>Açıklama</label>
          <textarea
            disabled={isView}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="modal-field">
          <label>Dosya</label>
          <div className="fileRow" style={{ opacity: isView ? 0.6 : 1 }}>
            <label className="fileInputWrap">
              <input
                ref={fileInputRef}
                type="file"
                disabled={isView}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files?.[0] || null,
                  })
                }
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <span className="fileBtn">Dosya Seç</span>
              <span className="fileName">
                {formData.file
                  ? formData.file.name
                  : formData.existingFileName || "Dosya seçilmedi"}
              </span>
            </label>
            {formData.existingFileUrl && !formData.file && (
              <button
                type="button"
                className="fileOpenBtn"
                onClick={() => window.open(formData.existingFileUrl, "_blank")}
              >
                Aç
              </button>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            İptal
          </button>
          {!isView && (
            <button type="button" className="btn-gradient" onClick={onSubmit}>
              {mode === "create" ? "Oluştur" : "Güncelle"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
