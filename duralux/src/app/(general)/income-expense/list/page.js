"use client";

import React, { useState, useEffect } from "react";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import IncomeExpenseHeader from "@/components/incomeExpense/IncomeExpenseHeader";
import IncomeExpenseTable from "@/components/incomeExpense/IncomeExpenseTable";
import FilterBar from "@/components/shared/FilterBar";
import { customerService } from "@/lib/services/customer.service";

const page = () => {
  const [filters, setFilters] = useState({});
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    customerService.list().then((res) => {
      const payload = res.data;
      const items = Array.isArray(payload)
        ? payload
        : payload?.items || payload?.data || [];

      setCustomers(items);
    });
  }, []);
  return (
    <>
      <PageHeader>
        <IncomeExpenseHeader />
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <FilterBar
            showSearch
            showDateRange
            showType
            showDueStatus
            showCustomer
            customers={customers}
            filters={filters}
            onChange={setFilters}
          />

          <IncomeExpenseTable filters={filters} />
        </div>
      </div>
    </>
  );
};

export default page;
