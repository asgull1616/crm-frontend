import React from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import ProposalEditHeader from "@/components/proposalEditCreate/ProposalEditHeader";
import ProposalCreateContent from "@/components/proposalEditCreate/ProposalCreateContent";
const ProposalSent = dynamic(
  () => import("@/components/proposalEditCreate/ProposalSent"),
  { ssr: false },
);
const page = () => {
<<<<<<< HEAD
    return (
        <>
            <PageHeader>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ProposalCreateContent />
                </div>
            </div>
            <ProposalSent />
        </>
    )
}
=======
  return (
    <>
      <PageHeader>
        <ProposalEditHeader />
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <ProposalCreateContent />
        </div>
      </div>
      <ProposalSent />
    </>
  );
};
>>>>>>> origin/main

export default page;
