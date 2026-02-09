import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsHeader from '@/components/teams/TeamsHeader';
import TeamsTable from '@/components/teams/TeamsTable';

const page = () => {
  return (
    <>
      <PageHeader>
        <TeamsHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <TeamsTable />
        </div>
      </div>

    </>
  );
};

export default page;