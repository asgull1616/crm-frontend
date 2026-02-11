"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit3, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import { proposalService } from "@/lib/services/proposal.service";
import { customerService } from "@/lib/services/customer.service"; // Müşteri servisi gerekli

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Önce tüm müşterileri çekiyoruz (ID'leri isimle eşleştirmek için)
        const customerRes = await customerService.list();
        const customers = customerRes?.data?.items || customerRes?.data?.data || customerRes?.data || [];

        // 2. Teklif listesini çekiyoruz
        const proposalRes = await proposalService.list({ page: 1, limit: 10 });
        const proposals = proposalRes?.data?.items || proposalRes?.data?.data || proposalRes?.data || [];

        const mappedData = proposals.map((p) => {
          // İsim üzerinden müşteri listesinde arama yapıyoruz
          const matched = customers.find(c => 
            c.fullName?.trim().toLowerCase() === p.customerName?.trim().toLowerCase()
          );

          return {
            id: p.id,
            proposal: p.id?.slice(0, 8),
            client: {
              // Eşleşen müşteri varsa onun ID'sini, yoksa teklifteki ID'yi al
              id: matched?.id || p.customerId, 
              name: p.customerName || matched?.fullName || "Bilinmeyen Müşteri",
              email: p.customerEmail || matched?.email || "",
            },
            subject: p.title,
            amount: p.totalAmount ? `TRY ${p.totalAmount}` : "-",
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("tr-TR") : "-",
            status: mapStatus(p.status),
          };
        });

        setData(mappedData);
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "proposal",
      header: "Teklif ID",
      cell: (info) => <span className="fw-bold">{info.getValue()}</span>,
    },
    {
      accessorKey: "client",
      header: "Müşteri",
      cell: (info) => {
        const client = info.getValue();
        // ID bulunamazsa Link yerine sadece isim göster (Hata almamak için)
        if (!client?.id) {
          return <span className="fw-bold text-dark">{client?.name}</span>;
        }

        return (
          <div className="hstack gap-3">
            <Link 
              href={`/customers/view/${client.id}`} 
              className="text-truncate-1-line fw-bold text-dark text-decoration-none hover-link"
            >
              {client.name}
            </Link>
          </div>
        );
      },
    },
    { accessorKey: "subject", header: "Konu" },
    { accessorKey: "amount", header: "Tutar", meta: { className: "fw-bold text-dark" } },
    { accessorKey: "date", header: "Oluşturulma Tarihi" },
    {
      accessorKey: "status",
      header: "Durum",
      cell: (info) => (
        <span className={`badge ${info.getValue().color}`}>
          {info.getValue().content}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Eylemler",
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Link href={`/proposal/view/${row.original.id}`} className="avatar-text avatar-md">
            <FiEye />
          </Link>
          <Dropdown
            dropdownItems={[
              { label: "Düzenle", icon: <FiEdit3 />, onClick: () => router.push(`/proposal/edit/${row.original.id}`) },
              { type: "divider" },
              { label: "Sil", icon: <FiTrash2 />, variant: "danger", onClick: () => {} }
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
        .hover-link:hover { 
          color: #E92B63 !important; 
          text-decoration: underline !important; 
          cursor: pointer; 
        }
      `}</style>
    </>
  );
};

export default ProposalTable;