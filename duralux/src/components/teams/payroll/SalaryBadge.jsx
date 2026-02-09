export default function SalaryBadge({ status }) {
  const isPaid = status === 'PAID'

  return (
    <span className={`badge ${isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
      {isPaid ? 'Ödendi' : 'Bekliyor'}
    </span>
  )
}
