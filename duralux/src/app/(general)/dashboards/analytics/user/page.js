'use client';

import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate';
import LatestLeads from '@/components/widgetsTables/LatestLeads';
import TeamProgress from '@/components/widgetsList/Progress';
import SystemLogs from '@/components/widgetsTables/SystemLogs';
import { authService } from '@/lib/services/auth.service';
import WelcomePopup from '@/components/widgetsCharts/WelcomePopup';
import LeavesCalendar from '@/components/teams/leaves/admin/LeavesCalendar';
import '@/app/globals.css';

const Home = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.me();
        setUsername(res.data.username);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <WelcomePopup />
      <PageHeader>
        <PageHeaderDate />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <SystemLogs />

          <LatestLeads title={'Teklif & Görev Süreçleri (Demo)'} />
          <TeamProgress title={'CODYOL Ekip Performansı'} footerShow={true} />
          <LeavesCalendar />
        </div>
      </div>
    </>
  );
};

export default Home;
