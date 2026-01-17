'use client'
import React, { useRef } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'
import CustomerCreateContent from '@/components/customersCreate/CustomerCreateContent'

const page = () => {
  const submitRef = useRef(null)

  return (
    <>
      <PageHeader />

      <div className="main-content">
        <CustomerCreateContent
          onSubmit={(fn) => (submitRef.current = fn)}
        />
      <CustomersCreateHeader
        onSubmit={() => submitRef.current?.()}
      />
      </div>

    </>
  )
}

export default page
