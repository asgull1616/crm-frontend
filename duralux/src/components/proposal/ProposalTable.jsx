'use client'

import React, { useEffect, useState, useRef } from 'react'
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
} from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import Link from 'next/link'
import { proposalService } from '@/lib/services/proposal.service'

/* 🔹 Status mapper */
const mapStatus = (status) => {
  switch (status) {
    case 'DRAFT':
      return { content: 'Taslak', color: 'bg-warning' }
    case 'SENT':
      return { content: 'Gönderildi', color: 'bg-info' }
    case 'APPROVED':
      return { content: 'Onaylandı', color: 'bg-success' }
    case 'REJECTED':
      return { content: 'Reddedildi', color: 'bg-danger' }
    default:
      return { content: status, color: 'bg-secondary' }
  }
}

/* 🔹 Dropdown actions (şimdilik UI only) */
const actions = [
  { label: 'Düzenle', icon: <FiEdit3 /> },
  { type: 'divider' },
  { label: 'Müşteriye Gönder', icon: <FiSend /> },
  { label: 'Tekrar Gönder', icon: <FiRefreshCw /> },
  { type: 'divider' },
  { label: 'Onayla', icon: <FiCheckCircle />, variant: 'success' },
  { label: 'Reddet', icon: <FiXCircle />, variant: 'danger' },
  { type: 'divider' },
  { label: 'Not Ekle', icon: <FiMessageSquare /> },
  { label: 'PDF İndir', icon: <FiFileText /> },
  { type: 'divider' },
  { label: 'Sil', icon: <FiTrash2 />, variant: 'danger' },
]

const ProposalTable = () => {
  const [data, setData] = useState([])

  /* 🔹 Backend’ten liste çek */
  useEffect(() => {
    proposalService.list({ page: 1, limit: 10 }).then((res) => {
      const items = res?.data?.items || []

      const mapped = items.map((p) => ({
        id: p.id, // 🔑 GERÇEK ID (çok önemli)
        proposal: p.id.slice(0, 8),
        client: {
          name: p.customerName,
          email: p.customerEmail,
          img: null,
        },
        subject: p.title,
        amount: p.totalAmount
          ? `${p.currency} ${p.totalAmount}`
          : '-',
        date: new Date(p.createdAt).toLocaleDateString('tr-TR'),
        status: mapStatus(p.status),
      }))

      setData(mapped)
    })
  }, [])

  /* 🔹 Table columns */
  const columns = [
    {
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = useRef(null)

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate =
              table.getIsSomeRowsSelected()
          }
        }, [table.getIsSomeRowsSelected()])

        return (
          <input
            type="checkbox"
            className="custom-table-checkbox"
            ref={checkboxRef}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        )
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
        headerClassName: 'width-30',
      },
    },

    {
      accessorKey: 'proposal',
      header: () => 'Teklif ID',
      cell: (info) => (
        <span className="fw-bold">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'client',
      header: () => 'Müşteri',
      cell: (info) => {
        const c = info.getValue()
        return (
          <div className="hstack gap-3">
            <div className="text-white avatar-text avatar-md">
              {c?.name?.substring(0, 1)}
            </div>
            <div>
              <span className="text-truncate-1-line">{c?.name}</span>
              <small className="fs-12 fw-normal text-muted">
                {c?.email}
              </small>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'subject',
      header: () => 'Konu',
    },
    {
      accessorKey: 'amount',
      header: () => 'Tutar',
      meta: {
        className: 'fw-bold text-dark',
      },
    },
    {
      accessorKey: 'date',
      header: () => 'Oluşturulma Tarihi',
    },
    {
      accessorKey: 'status',
      header: () => 'Durum',
      cell: (info) => (
        <span className={`badge ${info.getValue().color}`}>
          {info.getValue().content}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: () => 'Eylemler',
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Link
            href={`/proposal/view/${row.original.id}`}
            className="avatar-text avatar-md"
          >
            <FiEye />
          </Link>

          <Dropdown
            dropdownItems={actions}
            triggerIcon={<FiMoreHorizontal />}
            triggerClass="avatar-md"
            triggerPosition="0,21"
          />
        </div>
      ),
      meta: {
        headerClassName: 'text-end',
      },
    },
  ]

  return <Table data={data} columns={columns} />
}

export default ProposalTable
