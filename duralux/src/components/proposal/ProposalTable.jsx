"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit3, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import { proposalService } from "@/lib/services/proposal.service";
import { customerService } from "@/lib/services/customer.service";
import Swal from 'sweetalert2';

const mapStatus = (status) => {
  switch (status) {
    case "DRAFT": return { content: "Taslak", color: "bg-warning" };
    case "SENT": return { content: "Gönderildi", color: "bg-info" };
    case "APPROVED": return { content: "Onaylandı", color: "bg-success" };
    case "REJECTED": return { content: "Reddedildi", color: "bg-danger" };
    default: return { content: status, color: "bg-secondary" };
  }
};

const ProposalTable = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  // 🔹 PEMBE SADE SİLME MODALI
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu teklif silinecektir.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E92B63',
      cancelButtonColor: '#adb5bd',
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'Vazgeç',
      reverseButtons: true,
      borderRadius: '12px',
      width: '380px'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await proposalService.remove(id);
          setData((prev) => prev.filter((item) => item.id !== id));
          router.refresh(); // Grafiğin güncellenmesi için Next.js'i tetikle

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
          });
          Toast.fire({ icon: 'success', title: 'Başarıyla silindi' });
        } catch (err) {
          Swal.fire({ title: 'Hata!', text: 'İşlem başarısız oldu.', icon: 'error', confirmButtonColor: '#E92B63' });
        }
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, proposalRes] = await Promise.all([
          customerService.list({ page: 1, limit: 1000 }),
          proposalService.list({ page: 1, limit: 100 })
        ]);

        // 🔹 BURASI KRİTİK: Verinin nerede olduğunu arıyoruz
        const customers = customerRes?.data?.items || customerRes?.data?.data || customerRes?.data || [];
        const proposals = proposalRes?.data?.items || proposalRes?.data?.data || proposalRes?.data || [];

        const mappedData = Array.isArray(proposals) ? proposals.map((p) => {
          const matched = customers.find(c => 
            c.id === p.customerId || 
            (p.customerName && c.fullName?.trim().toLowerCase() === p.customerName.trim().toLowerCase())
          );

          return {
            id: p.id,
            proposal: p.id?.slice(0, 8),
            client: {
              id: matched?.id || p.customerId, 
              name: matched?.fullName || p.customerName || "Bilinmeyen Müşteri",
            },
            subject: p.title || "CRM Projesi",
            amount: p.totalAmount ? `TRY ${p.totalAmount}` : "-",
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("tr-TR") : "-",
            status: mapStatus(p.status),
          };
        }) : [];

        setData(mappedData);
      } catch (err) {
        console.error("Tablo yükleme hatası:", err);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { accessorKey: "proposal", header: "TEKLİF ID", cell: (info) => <span className="fw-bold text-dark">{info.getValue()}</span> },
    {
      accessorKey: "client",
      header: "MÜŞTERİ",
      cell: (info) => {
        const client = info.getValue();
        return (
          <Link href={`/customers/view/${client.id}`} className="fw-bold text-dark text-decoration-none hover-pink">
            {client.name}
          </Link>
        );
      },
    },
    { accessorKey: "subject", header: "KONU" },
    { accessorKey: "amount", header: "TUTAR", meta: { className: "fw-bold text-dark" } },
    { accessorKey: "date", header: "TARİH" },
    { accessorKey: "status", header: "DURUM", cell: (info) => (
        <span className={`badge ${info.getValue().color}`}>{info.getValue().content}</span>
      )
    },
    {
      accessorKey: "actions",
      header: "İŞLEMLER",
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Link href={`/proposal/view/${row.original.id}`} className="avatar-text avatar-md">
            <FiEye />
          </Link>
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

  return (
    <>
      <Table data={data} columns={columns} />
      <style jsx global>{`
        .hover-pink:hover { color: #E92B63 !important; text-decoration: underline !important; cursor: pointer; }
      `}</style>
    </>
  );
};

export default ProposalTable;