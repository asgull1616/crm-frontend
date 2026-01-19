import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import LatestLeads from "@/components/widgetsTables/LatestLeads";
import TeamProgress from "@/components/widgetsList/Progress";
import FounderShowcaseCard from "@/components/widgetsCharts/FounderShowcaseCard";
import DuplicateLayout from "./duplicateLayout";
import CoFounderShowcaseCard from "@/components/widgetsCharts/CoFounderShowcaseCard";

const Home = () => {
  return (
    <DuplicateLayout>
      <PageHeader>
        <PageHeaderDate />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          {/* 🔵 MARKA & VİZYON */}
          <FounderShowcaseCard />

          <CoFounderShowcaseCard />

          {/* 🟡 CRM MANTIĞI */}
          <LatestLeads title={"Teklif & Görev Süreçleri (Demo)"} />

          {/* 🟢 EKİP */}
          <TeamProgress title={"CODYOL Ekip Performansı"} footerShow={true} />
        </div>
      </div>
    </DuplicateLayout>
  );
};

export default Home;
