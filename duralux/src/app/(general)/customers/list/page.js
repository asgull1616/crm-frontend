'use client'
import React from 'react'
import CustomersTable from '@/components/customers/CustomersTable'
import CustomersHeader from '@/components/customers/CustomersHeader'
import CustomersStatistics from '@/components/widgetsStatistics/CustomersStatistics'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
export default function Page() {
  return (<>

      <PageHeader />

    <div className="main-content container-fluid" style={{ padding: '25px' }}>
      
      {/* 1. En Üst: Arama Barı ve Filtreler (Türkçe) */}
      <div className="row mb-4">
        <div className="col-12">
          <CustomersHeader />
        </div>
      </div>

      {/* 2. Orta: Gösterişli Kartlar (İlk Fotodaki Stil) */}
      <div className="row mb-2">
        <CustomersStatistics />
      </div>

      {/* 3. Alt: Müşteri Listesi (İkinci Fotodaki Temizlikte) */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold text-dark">Müşteri Portföyü</h5>
            </div>
            <div className="card-body p-0">
              <CustomersTable />
            </div>
          </div>
        </div>
      </div>
    </div>  </>
  )
}