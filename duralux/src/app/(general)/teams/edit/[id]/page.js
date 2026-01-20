'use client';

import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsEditContent from '@/components/teamsEdit/TeamsEditContent';

const page = ({ params }) => {
  return (
    <>
      <PageHeader>
      
      </PageHeader>

      <div className="main-content">
        <TeamsEditContent teamId={params.id} />
      </div>
    </>
  );
};

export default page;