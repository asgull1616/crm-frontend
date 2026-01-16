'use client'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomersEditHeader from '@/components/customersEdit/CustomersEditHeader'
import CustomerEditForm from '@/components/customersEdit/CustomerEditForm'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return (
    <>
      <PageHeader>
        <CustomersEditHeader />
      </PageHeader>

      <div className="main-content">
        <CustomerEditForm customerId={id} />
      </div>
    </>
  )
}

export default Page
