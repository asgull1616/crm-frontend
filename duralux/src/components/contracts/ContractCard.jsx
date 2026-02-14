"use client";

import { API_BASE } from "@/components/contracts/contracts.helpers";

export default function ContractCard({ item, onView, onEdit, onDelete }) {
  return (
    <div className="contract-card">
      <style jsx>{`
        .card-footer {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          align-items: stretch;
        }

        /* ✅ grid item taşma fix */
        .card-footer :global(button) {
          width: 100%;
          min-width: 0;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      <div className="card-top">
        <div className="card-icon">📄</div>
        <div className="status-badge">{item.status}</div>
      </div>

      <div className="card-body">
        <h3>{item.title}</h3>
        <span>{item.date}</span>
      </div>

      <div className="card-footer">
        <button className="btn-soft" onClick={onView}>
          Görüntüle
        </button>

        <button className="btn-soft" onClick={onEdit}>
          Düzenle
        </button>

        <button className="btn-danger-soft" onClick={onDelete}>
          Sil
        </button>

        {item.fileUrl ? (
          <button
            className="btn-soft"
            onClick={() =>
              window.open(
                item.fileUrl.startsWith("http") ? item.fileUrl : `${API_BASE}${item.fileUrl}`,
                "_blank"
              )
            }
          >
            Dosyayı Aç
          </button>
        ) : (
          <button className="btn-soft" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Dosya Yok
          </button>
        )}
      </div>
    </div>
  );
}
