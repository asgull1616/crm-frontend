"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEdit3, FiTrash2, FiMoreHorizontal, FiPlus } from "react-icons/fi";
import Swal from 'sweetalert2';

// Bileşenler
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import CardLoader from "@/components/shared/CardLoader";

// Servisler
import { proposalService } from "@/lib/services/proposal.service";

// Durum eşleştirme (Backend'deki ProposalStatus Enum ile tam uyumlu)
const statusMap = {
  DRAFT: { label: "Taslak", class: "bg-warning-subtle text-warning border-warning-subtle" },
  SENT: { label: "Gönderildi", class: "bg-info-subtle text-info border-info-subtle" },
  APPROVED: { label: "Onaylandı", class: "bg-success-subtle text-success border-success-subtle" },
  REJECTED: { label: "Reddedildi", class: "bg-danger-subtle text-danger border-danger-subtle" },
  EXPIRED: { label: "Süresi Doldu", class: "bg-secondary-subtle text-secondary border-secondary-subtle" },
};

const ProposalTable = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Veri Çekme Fonksiyonu
  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await proposalService.list({ page: 1, limit: 100, sortBy: 'createdAt', order: 'desc' });
      
      // Backend'deki yeni return yapısına göre veriyi alıyoruz: { data: { items: [...] } }
      const items = res?.data?.items || res?.data?.data || res?.data || [];
      
      setData(items);
    } catch (err) {
      console.error("Teklif listesi yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Silme İşlemi
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu teklif kalıcı olarak silinecektir.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E92B63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Vazgeç',
      reverseButtons: true,
      borderRadius: '12px'
    });

    if (result.isConfirmed) {
      try {
        await proposalService.remove(id);
        setData((prev) => prev.filter((item) => item.id !== id));
        
        Swal.fire({
          icon: 'success',
          title: 'Silindi!',
          text: 'Teklif başarıyla kaldırıldı.',
          timer: 1500,
          showConfirmButton: false
        });
        
        router.refresh();
      } catch (err) {
        Swal.fire('Hata!', 'Silme işlemi başarısız oldu.', 'error');
      }
    }
  };

  // Tablo Kolon Tanımları
  const columns = [
    {
      accessorKey: "id",
      header: "TEKLİF ID",
      cell: (info) => (
        <span className="fw-bold text-dark">
          #{info.getValue().slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "MÜŞTERİ",
      cell: (info) => (
        <div className="d-flex flex-column">
          <span className="fw-bold text-dark">{info.getValue() || "Bilinmeyen Müşteri"}</span>
          <small className="text-muted">{info.row.original.customerEmail}</small>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "KONU / BAŞLIK",
      cell: (info) => <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>{info.getValue()}</span>
    },
    {
      accessorKey: "totalAmount",
      header: "TUTAR",
      cell: (info) => (
        <span className="fw-bold text-dark">
          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: info.row.original.currency || 'TRY' }).format(info.getValue() || 0)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "DURUM",
      cell: (info) => {
        const status = info.getValue();
        const meta = statusMap[status] || { label: status, class: "bg-secondary text-white" };
        return (
          <span className={`badge border ${meta.class} px-3 py-2`} style={{ borderRadius: '8px', fontSize: '11px' }}>
            {meta.label}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "TARİH",
      cell: (info) => (
        <div className="text-muted small">
          {new Date(info.getValue()).toLocaleDateString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-end">İŞLEMLER</div>,
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Link 
            href={`/proposals/view/${row.original.id}`} 
            className="btn btn-sm btn-light-primary avatar-text avatar-md"
            title="Görüntüle"
          >
            <FiEye />
          </Link>
          <Dropdown
            dropdownItems={[
              { 
                label: "Düzenle", 
                icon: <FiEdit3 />, 
                onClick: () => router.push(`/proposals/edit/${row.original.id}`) 
              },
              { type: "divider" },
              { 
                label: "Sil", 
                icon: <FiTrash2 />, 
                variant: "danger", 
                onClick: () => handleDelete(row.original.id) 
              }
            ]}
            triggerIcon={<FiMoreHorizontal />}
            triggerClass="btn btn-sm btn-light avatar-md"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="position-relative">
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold text-dark">Teklif Yönetimi</h5>
            <small className="text-muted">Toplam {data.length} teklif listeleniyor</small>
          </div>
          <button 
            onClick={() => router.push('/proposals/create')}
            className="btn btn-pink d-flex align-items-center gap-2"
          >
            <FiPlus /> Yeni Teklif Oluştur
          </button>
        </div>
        
        <div className="card-body p-0">
          <Table data={data} columns={columns} />
        </div>
        
        {loading && <CardLoader refreshKey={loading} />}
      </div>

      <style jsx global>{`
        .btn-pink {
          background-color: #E92B63;
          color: white;
          border-radius: 10px;
          font-weight: 600;
          padding: 8px 20px;
          transition: all 0.2s;
        }
        .btn-pink:hover {
          background-color: #d12255;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(233, 43, 99, 0.2);
        }
        .bg-warning-subtle { background-color: #fff3cd !important; }
        .bg-success-subtle { background-color: #d1e7dd !important; }
        .bg-info-subtle { background-color: #cff4fc !important; }
        .bg-danger-subtle { background-color: #f8d7da !important; }
      `}</style>
    </div>
  );
};

export default ProposalTable;