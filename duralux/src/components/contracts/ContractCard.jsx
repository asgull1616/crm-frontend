"use client";

export default function ContractCard({ item, onView, onEdit, onDelete }) {
  const isActive = item.status === "AKTİF";

  // ✅ uploads linkini her zaman backend host ile tamamla
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050";

  const fileHref =
    item.fileUrl && item.fileUrl.startsWith("http")
      ? item.fileUrl
      : item.fileUrl
        ? `${API_BASE}${item.fileUrl}`
        : null;

  return (
    <div className="contract-card">
      <style jsx>{`
        .contract-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .contract-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-icon {
          font-size: 22px;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          background: ${isActive ? "#ef4444" : "#94a3b8"};
        }

        .card-body {
          margin-top: 14px;
        }

        .contract-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          word-break: break-word;
        }

        .card-date {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #334155;
        }

        .date-label,
        .date-value {
          font-weight: 600;
        }

        .card-footer {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

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
        <h3 className="contract-title">{item.title}</h3>

        <div className="card-date">
          <span className="date-label">📅 Oluşturulma Tarihi:</span>
          <span className="date-value">{item.date}</span>
        </div>
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

        {fileHref ? (
          <button
            className="btn-soft"
            onClick={() => window.open(fileHref, "_blank", "noopener,noreferrer")}
          >
            Dosyayı Aç
          </button>
        ) : (
          <button
            className="btn-soft"
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            Dosya Yok
          </button>
        )}
      </div>
    </div>
  );
}
