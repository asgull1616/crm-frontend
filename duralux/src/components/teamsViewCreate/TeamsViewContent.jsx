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
            <div className="team-summary mb-5 text-center">
              <div className="d-flex flex-column align-items-center gap-2">

                <div className="team-avatar-lg mb-2">
                  {team.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h3 className="mb-1 fw-bold">{team.name}</h3>
                  <p className="text-muted mb-0">
                    Oluşturulma:{' '}
                    {new Date(team.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>

              </div>
              <div className="team-summary-stats mt-3">
                <div>
                  <strong>{team.members.length}</strong>
                  <span>Üye</span>
                </div>
              </div>

            </div>


            {/* MEMBERS */}
            <div className="members-section">
              <h5 className="fw-bold mb-1">Ekip Üyeleri</h5>
              <p className="text-muted mb-4">
                Bu ekipte yer alan kullanıcılar
              </p>

              <div className="members-grid">
                {membersData.map((m) => (
                  <div key={m.id} className="member-card">
                    <div className="member-avatar">
                      {m.username?.[0]?.toUpperCase()}
                    </div>

                    <div className="member-name">{m.username}</div>
                    <div className="member-email">{m.email}</div>

                    <span className="member-role">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsViewContent;