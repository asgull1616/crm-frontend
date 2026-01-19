'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CustomerSocalMedia from './CustomerSocalMedia'
import TabOverviewContent from './TabOverviewContent'
import TabBillingContent from './TabBillingContent'
import TabActivityContent from './TabActivityContent'
import TabNotificationsContent from './TabNotificationsContent'
import TabConnections from './TabConnections'
import TabSecurity from './TabSecurity'
import Profile from '../widgetsList/Profile'
import { customerService } from '@/lib/services/customer.service'

const CustomerContent = () => {
    const { id } = useParams()
    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) loadCustomer()
    }, [id])

    const loadCustomer = async () => {
        try {
            const res = await customerService.getById(id)
            setCustomer(res.data)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Yükleniyor...</div>
    if (!customer) return <div>Müşteri bulunamadı</div>

    return (
        <>
            <div className="col-xxl-4 col-xl-6">
                <Profile customer={customer} />
            </div>

            <div className="col-xxl-8 col-xl-6">
                <div className="card border-top-0">
                    <div className="card-header p-0">
                        <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs">
                            <li className="nav-item flex-fill border-top">
                                <a className="nav-link active" data-bs-toggle="tab" data-bs-target="#overviewTab">
                                    Genel Bakış
                                </a>
                            </li>
                            <li className="nav-item flex-fill border-top">
                                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#activityTab">
                                    Aktivite
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="tab-content">
                        <TabOverviewContent customer={customer} />
                        <TabActivityContent customerId={customer.id} />
                        {/* diğer tab’lar sonra */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerContent
