'use client';

import { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PendingLeaveRequests from '@/components/teams/leaves/admin/PendingLeaveRequests';
import LeavesCalendar from '@/components/teams/leaves/admin/LeavesCalendar';
import { leavesService } from '@/lib/services/leaves.service';

const AdminLeavesPage = () => {
  const calendarRef = useRef(null);

  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  // 🔥 BACKEND’DEN VERİ ÇEK
const fetchLeaves = async () => {
  const [pendingRes, approvedRes] = await Promise.all([
    leavesService.getPending(),
    leavesService.getApproved(),
  ]);

  console.log('APPROVED GELEN:', approvedRes.data);

  setPendingLeaves(pendingRes.data);
  setApprovedLeaves(approvedRes.data);
};


  // 📌 SAYFA AÇILINCA ÇALIŞIR
  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ ONAYLA
const handleApprove = async (leave) => {
  try {
    await leavesService.approve(leave.id); 
    await fetchLeaves();                   
  } catch (e) {
    console.error('İzin onaylanamadı', e);
  }
};

  // ❌ REDDET
  const handleReject = async (id) => {
    await leavesService.reject(id);
    await fetchLeaves();
  };

  return (
    <>
      <PageHeader
        title="İzin Yönetimi"
        breadcrumb={['Ana Sayfa', 'İzinler', 'Admin']}
      />

      <div className="container-fluid mt-4">
        <div className="row g-4">
          <div className="col-12">
            <PendingLeaveRequests
              leaves={pendingLeaves}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          <div className="col-12" ref={calendarRef}>
            <LeavesCalendar leaves={approvedLeaves} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLeavesPage;
