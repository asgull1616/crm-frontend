"use client";

export default function ContractCard({
  item,
  onOpenView,
  onOpenEdit,
  onDelete,
}) {
  return (
    <div className="contract-card">
      <div className="card-top">
        <div className="card-icon">📄</div>
        <div className="status-badge">{item.status}</div>
      </div>

      <div className="card-body">
        <h3>{item.title}</h3>
        <span>{item.date}</span>
      </div>

      <div className="card-footer actions-grid">
        <button className="btn-soft" onClick={() => onOpenView(item)}>
          Görüntüle
        </button>

        <button className="btn-soft" onClick={() => onOpenEdit(item)}>
          Düzenle
        </button>

        <button
          className="btn-danger-soft"
          onClick={() => {
            if (confirm("Bu sözleşmeyi silmek istediğinize emin misiniz?")) {
              onDelete(item.id);
            }
          }}
        >
          Sil
        </button>

        {item.fileUrl ? (
          <button
            className="btn-soft"
            onClick={() => window.open(item.fileUrl, "_blank")}
          >
            Dosyayı Aç
          </button>
        ) : (
          <button className="btn-soft" disabled>
            Dosya Yok
          </button>
        )}
      </div>
    </div>
  );
}
