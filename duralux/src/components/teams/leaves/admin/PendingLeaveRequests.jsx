'use client';

const PendingLeaveRequests = () => {
    const pendingLeaves = [
        {
            id: 1,
            employee: 'Ayşegül Altıntaş',
            role: 'UI/UX Designer',
            avatar: '/images/avatar/default.png',
            type: 'Yıllık',
            date: '10 – 14 Şubat 2026',
        },
        {
            id: 2,
            employee: 'Sude Filikci',
            role: 'Frontend Developer',
            avatar: '/images/avatar/default.png',
            type: 'Mazeret',
            date: '22 Şubat 2026',

        },
        {
            id: 3,
            employee: 'Ahmet Burak Kır',
            role: 'Backend Developer',
            avatar: '/images/avatar/default.png',
            type: 'Hastalık',
            date: '03 – 04 Mart 2026',
        },

    ];

    return (
        <div className="card">
            <div className="card-header fw-bold text-dark fs-5">
                Bekleyen İzin Talepleri
            </div>

            <div className="card-body">
                <div className="row g-3">
                    {pendingLeaves.map(item => (
                        <div key={item.id} className="col-xl-4 col-md-6 col-12">
                            <div className="leave-request-card leave-card">
                                <img
                                    src={item.avatar}
                                    className="leave-avatar"
                                    alt={item.employee}
                                />

                                <div className="leave-name">{item.employee}</div>
                                <div className="leave-role">{item.role}</div>

                                <div className="leave-meta">
                                    <span>{item.type}</span>
                                    <span>{item.date}</span>
                                </div>

                                <div className="leave-actions">
                                    <button className="btn btn-success btn-sm">Onayla</button>
                                    <button className="btn btn-danger btn-sm">Reddet</button>
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
