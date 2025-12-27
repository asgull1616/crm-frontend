'use client'
import React, { useEffect } from 'react'
import Table from '@/components/shared/table/Table'
import {
  FiEye,
  FiEdit3,
  FiSend,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiFileText,
  FiTrash2,
    FiMoreHorizontal,
} from "react-icons/fi";
import Dropdown from '@/components/shared/Dropdown';
import { proposalTableData } from '@/utils/fackData/proposalTableData';
import Link from 'next/link';


const actions = [
  { label: "Düzenle", icon: <FiEdit3 /> },
  { type: "divider" },
  { label: "Müşteriye Gönder", icon: <FiSend /> },
  { label: "Tekrar Gönder", icon: <FiRefreshCw /> },
  { type: "divider" },
  { label: "Onayla", icon: <FiCheckCircle />, variant: "success" },
  { label: "Reddet", icon: <FiXCircle />, variant: "danger" },
  { type: "divider" },
  { label: "Not Ekle", icon: <FiMessageSquare /> },
  { label: "PDF İndir", icon: <FiFileText /> },
  { type: "divider" },
  { label: "Sil", icon: <FiTrash2 />, variant: "danger" },
];


const ProposalTable = () => {
  const columns = [
    {
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = React.useRef(null);

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
          }
        }, [table.getIsSomeRowsSelected()]);

        return (
          <input
            type="checkbox"
            className="custom-table-checkbox"
            ref={checkboxRef}
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
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: {
        headerClassName: 'width-30',
      },
    },


    {
      accessorKey: 'proposal',
      header: () => 'Teklif ID',
      cell: (info) => <a href='#' className='fw-bold'>{info.getValue()}</a>
    },
    {
      accessorKey: 'client',
      header: () => 'Müşteri',
      cell: (info) => {
        const roles = info.getValue();
        return (
          <a href="#" className="hstack gap-3">
            {
              roles?.img ?
                <div className="avatar-image avatar-md">
                  <img src={roles?.img} alt="" className="img-fluid" />
                </div>
                :
                <div className="text-white avatar-text user-avatar-text avatar-md">{roles?.name.substring(0, 1)}</div>
            }
            <div>
              <span className="text-truncate-1-line">{roles?.name}</span>
              <small className="fs-12 fw-normal text-muted">{roles?.email}</small>
            </div>
          </a>
        )
      }
    },
    {
      accessorKey: 'subject',
      header: () => 'Konu',
    },
    {
      accessorKey: 'amount',
      header: () => 'Tutar',
      meta: {
        className: "fw-bold text-dark"
      }
    },
    {
      accessorKey: 'date',
      header: () => 'Oluşturulma Tarihi',
    },
    {
      accessorKey: 'status',
      header: () => 'Durum',
      cell: (info) => <div className={`badge ${info.getValue().color}`}>{info.getValue().content}</div>
    },
    {
      accessorKey: 'actions',
      header: () => "Eylemler",
      cell: info => (
        <div className="hstack gap-2 justify-content-end">
          <a href="#" className="avatar-text avatar-md" data-bs-toggle="offcanvas" data-bs-target="#proposalSent">
            <FiSend />
          </a>
          <Link href="/proposal/view" className="avatar-text avatar-md">
            <FiEye />
          </Link>
          <Dropdown dropdownItems={actions} triggerIcon={<FiMoreHorizontal />} triggerClass='avatar-md' triggerPosition={"0,21"} />
        </div>
      ),
      meta: {
        headerClassName: 'text-end'
      }
    },
  ]
  return (
    <>
      <Table data={proposalTableData} columns={columns} />
    </>
  )
}

export default ProposalTable