'use client';

import React, { useEffect, useState } from 'react';
import Loading from '@/components/shared/Loading';
import { FiTrash2 } from 'react-icons/fi';
import { teamService } from '@/lib/services/team.service';

const TeamsEditContent = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      teamService.getById(teamId),
      teamService.listUsers(),
    ])
      .then(([teamRes, usersRes]) => {
        setTeam(teamRes.data.data);
        setAllUsers(usersRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [teamId]);

  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };


  const handleAddMembers = async () => {
    await teamService.addMembers(teamId, selectedUserIds);

    const refreshed = await teamService.getById(teamId);
    setTeam(refreshed.data.data);
    setSelectedUserIds([]);
  };


  const handleRemoveMember = async (userId) => {
    const ok = window.confirm('Bu üyeyi ekipten çıkarmak istiyor musunuz?');
    if (!ok) return;

    await teamService.removeMembers(teamId, [userId]);

    setTeam((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.user.id !== userId),
    }));
  };

  if (loading) return <Loading />;
  if (!team) return null;

  const membersData = team.members.map((m) => ({
    id: m.user.id,
    username: m.user.username,
    email: m.user.email,
    role: m.user.role,
  }));

  const memberIds = team.members.map((m) => m.user.id);
  const availableUsers = allUsers.filter(
    (u) => !memberIds.includes(u.id)
  );

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card stretch stretch-full">
          <div className="card-body">

            <div className="team-summary mb-4">
              <div className="team-avatar-lg">
                {team.name.slice(0, 2).toUpperCase()}
              </div>

              <h3 className="mt-3 mb-1">{team.name}</h3>

              <p className="text-muted mb-3">
                Oluşturulma · {new Date(team.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>


            <hr />

            <h6 className="fw-bold mb-3">Mevcut Üyeler</h6>

<div className="members-grid">
  {membersData.map((m) => (
    <div key={m.id} className="member-card member-card-existing">
      
      {/* Sil butonu */}
      <button
        className="member-delete-btn"
        onClick={() => handleRemoveMember(m.id)}
        title="Üyeyi çıkar"
      >
        <FiTrash2 size={14} />
      </button>

      {/* Avatar */}
      <div className="member-avatar">
        {m.username?.[0]?.toUpperCase()}
      </div>

      {/* Info */}
      <div className="member-name">{m.username}</div>
      <div className="member-email">{m.email}</div>

      <span className="member-role">{m.role}</span>
    </div>
  ))}
</div>



            <hr />

            <h6 className="fw-bold mb-3">Yeni Üye Ekle</h6>

            {availableUsers.length === 0 ? (
              <div className="text-muted">Eklenecek kullanıcı yok.</div>
            ) : (
              <div className="add-member-list">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`add-member-card ${selectedUserIds.includes(user.id) ? 'selected' : ''
                      }`}
                    onClick={() => toggleUser(user.id)}
                  >
                    <div className="member-avatar-sm">
                      {user.username?.[0]?.toUpperCase()}
                    </div>

                    <div>
                      <div className="fw-semibold">{user.username}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn mt-3 text-white"
              disabled={selectedUserIds.length === 0}
              onClick={handleAddMembers}
              style={{
                backgroundColor: '#E92B63',
                borderColor: '#E92B63',
                opacity: selectedUserIds.length === 0 ? 0.6 : 1,
                cursor:
                  selectedUserIds.length === 0
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Üye Ekle
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsEditContent;
