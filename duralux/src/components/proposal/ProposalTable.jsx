"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit3, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import { proposalService } from "@/lib/services/proposal.service";
import { customerService } from "@/lib/services/customer.service";

const mapStatus = (status) => {
  switch (status) {
    case "DRAFT": return { content: "Taslak", color: "bg-warning" };
    case "SENT": return { content: "Gönderildi", color: "bg-info" };
    case "APPROVED": return { content: "Onaylandı", color: "bg-success" };
    case "REJECTED": return { content: "Reddedildi", color: "bg-danger" };
    default: return { content: status || "Bilinmiyor", color: "bg-secondary" };
  }
};

const ProposalTable = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hem teklifleri hem de müşteri listesini paralel çekiyoruz
        const [proposalRes, customerRes] = await Promise.all([
          proposalService.list({ page: 1, limit: 100 }),
          customerService.list({ page: 1, limit: 100 })
        ]);

        // Verinin hangi seviyede olduğunu kontrol ediyoruz
        const proposals = proposalRes?.data?.items || proposalRes?.data?.data || proposalRes?.data || [];
        const customers = customerRes?.data?.items || customerRes?.data?.data || customerRes?.data || [];

        const mappedData = Array.isArray(proposals) ? proposals.map((p) => {
          // Müşteriyi ID veya isim üzerinden eşleştiriyoruz
          const matched = customers.find(c => 
            c.id === p.customerId || 
            (p.customerName && c.fullName?.trim().toLowerCase() === p.customerName.trim().toLowerCase())
          );

          return {
            id: p.id,
            proposal: p.id?.slice(0, 8) || "N/A",
            client: {
              id: matched?.id || p.customerId,
              name: p.customerName || matched?.fullName || "Bilinmeyen Müşteri",
            },
            subject: p.title || "CRM Projesi",
            amount: p.totalAmount ? `TRY ${p.totalAmount}` : "TRY 0",
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("tr-TR") : "-",
            status: mapStatus(p.status),
          };
        }) : [];

        setData(mappedData);
      } catch (err) {
        console.error("Teklif listesi yükleme hatası:", err);
        setData([]); // Hata durumunda tabloyu boşalt ama çökertme
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu teklifi silmek istediğinize emin misiniz?")) return;
    try {
      await proposalService.remove(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const columns = [
    {
      accessorKey: "proposal",
      header: "TEKLİF ID",
      cell: (info) => <span className="fw-bold text-dark">{info.getValue()}</span>,
    },
    {
      accessorKey: "client",
      header: "MÜŞTERİ",
      cell: (info) => {
        const client = info.getValue();
        return client?.id ? (
          <Link href={`/customers/view/${client.id}`} className="fw-bold text-dark text-decoration-none hover-pink">
            {client.name}
          </Link>
        ) : <span className="fw-bold text-dark">{client?.name}</span>;
      },
    },
    { accessorKey: "subject", header: "KONU" },
    { accessorKey: "amount", header: "TUTAR", meta: { className: "fw-bold text-dark" } },
    { accessorKey: "date", header: "OLUŞTURULMA TARİHİ" },
    {
      accessorKey: "status",
      header: "DURUM",
      cell: (info) => (
        <span className={`badge ${info.getValue().color}`}>
          {info.getValue().content}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "EYLEMLER",
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
        .hover-pink:hover { color: #E92B63 !important; text-decoration: underline !important; }
      `}</style>
    </>
  );
};

export default ProposalTable;