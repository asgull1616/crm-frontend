"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit3, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import { proposalService } from "@/lib/services/proposal.service";

/* 🔹 Status mapper */
const mapStatus = (status) => {
  switch (status) {
    case "DRAFT":
      return { content: "Taslak", color: "bg-warning" };
    case "SENT":
      return { content: "Gönderildi", color: "bg-info" };
    case "APPROVED":
      return { content: "Onaylandı", color: "bg-success" };
    case "REJECTED":
      return { content: "Reddedildi", color: "bg-danger" };
    default:
      return { content: status, color: "bg-secondary" };
  }
};

const ProposalTable = () => {
  const router = useRouter();

  const getActions = (id) => [
    {
      label: "Düzenle",
      icon: <FiEdit3 />,
      onClick: () => router.push(`/proposal/edit/${id}`),
    },
    { type: "divider" },
    {
      label: "Sil",
      icon: <FiTrash2 />,
      variant: "danger",
      onClick: () => handleDelete(id),
    },
  ];
  const handleDelete = async (id) => {
    const ok = window.confirm("Bu teklifi silmek istiyor musunuz?");
    if (!ok) return;

    try {
      await proposalService.remove(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız");
    }
  };

  const [data, setData] = useState([]);

  /* 🔹 Fetch proposals */
  useEffect(() => {
    proposalService.list({ page: 1, limit: 10 }).then((res) => {
      const items = res?.data?.items || [];

      const mappedData = items.map((p) => ({
        id: p.id,
        proposal: p.id.slice(0, 8),
        client: {
          name: p.customerName,
          email: p.customerEmail,
        },
        subject: p.title,
        amount: p.totalAmount ? `${p.currency} ${p.totalAmount}` : "-",
        date: new Date(p.createdAt).toLocaleDateString("tr-TR"),
        status: mapStatus(p.status),
      }));

      setData(mappedData);
    });
  }, []);

  /* 🔹 Table columns */
  const columns = [
    {
      accessorKey: "id",
      header: ({ table }) => {
        const checkboxRef = useRef(null);

        const isSomeSelected = table.getIsSomeRowsSelected();

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = isSomeSelected;
          }
        }, [isSomeSelected]);

        return (
          <input
            type="checkbox"
            ref={checkboxRef}
            className="custom-table-checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        );
      },
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: {
        headerClassName: "width-30",
      },
    },
    {
      accessorKey: "proposal",
      header: () => "Teklif ID",
      cell: (info) => <span className="fw-bold">{info.getValue()}</span>,
    },
    {
      accessorKey: "client",
      header: () => "Müşteri",
      cell: (info) => {
        const client = info.getValue();
        return (
          <div className="hstack gap-3">
            <div className="avatar-text avatar-md text-white">
              {client?.name?.substring(0, 1)}
            </div>
            <div>
              <span className="text-truncate-1-line">{client?.name}</span>
              <small className="fs-12 fw-normal text-muted">
                {client?.email}
              </small>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "subject",
      header: () => "Konu",
    },
    {
      accessorKey: "amount",
      header: () => "Tutar",
      meta: {
        className: "fw-bold text-dark",
      },
    },
    {
      accessorKey: "date",
      header: () => "Oluşturulma Tarihi",
    },
    {
      accessorKey: "status",
      header: () => "Durum",
      cell: (info) => (
        <span className={`badge ${info.getValue().color}`}>
          {info.getValue().content}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: () => "Eylemler",
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Link
            href={`/proposal/view/${row.original.id}`}
            className="avatar-text avatar-md"
          >
            <FiEye />
          </Link>

          <Dropdown
            dropdownItems={getActions(row.original.id)}
            triggerIcon={<FiMoreHorizontal />}
            triggerClass="avatar-md"
            triggerPosition="0,21"
          />
        </div>
      ),
      meta: {
        headerClassName: "text-end",
      },
    },
  ];

  return <Table data={data} columns={columns} />;
};

export default ProposalTable;
