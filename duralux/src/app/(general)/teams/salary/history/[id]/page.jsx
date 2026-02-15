'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'
import AdminSalaryHistory from '@/components/teams/salary/AdminSalaryHistory'

export default function SalaryHistoryPage() {

    const { id } = useParams()

    const [data, setData] = useState([])
    const [employeeName, setEmployeeName] = useState('')

    useEffect(() => {
        if (!id) return

        api.get(`/teams/payroll/user/${id}`)
            .then(res => {
                setData(res.data)

                // ilk kayıttan user adı al
                if (res.data.length > 0) {
                    const user = res.data[0].user

                    const name =
                        user?.profile?.firstName && user?.profile?.lastName
                            ? `${user.profile.firstName} ${user.profile.lastName}`
                            : user?.username || ''

                    setEmployeeName(name)
                }

            })
            .catch(err => console.error(err))

    }, [id])

    // Toplam hesap
    const totalPaid = data
        .filter(d => d.status === 'PAID')
        .reduce((sum, d) => sum + (d.netSalary || 0), 0)
    return (
        <div className="container-fluid mt-4">

            <div className="history-header mb-4">
                <h4 className="mb-1">Maaş Geçmişi</h4>
                <div className="history-employee-name">
                    {employeeName}
                </div>
                <div className="history-summary">
                    Toplam Ödenen: {totalPaid.toLocaleString()} ₺
                </div>
            </div>

            <AdminSalaryHistory data={data} />

        </div>
    )
}
