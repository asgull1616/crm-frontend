import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate';
import LatestLeads from '@/components/widgetsTables/LatestLeads';
import TeamProgress from '@/components/widgetsList/Progress';
import DuplicateLayout from './duplicateLayout';
import Sales from '@/components/widgetsCharts/SalesPipelineChart';
import TrendAnalysisChart from '@/components/widgetsCharts/TrendAnalysisChart';
import ActivityAnalysis from '@/components/widgetsCharts/ActivityAnalysis';
import SystemLogs from '@/components/widgetsTables/SystemLogs';

const Home = () => {
  return (
    <DuplicateLayout>
      <PageHeader>
        <PageHeaderDate />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <TrendAnalysisChart />
          <Sales />
          <ActivityAnalysis />
          <SystemLogs />

          {/* 🟡 CRM MANTIĞI */}
          <LatestLeads title={'Teklif & Görev Süreçleri (Demo)'} />

          {/* 🟢 EKİP */}
          <TeamProgress title={'CODYOL Ekip Performansı'} footerShow={true} />
        </div>
      </div>
    </DuplicateLayout>
  );
};

export default Home;
