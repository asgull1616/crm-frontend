export default function AdminSalaryStats({ data = [] }) {
  const totalNet = data.reduce(
    (sum, item) => sum + (item.netPayable ?? item.netSalary ?? 0),
    0
  )

  const paidCount = data.filter(i => i.status === 'PAID').length
  const pendingCount = data.filter(i => i.status === 'PENDING').length

  const employeeCount = new Set(
    data.map(i => i.user?.id).filter(Boolean)
  ).size

  return (
    <div className="salary-stats-grid">
      <ModernStatCard
        title="Toplam Net Maaş"
        value={`${totalNet.toLocaleString()} ₺`}
        subtitle="Bu ay ödenecek toplam"
        gradient="pink"
      />

      <ModernStatCard
        title="Ödenen"
        value={paidCount}
        subtitle="Tamamlanan ödemeler"
        gradient="green"
      />

      <ModernStatCard
        title="Bekleyen"
        value={pendingCount}
        subtitle="Onay bekleyen maaş"
        gradient="orange"
      />

      <ModernStatCard
        title="Çalışan"
        value={employeeCount}
        subtitle="Maaşı hesaplanan"
        gradient="blue"
      />
    </div>
  )
}

function ModernStatCard({ title, value, subtitle, gradient }) {
  return (
    <div className={`modern-stat-card ${gradient}`}>
      <div className="stat-top">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{subtitle}</div>
    </div>
  )
}
