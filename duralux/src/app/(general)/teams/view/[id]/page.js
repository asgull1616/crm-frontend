'use client';

import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsViewHeader from '@/components/teamsViewCreate/TeamsViewHeader';
import TeamsViewContent from '@/components/teamsViewCreate/TeamsViewContent';

const page = ({ params }) => {
  return (
    <>
      <PageHeader>
        <TeamsViewHeader />
      </PageHeader>

      <div className="main-content">
        <TeamsViewContent teamId={params.id} />
      </div>
    </>
  );
};

export default page;