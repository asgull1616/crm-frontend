'use client'

import PageHeader from '@/components/shared/pageHeader/PageHeader'
import UserSalaryCard from '@/components/teams/payroll/UserSalaryCard'
import SalarySummaryTable from '@/components/teams/payroll/SalarySummaryTable'

const payrollMock = [
    { id: '1', month: 2, year: 2026, netPayable: 200000, status: 'PENDING' },
    { id: '2', month: 1, year: 2026, netPayable: 150000, status: 'PAID' },
    { id: '3', month: 12, year: 2025, netPayable: 150000, status: 'PAID' },
]

export default function PaymentHistoryPage() {
    const now = { month: 2, year: 2026 }

    const currentMonthSalary = payrollMock.find(
        (i) => i.month === now.month && i.year === now.year
    )

    const historySalaries = payrollMock.filter(
        (i) => !(i.month === now.month && i.year === now.year)
    )

    return (
        <>
            <PageHeader />

            <div className="container-fluid user-payroll-wrapper">
                <div className="user-payroll-grid">
                    <UserSalaryCard salary={currentMonthSalary} />
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
