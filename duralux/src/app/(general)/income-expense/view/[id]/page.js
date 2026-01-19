import PageHeader from "@/components/shared/pageHeader/PageHeader";
import IncomeExpenseHeader from "@/components/incomeExpense/IncomeExpenseHeader";
import IncomeExpenseViewContent from "@/components/incomeExpenseView/IncomeExpenseViewContent";

export default function Page({ params }) {
  return (
    <>
      <PageHeader>
        <IncomeExpenseHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <IncomeExpenseViewContent id={params.id} />
        </div>
      </div>
    </>
  );
}
