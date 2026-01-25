import SalaryBadge from '@/components/teams/payroll/SalaryBadge'

export default function UserSalaryCard({ salary }) {
  if (!salary) return null

  return (
    <div className="user-salary-card compact">
     <p className="user-section-title">
  Bu Ay Alacağın Maaş
</p>

      <div className="user-salary-amount">
        {salary.netPayable.toLocaleString()} ₺
      </div>

      <div className="mt-2">
        <SalaryBadge status={salary.status} />
      </div>

      <div className="user-salary-sub">
        Ödeme ay sonunda yapılacaktır
      </div>
    </div>
  )
}
