import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomerContent from "@/components/customersView/CustomerContent";

const Page = () => {
  return (
    <>
      <PageHeader />
      <div className="main-content">
        <CustomerContent />
      </div>
    </>
  );
};

export default Page;
