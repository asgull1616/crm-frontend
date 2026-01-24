'use client';

const AllLeavesList = () => {
  const leaves = [
    {
      id: 1,
      employee: 'Ayşegül Altıntaş',
      role: 'UI/UX Designer',
      avatar: '/images/avatar/default.png',
      type: 'Yıllık',
      date: '10 – 14 Şubat 2026',
      days: 5,
      status: 'Bekliyor',
    },
    {
      id: 2,
      employee: 'Sude Filikci',
      role: 'Frontend Developer',
      avatar: '/images/avatar/default.png',
      type: 'Mazeret',
      date: '22 Şubat 2026',
      days: 1,
      status: 'Onaylandı',
    },
  ];

  const statusColor = status => {
    if (status === 'Onaylandı') return 'success';
    if (status === 'Reddedildi') return 'danger';
    return 'warning';
  };

  return (
    <div className="card">
      <div className="card-header fw-bold fs-5 text-dark">
        Tüm İzinler
      </div>

      <div className="card-body p-0">
        {leaves.map(item => (
          <div key={item.id} className="leave-list-row">
            
            {/* SOL */}
            <div className="leave-user">
              <img
                src={item.avatar}
                className="leave-avatar-sm"
                alt={item.employee}
              />
              <div>
                <div className="fw-semibold">{item.employee}</div>
                <div className="text-muted small">{item.role}</div>
              </div>
            </div>

            {/* ORTA */}
            <div className="leave-info">
              <span>{item.type}</span>
              <span>{item.date}</span>
              <span>{item.days} gün</span>
            </div>

            {/* SAĞ */}
            <div>
              <span className={`badge bg-${statusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AllLeavesList;
