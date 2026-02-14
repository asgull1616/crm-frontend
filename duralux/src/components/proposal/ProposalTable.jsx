"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FiEye, FiEdit3, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import { proposalService } from "@/lib/services/proposal.service";
import Swal from 'sweetalert2';

const mapStatus = (status) => {
  switch (status) {
    case "DRAFT": return { content: "Taslak", color: "bg-warning" };
    case "SENT": return { content: "Gönderildi", color: "bg-info" };
    case "APPROVED": return { content: "Onaylandı", color: "bg-success" };
    case "REJECTED": return { content: "Reddedildi", color: "bg-danger" };
    default: return { content: status || "Belirsiz", color: "bg-secondary" };
  }
};

const ProposalTable = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      // Sadece teklifleri çekiyoruz. Backend zaten müşteri adını (customerName) içine ekledi.
      const res = await proposalService.list({ page: 1, limit: 100 });
      
      // Backend yapına göre veriyi güvenli bir şekilde alalım
      const proposals = res?.data?.items || res?.data?.data || res?.data || [];

      const mappedData = Array.isArray(proposals) ? proposals.map((p) => ({
        id: p.id,
        // ID'nin son 8 hanesini büyük harf yap (Profesyonel görünüm)
        proposal: p.id ? p.id.toString().slice(-8).toUpperCase() : "ID-YOK",
        client: {
          id: p.customerId,
          name: p.customerName || "Bilinmeyen Müşteri",
        },
        subject: p.title || "CRM Projesi",
        amount: p.totalAmount ? `₺${Number(p.totalAmount).toLocaleString('tr-TR')}` : "-",
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("tr-TR") : "-",
        status: mapStatus(p.status),
      })) : [];

      setData(mappedData);
    } catch (err) {
      console.error("Teklif listesi yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu teklif silinecektir.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E92B63',
      cancelButtonColor: '#adb5bd',
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'Vazgeç',
      reverseButtons: true,
      borderRadius: '12px'
    });

    if (result.isConfirmed) {
      try {
        await proposalService.remove(id);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire({ icon: 'success', title: 'Başarıyla silindi', timer: 1500, showConfirmButton: false });
        router.refresh();
      } catch (err) {
        Swal.fire({ title: 'Hata!', text: 'İşlem başarısız oldu.', icon: 'error' });
      }
    }
  };

  const columns = [
    { accessorKey: "proposal", header: "TEKLİF ID", cell: (info) => <span className="fw-bold text-dark">{info.getValue()}</span> },
    {
      accessorKey: "client",
      header: "MÜŞTERİ",
      cell: (info) => (
        <Link href={`/customers/view/${info.getValue().id}`} className="fw-bold text-dark text-decoration-none hover-pink">
          {info.getValue().name}
        </Link>
      ),
    },
    { accessorKey: "subject", header: "KONU" },
    { accessorKey: "amount", header: "TUTAR", meta: { className: "fw-bold text-dark" } },
    { accessorKey: "date", header: "TARİH" },
    { accessorKey: "status", header: "DURUM", cell: (info) => <span className={`badge ${info.getValue().color}`}>{info.getValue().content}</span> },
    {
      accessorKey: "actions",
      header: "İŞLEMLER",
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Link href={`/proposal/view/${row.original.id}`} className="avatar-text avatar-md"><FiEye /></Link>
          <Dropdown
            dropdownItems={[
              { label: "Düzenle", icon: <FiEdit3 />, onClick: () => router.push(`/proposal/edit/${row.original.id}`) },
              { type: "divider" },
              { label: "Sil", icon: <FiTrash2 />, variant: "danger", onClick: () => handleDelete(row.original.id) }
            ]}
            triggerIcon={<FiMoreHorizontal />}
            triggerClass="avatar-md"
          />
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <>
      <Table data={data} columns={columns} />
      <style jsx global>{` .hover-pink:hover { color: #E92B63 !important; text-decoration: underline !important; } `}</style>
    </>
  );
};

export default ProposalTable;