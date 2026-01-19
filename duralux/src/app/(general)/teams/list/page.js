import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsHeader from '@/components/teams/TeamsHeader';
import TeamsTable from '@/components/teams/TeamsTable';
import Footer from '@/components/shared/Footer';

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

      {/* <Footer /> */}
    </>
  );
};

export default page;