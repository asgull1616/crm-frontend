import PageHeader from "@/components/shared/pageHeader/PageHeader";
import ContractsHeader from "@/components/contracts/ContractsHeader";
import ContractsContent from "@/components/contracts/ContractsContent";

const Page = () => {
  return (
    <>
      <PageHeader>
        <ContractsHeader />
      </PageHeader>

      <div className="main-content">
        <ContractsContent />
      </div>
    </>
  );
};

export default Page;
