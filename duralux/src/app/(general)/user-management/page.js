import UserManagementClient from "@/components/member-ship/UserManagementClient";
import PageHeader from "@/components/shared/pageHeader/PageHeader";

export const metadata = {
  title: "Kullanıcı Yönetimi | Codyol",
};

export default function UserManagementPage() {
  return (
    <>
      <PageHeader title="Kullanıcı Yönetimi" />
      <UserManagementClient />
    </>
  );
}