import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomerCreateContent from '@/components/customersCreate/CustomerCreateContent'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'

const Page = () => {
  return (
    <>
      <PageHeader>
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <CustomerCreateContent />
        </div>
        
      </div>
    </>
  )
}

export default Page
