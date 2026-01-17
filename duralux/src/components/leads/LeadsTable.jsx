'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { teamService } from '@/lib/services/team.service';

const LeadsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamService
      .list()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    await teamService.updateRole(userId, role);
    setData((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const handleDelete = async (userId) => {
    await teamService.delete(userId);
    setData((prev) => prev.filter((u) => u.id !== userId));
  };

  const columns = [
    {
      accessorKey: 'username',
      header: () => 'Kullanıcı',
      cell: ({ row }) => {
        const user = row.original;
        const fullName = user.profile?.firstName
          ? `${user.profile.firstName} ${user.profile.lastName ?? ''}`
          : user.username;

        return (
          <div className="hstack gap-3">
            <div className="avatar-text avatar-md text-white">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold">{fullName}</div>
              <div className="text-muted small">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: () => 'Rol',
      cell: ({ row }) => (
        <SelectDropdown
          options={[
            { label: 'Admin', value: 'ADMIN' },
            { label: 'User', value: 'USER' },
          ]}
          defaultSelect={row.original.role}
          onSelectOption={(opt) =>
            handleRoleChange(row.original.id, opt.value)
          }
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => 'Oluşturulma',
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleDateString('tr-TR'),
    },
    {
      accessorKey: 'actions',
      header: () => 'Actions',
      meta: { headerClassName: 'text-end' },
      cell: ({ row }) => (
        <div className="hstack justify-content-end">
          <Dropdown
            triggerIcon={<FiMoreHorizontal />}
            dropdownItems={[
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

  return <Table data={data} columns={columns} loading={loading} />;
};

export default LeadsTable;
