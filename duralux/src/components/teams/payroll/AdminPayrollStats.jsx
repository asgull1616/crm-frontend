export default function AdminPayrollStats({ data }) {
    const total = data.reduce((a, b) => a + b.netPayable, 0)
    const paid = data.filter(i => i.status === 'PAID').length
    const pending = data.filter(i => i.status === 'PENDING').length

    return (
        <div className="row g-3">
            <StatCard title="Toplam Bordro" value="64.500 ₺" color="pink" />
            <StatCard title="Ödenen" value="1" color="green" />
            <StatCard title="Bekleyen" value="1" color="orange" />
            <StatCard title="Çalışan" value="2" color="blue" />

        </div>
    )
}

function StatCard({ title, value, color }) {
    return (
        <div className="col-md-3">
            <div className={`admin-stat-card ${color}`}>
                <div className="stat-title">{title}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    )
}
