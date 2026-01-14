import CustomersTable from '@/components/customers/CustomersTable'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomersHeader from '@/components/customers/CustomersHeader'

export default function Page() {
  return (
    <>
      <PageHeader>
        <CustomersHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <CustomersTable />
        </div>
      </div>
    </>
  )
}
