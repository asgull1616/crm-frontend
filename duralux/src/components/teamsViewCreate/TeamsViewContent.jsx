'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import Loading from '@/components/shared/Loading';
import { teamService } from '@/lib/services/team.service';

const TeamsViewContent = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamService
      .getById(teamId)
      .then((res) => setTeam(res.data.data))
      .finally(() => setLoading(false));
  }, [teamId]);

  if (loading) return <Loading />;
  if (!team) return <div className="text-muted">Ekip bulunamadı</div>;

  const columns = [
    {
      accessorKey: 'username',
      header: () => 'Kullanıcı',
      cell: ({ row }) => (
        <div>
          <div className="fw-semibold">{row.original.username}</div>
          <div className="text-muted small">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: () => 'Rol',
    },
    {
      accessorKey: 'createdAt',
      header: () => 'Katılım Tarihi',
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleDateString('tr-TR'),
    },
  ];

  // backend yapısını tabloya uyarlıyoruz
  const membersData = team.members.map((m) => ({
    id: m.user.id,
    username: m.user.username,
    email: m.user.email,
    role: m.user.role,
    createdAt: m.createdAt,
  }));

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card stretch stretch-full">
          <div className="card-body">

            {/* TEAM INFO */}
            <h5 className="fw-bold mb-3">Ekip Bilgileri</h5>
            <div className="mb-4">
              <div><strong>Ekip Adı:</strong> {team.name}</div>
              <div>
                <strong>Oluşturulma:</strong>{' '}
                {new Date(team.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>

            {/* MEMBERS */}
            <h6 className="fw-bold mb-3">Ekip Üyeleri</h6>
            <Table
              data={membersData}
              columns={columns}
              loading={false}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsViewContent;