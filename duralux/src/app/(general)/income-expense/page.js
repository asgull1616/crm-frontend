import PageHeader from '@/components/shared/pageHeader/PageHeader'
import IncomeExpenseHeader from '@/components/incomeExpense/IncomeExpenseHeader'
import IncomeExpenseTable from '@/components/incomeExpense/IncomeExpenseTable'

export default function Page() {
  return (
    <>
      <PageHeader>
        <IncomeExpenseHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <IncomeExpenseTable />
        </div>
      </div>
    </>
  )
}
