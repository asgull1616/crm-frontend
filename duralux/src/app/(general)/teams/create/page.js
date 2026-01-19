import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsCreateHeader from '@/components/teamsViewCreate/TeamsCreateHeader';
import TeamsCreateContent from '@/components/teamsViewCreate/TeamsCreateContent';

const page = () => {
  return (
    <>
      <PageHeader>
        <TeamsCreateHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <TeamsCreateContent />
        </div>
      </div>
    </>
  );
};

export default page;