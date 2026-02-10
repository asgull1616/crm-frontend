import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomerEditContent from "@/components/customersEdit/CustomerEditContent";

const Page = ({ params }) => {
  return (
    <>
      <PageHeader />
      <div className="main-content">
        <CustomerEditContent customerId={params.id} />
      </div>
    </>
  );
};

export default Page;
