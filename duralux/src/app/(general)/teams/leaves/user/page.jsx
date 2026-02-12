"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import LeaveRequestCard from "@/components/teams/leaves/LeaveRequestCard";
import LeaveHistoryCard from "@/components/teams/leaves/LeaveHistoryCard";

const UserLeavesPage = () => {
  const router = useRouter();

  useEffect(() => {
    authService
      .me()
      .then((res) => {
        if (res.data.role === "ADMIN") {
          router.replace("/leaves/admin");
        }
      })
      .catch(() => {
        router.replace("/authentication/login/cover");
      });
  }, [router]);

  return (
    <>
      <PageHeader title="İzinlerim" breadcrumb={["Ana Sayfa", "İzinler"]} />

      <div className="container-fluid mt-4">
        <div className="row g-4">
          <div className="col-xl-4 col-lg-5 col-12">
            <LeaveRequestCard />
          </div>

          <div className="col-xl-8 col-lg-7 col-12">
            <LeaveHistoryCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLeavesPage;
