'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

import PageHeader from '@/components/shared/pageHeader/PageHeader'
import UserSalaryCard from '@/components/teams/payroll/UserSalaryCard'
import SalarySummaryTable from '@/components/teams/payroll/SalarySummaryTable'

export default function PaymentHistoryPage() {
  const [currentSalary, setCurrentSalary] = useState(null)
  const [historySalaries, setHistorySalaries] = useState([])

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const [currentRes, historyRes] = await Promise.all([
          api.get('/teams/payroll/my/current'),
          api.get('/teams/payroll/my'),
        ])

        setCurrentSalary(currentRes.data)

        // current ayı history’den çıkar
        const history = historyRes.data.filter(
          (p) =>
            !currentRes.data ||
            p.id !== currentRes.data.id
        )

        setHistorySalaries(history)
      } catch (err) {
        console.error('User payroll verileri alınamadı:', err)
      }
    }

    fetchPayrolls()
  }, [])

  return (
    <>
      <PageHeader title="Maaşlarım" />

      <div className="container-fluid user-payroll-wrapper">
        <div className="user-payroll-grid">
          <UserSalaryCard salary={currentSalary} />

          {historySalaries.length > 0 && (
            <div className="card user-payroll-history">
              <div className="card-header user-section-title">
                Ödeme Geçmişim
              </div>

              <div className="card-body">
                <SalarySummaryTable
                  data={historySalaries}
                  mode="user"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
