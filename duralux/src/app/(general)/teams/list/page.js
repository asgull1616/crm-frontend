'use client'

import { useState } from 'react'
import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsHeader from '@/components/teams/TeamsHeader';
import TeamsOverview from '@/components/teams/TeamsOverview';
import TeamsTable from '@/components/teams/TeamsTable';
import FilterBar from '@/components/shared/FilterBar'


const page = () => {
  const [filters, setFilters] = useState({})

  return (
    <>
      {/* Sayfa üstü */}
      <PageHeader>
        <TeamsHeader />
      </PageHeader>
      <div className="main-content">
        {/* 🔥 GENEL BAKIŞ */}
        <div className="row mb-4">
          <TeamsOverview />
        </div>

        <FilterBar
          showSearch
          onChange={setFilters}
        />

        {/* 📋 TABLO */}
        <div className="row">
          <TeamsTable filters={filters} />
        </div>
      </div>
    </>
  );
};

export default page;
