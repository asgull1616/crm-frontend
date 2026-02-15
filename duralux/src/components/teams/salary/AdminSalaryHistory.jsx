'use client'

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

export default function AdminSalaryHistory({ data = [] }) {

    if (data.length === 0) {
        return <div className="text-muted">Kayıt bulunamadı</div>
    }

    return (
        <div className="history-list">
            {data.map(item => {

                let breakdown = {}

                try {
                    breakdown = item.note
                        ? typeof item.note === 'string'
                            ? JSON.parse(item.note)
                            : item.note
                        : {}
                } catch {
                    breakdown = {}
                }

                const statusClass =
                    item.status === 'PAID' ? 'paid' : 'pending'

                return (
                    <div
                        key={item.id}
                        className={`history-card ${statusClass}`}
                    >

                        <div className="history-card-header">
                            <div>
                                <div className="history-period">
                                    {months[item.month - 1]} {item.year}
                                </div>
                                <div className="history-net">
                                    {item.netSalary?.toLocaleString()} ₺
                                </div>
                            </div>

                            <div className={`history-status ${statusClass}`}>
                                {item.status === 'PAID'
                                    ? 'Ödendi'
                                    : 'Bekliyor'}
                            </div>
                        </div>

                        <div className="history-breakdown">
                            <div>
                                <span>Baz Maaş</span>
                                <strong>
                                    {(breakdown.baseSalary || 0).toLocaleString()} ₺
                                </strong>
                            </div>

                            <div>
                                <span>Eksik Gün</span>
                                <strong>
                                    - {breakdown.missingDays || 0} gün
                                </strong>
                            </div>

                            <div>
                                <span>Prim</span>
                                <strong>
                                    + {(breakdown.bonus || 0).toLocaleString()} ₺
                                </strong>
                            </div>

                            <div>
                                <span>Kesinti</span>
                                <strong>
                                    - {(breakdown.deduction || 0).toLocaleString()} ₺
                                </strong>
                            </div>
                        </div>

                    </div>
                )
            })}
        </div>
    )
}
