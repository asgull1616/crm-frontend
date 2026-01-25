'use client'

import PageHeader from '@/components/shared/pageHeader/PageHeader'
import AdminPayrollStats from '@/components/teams/payroll/AdminPayrollStats'
import AdminPayrollFilters from '@/components/teams/payroll/AdminPayrollFilters'
import SalarySummaryTable from '@/components/teams/payroll/SalarySummaryTable'
import { useState } from 'react'

const payrollMock = [
    {
        id: '1',
        userName: 'Ahmet Yılmaz',
        month: 2,
        year: 2026,
        netPayable: 33000,
        status: 'PENDING',
    },
    {
        id: '2',
        userName: 'Ayşe Demir',
        month: 1,
        year: 2026,
        netPayable: 31500,
        status: 'PAID',
    },
]

export default function AdminPayrollPage() {
    const [draftFilters, setDraftFilters] = useState({
        month: '',
        year: '',
        status: '',
    })

    const [appliedFilters, setAppliedFilters] = useState({
        month: '',
        year: '',
        status: '',
    })

    const filteredData = payrollMock.filter(item => {
        if (appliedFilters.month && item.month !== Number(appliedFilters.month)) return false
        if (appliedFilters.year && item.year !== Number(appliedFilters.year)) return false
        if (appliedFilters.status && item.status !== appliedFilters.status) return false
        return true
    })

    return (
        <>
            <PageHeader title="Bordro Yönetimi" />

            <div className="container-fluid mt-4">
                <AdminPayrollStats data={filteredData} />

                <div className="card payroll-card mt-4">

                    <div className="card-header payroll-card-header">
                        Bordro Listesi
                    </div>


                    <div className="card-body">
                        <AdminPayrollFilters
                            draftFilters={draftFilters}
                            setDraftFilters={setDraftFilters}
                            onApply={() => setAppliedFilters(draftFilters)}
                        />

                        <hr />

                        <SalarySummaryTable
                            data={filteredData}
                            mode="admin"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
