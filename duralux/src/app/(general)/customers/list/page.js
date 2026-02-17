'use client'
import React, { useEffect, useState } from 'react'
import CustomersTable from '@/components/customers/CustomersTable'
import CustomersHeader from '@/components/customers/CustomersHeader'
import CustomersStatistics from '@/components/widgetsStatistics/CustomersStatistics'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import FilterBar from '@/components/shared/FilterBar'
import { customerService } from '@/lib/services/customer.service'

export default function Page() {

    const [filters, setFilters] = useState({})
const [customers, setCustomers] = useState([])

  useEffect(() => {
    customerService.list().then(res => {
      const payload = res.data
      const items = Array.isArray(payload)
        ? payload
        : (payload?.items || payload?.data || [])

      setCustomers(items)
    })
  }, [])
  return (<>

      <PageHeader />

    <div className="main-content container-fluid" style={{ padding: '25px' }}>
  
      {/* 1. En Üst: Arama Barı ve Filtreler (Türkçe) */}

      {/* 2. Orta: Gösterişli Kartlar (İlk Fotodaki Stil) */}
      <div className="row mb-2">
        <CustomersStatistics />
      </div>
      <FilterBar
       showCustomer
          customers={customers}
          showSearch
          onChange={setFilters}
        />
      {/* 3. Alt: Müşteri Listesi (İkinci Fotodaki Temizlikte) */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold text-dark">Müşteri Portföyü</h5>
            </div>
            <div className="card-body p-0">
              <CustomersTable filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>  </>
  )
}