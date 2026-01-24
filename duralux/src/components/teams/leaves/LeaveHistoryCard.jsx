'use client';

const LeaveHistoryCard = () => {
  const leaves = [
    {
      id: 1,
      type: 'Yıllık',
      range: '10 - 14 Şubat 2026',
      days: 5,
      status: 'pending',
    },
    {
      id: 2,
      type: 'Mazeret',
      range: '22 Şubat 2026',
      days: 1,
      status: 'approved',
    },
    {
      id: 3,
      type: 'Hastalık',
      range: '03 - 04 Mart 2026',
      days: 2,
      status: 'rejected',
    },
  ];

  const statusMap = {
    pending: { label: 'Bekliyor', class: 'warning' },
    approved: { label: 'Onaylandı', class: 'success' },
    rejected: { label: 'Reddedildi', class: 'danger' },
  };

  return (
    <div className="card h-100">
      <div className="card-body">

        <h4 className="mb-3">Geçmiş İzinlerim</h4>
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Tür</th>
                <th>Tarih</th>
                <th>Gün</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.type}</td>
                  <td>{leave.range}</td>
                  <td>{leave.days}</td>
                  <td>
                    <span className={`badge bg-${statusMap[leave.status].class}`}>
                      {statusMap[leave.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LeaveHistoryCard;
