import PageHeader from "@/components/shared/pageHeader/PageHeader";
import IncomeExpenseHeader from "@/components/incomeExpense/IncomeExpenseHeader";
import IncomeExpenseEditContent from "@/components/incomeExpenseEdit/IncomeExpenseEditContent";

export default function Page({ params }) {
  return (
    <>
      <PageHeader>
        <IncomeExpenseHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <IncomeExpenseEditContent id={params.id} />
        </div>
      </div>
    </>
  );
}
