import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import ProposalHeader from "@/components/proposal/ProposalHeader";
import ProposalViewContent from "@/components/proposalView/ProposalViewContent";

export default function Page({ params }) {
  return (
    <>
      <PageHeader>
        <ProposalHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <ProposalViewContent id={params.id} />
        </div>
      </div>

      <Footer />
    </>
  );
}
