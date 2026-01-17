'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import Dropdown from '@/components/shared/Dropdown';
import { FiMoreHorizontal, FiEye, FiTrash2, FiEdit  } from 'react-icons/fi';
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
      header: () => 'Ekip Adı',
      cell: ({ row }) => (
        <div className="fw-semibold">
          {row.original.name}
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
      header: () => 'Oluşturulma',
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleDateString('tr-TR'),
    },
    {
      accessorKey: 'actions',
      header: () => '',
      meta: { headerClassName: 'text-end' },
      cell: ({ row }) => (
        <div className="hstack justify-content-end">
          <Dropdown
            triggerIcon={<FiMoreHorizontal />}
            dropdownItems={[
  {
    label: 'Detay Göster',
    icon: <FiEye />,
    onClick: () => router.push(`/teams/view/${row.original.id}`),
  },
  {
    label: 'Güncelle',
    icon: <FiEdit />,
    onClick: () => router.push(`/teams/edit/${row.original.id}`),
  },
  {
    label: 'Sil',
    icon: <FiTrash2 />,
    onClick: () => handleDelete(row.original.id),
  },
]}
          />
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

  return <Table data={data} columns={columns} loading={loading} />;
};

export default TeamsTable;