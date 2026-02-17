'use client'

import React, { useState, useEffect } from "react";
import ProposalTable from "@/components/proposal/ProposalTable";
import ProposalHeadr from "@/components/proposal/ProposalHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import ProposalHeaderContent from "@/components/proposal/ProposalHeaderContent";
import FilterBar from '@/components/shared/FilterBar'

import Showcase from "@/components/widgetsCharts/PaymentRecordChartTwo";
import api from '@/lib/axios'
const page = () => {
  const [filters, setFilters] = useState({})
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    api.get('/customers')
      .then(res => setCustomers(res.data.data))
      .catch(err => console.error(err))
  }, [])

  // useEffect(() => {
  //   console.log("Gelen filters:", filters)
  //   console.log("Customer filter:", filters.customerId)
  // }, [filters])

  return (
    <>
      <PageHeader>
        <ProposalHeadr />
      </PageHeader>
      <ProposalHeaderContent />
      <div className="main-content">
        <div className="row">
          <Showcase />
          <FilterBar
            showSearch
            showMonth
            showYear
            showCustomer
            customers={customers}
            onChange={(updatedFilters) => {
              setFilters(updatedFilters)
            }}
          />


          <ProposalTable filters={filters} />
        </div>
      </div>
    </>
  );
};

export default page;
