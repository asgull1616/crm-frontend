'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import Dropdown from '@/components/shared/Dropdown';
import {
  FiMoreHorizontal,
  FiEye,
  FiTrash2,
  FiEdit,
  FiUserPlus,
} from 'react-icons/fi';
import { teamService } from '@/lib/services/team.service';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';

/* ---------------------------------------
   Avatar Stack
--------------------------------------- */
const AvatarStack = ({ members = [], max = 3 }) => {
  const visible = members.slice(0, max);
  const extra = members.length - visible.length;

  return (
    <div className="avatar-stack">
      {visible.map((m) =>
        m.avatarUrl ? (
          <img
            key={m.id}
            src={m.avatarUrl}
            className="avatar"
            title={m.name || m.email}
          />
        ) : (
          <div key={m.id} className="avatar avatar-initial">
            {(m.name || m.email || '?')[0].toUpperCase()}
          </div>
        )
      )}

      {extra > 0 && (
        <div className="avatar avatar-extra">+{extra}</div>
      )}
    </div>
  );
};

/* ---------------------------------------
   Teams Table
--------------------------------------- */
const TeamsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
const [deleteId, setDeleteId] = useState(null);

  /* --------- USER ROLE --------- */
  useEffect(() => {
    authService.me().then((res) => {
      setIsAdmin(res.data.role === 'ADMIN');
    });
  }, []);

  /* --------- TEAMS LIST --------- */
  useEffect(() => {
    teamService
      .list()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  /* --------- DELETE (ADMIN ONLY) --------- */
const confirmDelete = async () => {
  if (!deleteId) return;

  await teamService.remove(deleteId);
  setData((prev) => prev.filter((t) => t.id !== deleteId));
  setDeleteId(null);
};


  /* --------- TABLE COLUMNS --------- */
  const columns = [
    {
      accessorKey: 'name',
      header: () => 'Ekip',
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-2">
          <div className="team-avatar-circle">
            {row.original.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="fw-semibold">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'members',
      header: () => 'Üyeler',
      cell: ({ row }) => (
        <AvatarStack members={row.original.members} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => 'Oluşturulma Tarihi',
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleDateString('tr-TR'),
    },
    {
      id: 'actions',
      header: () => '',
      meta: { headerClassName: 'text-end' },
      cell: ({ row }) => (
        <div className="d-flex justify-content-end align-items-center gap-1">
          {/* HERKES */}
          <button
            className="btn btn-sm btn-action"
            title="Detay Göster"
            onClick={() =>
              router.push(`/teams/view/${row.original.id}`)
            }
          >
            <FiEye size={20} />
          </button>

          {/* SADECE ADMIN */}
          {isAdmin && (
            <>
              <button
                className="btn btn-sm btn-action"
                title="Üye Ekle"
                onClick={() =>
                  router.push(`/teams/edit/${row.original.id}`)
                }
              >
                <FiUserPlus size={20} />
              </button>

              <Dropdown
                triggerIcon={<FiMoreHorizontal size={24} />}
                triggerClassName="btn btn-sm btn-action"
                dropdownItems={[
                  {
                    label: 'Güncelle',
                    icon: <FiEdit size={20} />,
                    onClick: () =>
                      router.push(`/teams/edit/${row.original.id}`),
                  },
                  {
                    label: 'Sil',
                    icon: <FiTrash2 size={20} />,
                   onClick: () => setDeleteId(row.original.id),

                  },
                ]}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  if (!loading && data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        Henüz ekip oluşturulmadı.
      </div>
    );
  }

  return (
    <>
      <Table data={data} columns={columns} loading={loading} />
      {deleteId && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ekip Sil</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Bu ekibi silmek istediğinize emin misiniz?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );      
};

export default TeamsTable;
