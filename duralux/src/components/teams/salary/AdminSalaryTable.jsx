'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'


export default function AdminSalaryTable({ data = [], refresh }) {

  const router = useRouter()
  const [loadingId, setLoadingId] = useState(null)

  const handlePay = async (id) => {
    try {
      setLoadingId(id)
      await api.patch(`/teams/payroll/${id}/pay`)
      refresh()
    } catch {
      alert('Ödeme sırasında hata oluştu')
    } finally {
      setLoadingId(null)
    }
  }

  const goToHistory = (userId) => {
    router.push(`/teams/salary/history/${userId}`)
  }

  if (data.length === 0) {
    return <div className="text-center text-muted py-5">Kayıt bulunamadı</div>
  }

  return (
    <div className="salary-card-list">
      {data.map(item => {

        const net = item.netPayable ?? item.netSalary ?? 0

        let breakdown = {}
        if (item.note) {
          try {
            breakdown =
              typeof item.note === 'string'
                ? JSON.parse(item.note)
                : item.note
          } catch {
            breakdown = {}
          }
        }

        const statusClass = item.status === 'PAID' ? 'paid' : 'pending'

        return (
          <div key={item.id} className={`salary-card ${statusClass}`}>

            <div className="salary-card-header">
              <div>
                <div className="employee-name">
                  {item.user?.fullName}
                </div>

                <button
                  className="history-btn"
                  onClick={() => goToHistory(item.user.id)}
                >
                   📄 Maaş Geçmişi
                </button>

                <div className="salary-period">
                  {item.month}/{item.year}
                </div>
              </div>

              <div className={`status-chip ${statusClass}`}>
                {item.status === 'PAID' ? 'Ödendi' : 'Bekliyor'}
              </div>
            </div>

            <div className="salary-breakdown">
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

            <div className="salary-net-section">
              <div>
                <div className="net-label">Net Ödenecek</div>
                <div className="net-value">
                  {net.toLocaleString()} ₺
                </div>
              </div>

              {item.status === 'PENDING' && (
                <button
                  className="btn-approve"
                  disabled={loadingId === item.id}
                  onClick={() => handlePay(item.id)}
                >
                  {loadingId === item.id ? 'İşleniyor…' : 'Ödemeyi Onayla'}
                </button>
              )}
            </div>

          </div>
        )
      })}
    </div>
  )
}
