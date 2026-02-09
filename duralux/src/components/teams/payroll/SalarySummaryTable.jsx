'use client'

import { useState } from 'react'
import SalaryBadge from '@/components/teams/payroll/SalaryBadge'
import api from '@/lib/axios'

const monthNames = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
]

const getNetSalary = (item) =>
  item.netPayable ?? item.netSalary ?? 0

export default function SalarySummaryTable({ data = [], mode = 'user' }) {
  const [confirmPayroll, setConfirmPayroll] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePay = async (id) => {
    try {
      setLoading(true)
      await api.patch(`/teams/payroll/${id}/pay`)
      window.location.reload()
    } catch {
      alert('Ödeme sırasında hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="table-responsive">
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
              data.map(item => (
                <tr key={item.id}>
                  {mode === 'admin' && <td>{item.user?.fullName || '-'}</td>}

                  <td>
                    {item.month ? monthNames[item.month - 1] : '-'} {item.year || ''}
                  </td>

                  <td className="fw-semibold">
                    {getNetSalary(item).toLocaleString()} ₺
                  </td>

               <td className="d-flex align-items-center gap-2">
                    <SalaryBadge status={item.status} />

                      {mode === 'admin' && item.status === 'PENDING' && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => setConfirmPayroll(item)}
                        style={{ height: '20px',width: '100px' }}
                      >
                        Ödemeyi Onayla
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔴 ÖDEME ONAY MODALI */}
      {confirmPayroll && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <div className="modal-header">
              <h5>Ödeme Onayı</h5>
              <button className="btn-close" onClick={() => setConfirmPayroll(null)} />
            </div>

            <div className="modal-body text-center">
              <p className="mb-1 fw-semibold">
                {confirmPayroll.user?.fullName}
              </p>
              <p className="text-muted">
                {monthNames[confirmPayroll.month - 1]} {confirmPayroll.year}
              </p>

              <div className="fs-4 fw-bold text-success my-3">
                {getNetSalary(confirmPayroll).toLocaleString()} ₺
              </div>

              <p className="text-muted mb-0">Bu işlem geri alınamaz.</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmPayroll(null)}
                disabled={loading}
              >
                Vazgeç
              </button>

              <button
                className="btn btn-success"
                disabled={loading}
                onClick={() => handlePay(confirmPayroll.id)}
              >
                {loading ? 'İşleniyor…' : 'Ödemeyi Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
