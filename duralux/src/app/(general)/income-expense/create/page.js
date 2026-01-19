import React from "react";
import dynamic from "next/dynamic";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import IncomeExpenseHeader from "@/components/incomeExpense/IncomeExpenseHeader";
import IncomeExpenseCreateContent from "@/components/incomeExpenseCreate/IncomeExpenseCreateContent";

// ProposalSent benzeri, ssr kapalı bir bileşen gerekiyorsa
const IncomeExpenseCreated = dynamic(
  () => import("@/components/incomeExpenseCreate/IncomeExpenseCreated"),
  { ssr: false },
);

const page = () => {
  return (
    <>
      <PageHeader>
        <IncomeExpenseHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <IncomeExpenseCreateContent />
        </div>
      </div>

      <IncomeExpenseCreated />
    </>
  );
};

export default page;
