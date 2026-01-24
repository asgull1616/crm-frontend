'use client';

import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PendingLeaveRequests from '@/components/teams/leaves/admin/PendingLeaveRequests';
import LeavesCalendar from '@/components/teams/leaves/admin/LeavesCalendar';

const AdminLeavesPage = () => {
  return (
    <>
      <PageHeader
        title="İzin Yönetimi"
        breadcrumb={['Ana Sayfa', 'İzinler', 'Admin']}
      />

      <div className="container-fluid mt-4">
        <div className="row g-4">
          <div className="col-12">
            <PendingLeaveRequests />
             <LeavesCalendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLeavesPage;
