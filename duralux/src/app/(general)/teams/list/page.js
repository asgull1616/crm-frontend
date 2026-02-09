import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsHeader from '@/components/teams/TeamsHeader';
import TeamsOverview from '@/components/teams/TeamsOverview';
import TeamsTable from '@/components/teams/TeamsTable';

const page = () => {
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

        {/* 📋 TABLO */}
        <div className="row">
          <TeamsTable />
        </div>
      </div>
    </>
  );
};

export default page;
