"use client";
import { useRouter } from "next/navigation";
import CustomersEditHeader from "./CustomersEditHeader";
import CustomerEditForm from "./CustomerEditForm";

const CustomerEditContent = ({ customerId }) => {
  const router = useRouter();

  return (
    <>
      <CustomersEditHeader />

      <div className="mt-4">
        <CustomerEditForm
          customerId={customerId}
          onSuccess={() => router.push(`/customers/view/${customerId}`)}
        />
      </div>
    </>
  );
};

export default CustomerEditContent;
