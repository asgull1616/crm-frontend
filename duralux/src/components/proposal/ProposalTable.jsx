'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
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
import { useRouter, usePathname } from 'next/navigation'
import { proposalService } from '@/lib/services/proposal.service'

/* 🔹 Status mapper */
const mapStatus = (status) => {
  switch (status) {
    case 'DRAFT': return { content: 'Taslak', color: 'bg-warning' }
    case 'SENT': return { content: 'Gönderildi', color: 'bg-info' }
    case 'APPROVED': return { content: 'Onaylandı', color: 'bg-success' }
    case 'REJECTED': return { content: 'Reddedildi', color: 'bg-danger' }
    default: return { content: status, color: 'bg-secondary' }
  }
}

const ProposalTable = () => {
  const [data, setData] = useState([])
  const router = useRouter()
  const pathname = usePathname()

  /* 🔹 Veri çekme fonksiyonu */
  const fetchProposals = useCallback(async () => {
    try {
      console.log("🔄 API'den teklif listesi isteniyor...");
      
      // Cache'i kırmak için timestamp (t) ekliyoruz
      const res = await proposalService.list({ page: 1, limit: 10, t: Date.now() });
      
      const items = res?.data?.items || [];
      console.log("📥 Backend'den gelen ham veri (items):", items);

      const mapped = items.map((p) => {
        // 🔍 Her bir satır için müşteri adını kontrol et
        console.log(`ID: ${p.id.slice(0,8)} | Başlık: ${p.title} | Müşteri: ${p.customerName}`);
        
        return {
          id: p.id,
          proposal: p.id.slice(0, 8),
          client: {
            // Eğer p.customerName değişmiyorsa backend ilişkisi güncellenmiyordur
            name: p.customerName || "İsim Yok",
            email: p.customerEmail || "",
            img: null,
          },
          subject: p.title,
          amount: p.totalAmount ? `${p.currency || 'TRY'} ${p.totalAmount}` : '-',
          date: new Date(p.createdAt).toLocaleDateString('tr-TR'),
          status: mapStatus(p.status),
        };
      });

      setData(mapped);
      console.log("✅ Tablo verisi state'e başarıyla set edildi.");
    } catch (error) {
      console.error('❌ Liste çekme hatası:', error);
    }
  }, []);

  /* 🔹 Sayfaya giriş ve rota değişimlerinde tetiklenir */
  useEffect(() => {
    console.log("📍 Rota değişti veya sayfa yüklendi:", pathname);
    fetchProposals();
  }, [fetchProposals, pathname]);

  /* 🔹 Silme İşlemi */
  const handleDelete = async (id) => {
    if (confirm('Bu teklifi silmek istediğinize emin misiniz?')) {
      try {
        console.log("🗑️ Silme isteği gönderiliyor ID:", id);
        await proposalService.remove(id);
        fetchProposals(); 
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  }

  const columns = [
    {
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = useRef(null)
        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected()
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
      meta: { headerClassName: 'width-30' },
    },
    {
      accessorKey: 'proposal',
      header: () => 'Teklif ID',
      cell: (info) => <span className="fw-bold">{info.getValue()}</span>,
    },
    {
      accessorKey: 'client',
      header: () => 'Müşteri',
      cell: (info) => {
        const c = info.getValue();
        return (
          <div className="hstack gap-3 text-start">
            <div className="text-white avatar-text avatar-md">
              {c?.name?.substring(0, 1)}
            </div>
            <div>
              <span className="text-truncate-1-line fw-semibold">{c?.name}</span>
              <small className="fs-12 fw-normal text-muted">{c?.email}</small>
            </div>
          </div>
        );
      },
    },
    { accessorKey: 'subject', header: () => 'Konu' },
    {
      accessorKey: 'amount',
      header: () => 'Tutar',
      meta: { className: 'fw-bold text-dark' },
    },
    { accessorKey: 'date', header: () => 'Tarih' },
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
      cell: ({ row }) => {
        const rowId = row.original.id;
        const dynamicActions = [
          { label: 'Düzenle', icon: <FiEdit3 />, onClick: () => router.push(`/proposal/edit/${rowId}`) },
          { type: 'divider' },
          { label: 'Müşteriye Gönder', icon: <FiSend /> },
          { label: 'Sil', icon: <FiTrash2 />, variant: 'danger', onClick: () => handleDelete(rowId) },
        ];

        return (
          <div className="hstack gap-2 justify-content-end">
            <Link href={`/proposal/view/${rowId}`} className="avatar-text avatar-md"><FiEye /></Link>
            <Dropdown dropdownItems={dynamicActions} triggerIcon={<FiMoreHorizontal />} triggerClass="avatar-md" triggerPosition="0,21" />
          </div>
        );
      },
      meta: { headerClassName: 'text-end' },
    },
  ]

  return (
    <div className="position-relative">
       {/* Manuel Yenileme butonu ekledim, logları takip etmek için kullanabilirsin */}
       <div className="d-flex justify-content-end mb-2">
         <button onClick={fetchProposals} className="btn btn-sm btn-light">
           <FiRefreshCw className="me-1" /> Veriyi Zorla Yenile
         </button>
       </div>
       <Table data={data} columns={columns} />
    </div>
  )
}

export default ProposalTable;