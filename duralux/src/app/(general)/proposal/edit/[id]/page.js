"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import ProposalEditContent from "@/components/proposalEditCreate/ProposalEditContent";
import ProposalEditHeader from "@/components/proposalEditCreate/ProposalEditHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { redirect } from "next/navigation";

const ProposalSent = dynamic(
  () => import("@/components/proposalEditCreate/ProposalSent"),
  { ssr: false },
);

export default function Page({ params }) {
  const id = params?.id;

  const [headerActions, setHeaderActions] = useState({
    onSave: () => {},
    onSaveAndSend: () => {},
    loading: false,
  });

  return (
    <>
      <PageHeader>
        <ProposalEditHeader
          onSave={headerActions.onSave}
          onSaveAndSend={headerActions.onSaveAndSend}
          loading={headerActions.loading}
        />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <ProposalEditContent id={id} onReady={setHeaderActions} />
        </div>
      </div>

      <ProposalSent />
    </>
  );
}
