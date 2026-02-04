'use client'

import SalaryBadge from '@/components/teams/payroll/SalaryBadge'

const monthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

export default function SalarySummaryTable({ data = [], mode = 'user' }) {
  return (
    <div className="table-responsive ">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            {mode === 'admin' && <th>Çalışan</th>}
            <th>Ay</th>
            <th>Net Maaş</th>
            <th>Durum</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={mode === 'admin' ? 4 : 3} className="text-center text-muted">
                Kayıt bulunamadı
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                {mode === 'admin' && <td>{item.userName}</td>}
                <td>
                  {monthNames[item.month - 1]} {item.year}
                </td>
                <td className="fw-semibold">
                  {item.netPayable.toLocaleString()} ₺
                </td>
                <td>
                  <SalaryBadge status={item.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
