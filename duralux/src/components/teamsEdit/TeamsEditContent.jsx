'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
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

  /* -------------------------------
     TOGGLE USER (checkbox logic)
  -------------------------------- */
  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* -------------------------------
     ADD MEMBERS
  -------------------------------- */
  const handleAddMembers = async () => {
    await teamService.addMembers(teamId, selectedUserIds);

    const refreshed = await teamService.getById(teamId);
    setTeam(refreshed.data.data);
    setSelectedUserIds([]);
  };

  /* -------------------------------
     REMOVE MEMBER
  -------------------------------- */
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

  /* -------------------------------
     TABLE DATA
  -------------------------------- */
  const membersData = team.members.map((m) => ({
    id: m.user.id,
    username: m.user.username,
    email: m.user.email,
    role: m.user.role,
  }));

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
      accessorKey: 'actions',
      header: () => '',
      meta: { headerClassName: 'text-end' },
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleRemoveMember(row.original.id)}
        >
          <FiTrash2 />
        </button>
      ),
    },
  ];

  /* -------------------------------
     USERS NOT IN TEAM
  -------------------------------- */
  const memberIds = team.members.map((m) => m.user.id);
  const availableUsers = allUsers.filter(
    (u) => !memberIds.includes(u.id)
  );

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card stretch stretch-full">
          <div className="card-body">

            {/* TEAM INFO */}
            <h5 className="fw-bold mb-3">Ekip Bilgileri</h5>
            <p><strong>Ekip Adı:</strong> {team.name}</p>

            <hr />

            {/* MEMBERS */}
            <h6 className="fw-bold mb-3">Mevcut Üyeler</h6>
            <Table data={membersData} columns={columns} loading={false} />

            <hr />

            {/* ADD MEMBERS */}
            <h6 className="fw-bold mb-3">Yeni Üye Ekle</h6>

            {availableUsers.length === 0 && (
              <div className="text-muted">Eklenecek kullanıcı yok.</div>
            )}

            {availableUsers.map((user) => (
              <div key={user.id} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                <label className="form-check-label">
                  {user.username} ({user.email})
                </label>
              </div>
            ))}

            <button
              className="btn btn-primary mt-3"
              disabled={selectedUserIds.length === 0}
              onClick={handleAddMembers}
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
