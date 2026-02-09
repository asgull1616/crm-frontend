'use client';

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('tr-TR');
};

const PendingLeaveRequests = ({ leaves = [], onApprove, onReject }) => {
  if (leaves.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          Bekleyen izin talebi yok 🎉
        </div>
      </div>
    );
  }

  return (

    <div className="card">
      <div className="card-header fw-bold fs-5">
        Bekleyen İzin Talepleri
      </div>

      <div className="card-body">
        <div className="row g-3">
          {leaves.map(item => (

            <div key={item.id} className="col-xl-4 col-md-6 col-12">
              <div className="leave-request-card leave-card">
                <div className="leave-avatar">
                  <img
                    src={item.avatar || '/images/avatar/default.png'}
                    alt={item.employee}
                    className="avatar-img"
                  />
                </div>

                <div className="leave-name">{item.employee}</div>
                <div className="leave-role">{item.role}</div>
                <div className="leave-meta">
                  <span>{item.type}</span>
                  <span className="leave-date">
                    {item.date || '-'}
                  </span>
                </div>

                <div className="leave-actions">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onApprove(item)}
                  >
                    Onayla
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onReject(item.id)}
                  >
                    Reddet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingLeaveRequests;
