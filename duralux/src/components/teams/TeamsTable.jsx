'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import Dropdown from '@/components/shared/Dropdown';
import { FiMoreHorizontal, FiEye, FiTrash2, FiEdit, FiUserPlus, FiBarChart2 } from 'react-icons/fi';
import { teamService } from '@/lib/services/team.service';
import { useRouter } from 'next/navigation';

const TeamsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    teamService
      .list()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (teamId) => {
    const ok = window.confirm('Bu ekibi silmek istiyor musunuz?');
    if (!ok) return;

    await teamService.remove(teamId);
    setData((prev) => prev.filter((t) => t.id !== teamId));
  };

  const columns = [
    {
      accessorKey: 'name',
      header: () => 'Ekip',
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-2">
          <div className="team-avatar-circle">
            {row.original.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="fw-semibold">{row.original.name}</div>
          </div>

        </div>
      ),
    },

    {
      accessorKey: 'members',
      header: () => 'Üye Sayısı',
      cell: ({ row }) => row.original.members.length,
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

          <button
            className="btn btn-sm btn-action"

            title="Detay Göster"
            onClick={() => router.push(`/teams/view/${row.original.id}`)}
          >
            <FiEye size={20} />
          </button>

          <button
            className="btn btn-sm btn-action"
            title="Üye Ekle"
            onClick={() => router.push(`/teams/${row.original.id}/members`)}
          >
            <FiUserPlus size={20} />
          </button>

          <button
            className="btn btn-sm btn-action"
            title="Performans"
            onClick={() => router.push(`/teams/${row.original.id}/performance`)}
          >
            <FiBarChart2 size={20} />
          </button>

          <Dropdown
            triggerIcon={<FiMoreHorizontal size={24} />}
            triggerClassName="btn btn-sm btn-action"
            dropdownItems={[
              {
                label: 'Güncelle',
                icon: <FiEdit size={20} />,
                onClick: () => router.push(`/teams/edit/${row.original.id}`),
              },
              {
                label: 'Sil',
                icon: <FiTrash2  size={20}/>,
                onClick: () => handleDelete(row.original.id),
              },
            ]}
          />


        </div>
      ),
    },

  ];

  if (!loading && data && data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        Henüz ekip oluşturulmadı.
      </div>
    );
  }

  return <Table data={data} columns={columns} loading={loading} />;
};

export default TeamsTable;