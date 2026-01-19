'use client';

import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import TeamsEditContent from '@/components/teamsEdit/TeamsEditContent';

const page = ({ params }) => {
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Ekip Güncelle</h4>
      </PageHeader>

      <div className="main-content">
        <TeamsEditContent teamId={params.id} />
      </div>
    </>
  );
};

export default page;