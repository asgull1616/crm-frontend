export default function AdminPayrollStats({ data }) {
  const totalAmount = data.reduce(
    (sum, item) => sum + (item.netPayable ?? item.netSalary ?? 0),
    0
  )

  const paidCount = data.filter(i => i.status === 'PAID').length
  const pendingCount = data.filter(i => i.status === 'PENDING').length

  const employeeCount = new Set(
    data.map(i => i.user?.id).filter(Boolean)
  ).size

  return (
    <div className="row g-3">
      <StatCard
        title="Toplam Bordro"
        value={`${totalAmount.toLocaleString()} ₺`}
        color="pink"
      />

      <StatCard
        title="Ödenen"
        value={paidCount}
        color="green"
      />

      <StatCard
        title="Bekleyen"
        value={pendingCount}
        color="orange"
      />

      <StatCard
        title="Çalışan"
        value={employeeCount}
        color="blue"
      />
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

