'use client';

import { useEffect, useState } from 'react';
import { leavesService } from '@/lib/services/leaves.service';

const statusMap = {
  PENDING: { label: 'Bekliyor', class: 'leave-status pending' },
  APPROVED: { label: 'Onaylandı', class: 'leave-status approved' },
  REJECTED: { label: 'Reddedildi', class: 'leave-status rejected' },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const LeaveHistoryCard = () => {
  const [leaves, setLeaves] = useState([]);

  // 🔥 SAYFA AÇILINCA ÇEK
  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      const res = await leavesService.getMyLeaves();
      setLeaves(res.data);
    } catch (e) {
      console.error('İzinler alınamadı', e);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">

        <h5 className="mb-3">Geçmiş İzinlerim</h5>
        <div className="section-divider" />

        {leaves.length === 0 && (
          <div className="text-muted" style={{ fontSize: 14 }}>
            Henüz izin kaydınız yok.
          </div>
        )}

        <div className="leave-history-list">
          {leaves.map((leave) => {
            const sameDay =
              new Date(leave.start).toDateString() ===
              new Date(leave.end).toDateString();

            const range = sameDay
              ? formatDate(leave.start)
              : `${formatDate(leave.start)} – ${formatDate(leave.end)}`;

            const days =
              Math.ceil(
                (new Date(leave.end) - new Date(leave.start)) /
                  (1000 * 60 * 60 * 24)
              ) + 1;

            return (
              <div key={leave.id} className="leave-list-row">
                <div className="leave-history-type">
                  {leave.type}
                </div>

                <div className="leave-history-range">
                  {range}
                </div>

                <div className="leave-history-days">
                  {days} gün
                </div>

                <div>
                  <span className={statusMap[leave.status].class}>
                    {statusMap[leave.status].label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default LeaveHistoryCard;
