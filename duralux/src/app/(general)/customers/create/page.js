import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomersCreateHeader from "@/components/customersCreate/CustomersCreateHeader";
import CustomerCreateContent from "@/components/customersCreate/CustomerCreateContent";

const Page = () => {
  return (
    <>
      <PageHeader>
        <CustomersCreateHeader />
      </PageHeader>

      <div className="main-content">
        <CustomerCreateContent />
      </div>
    </>
  );
};

export default Page;
