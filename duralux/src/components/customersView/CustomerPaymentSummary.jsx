"use client";
import React, { useEffect, useState } from "react";
import { FiTrendingUp, FiCheckCircle, FiClock, FiMinusCircle } from "react-icons/fi";
import { proposalService } from "@/lib/services/proposal.service";
import { transactionService } from "@/lib/services/transaction.service";

const CustomerPaymentSummary = ({ customerId }) => {
  const [stats, setStats] = useState({ sales: 0, collected: 0, pending: 0 });

  useEffect(() => {
    if (customerId) fetchStats();
  }, [customerId]);

  const fetchStats = async () => {
    try {
      const [propRes, transRes] = await Promise.all([
        proposalService.list({ limit: 100 }),
        transactionService.list({ customerId, limit: 1000 })
      ]);

      const proposals = propRes.data?.items?.filter(p => String(p.customerId) === String(customerId)) || [];
      const transactions = transRes.data?.items || transRes.data || [];

      const totalSales = proposals.reduce((acc, curr) => acc + (parseFloat(curr.totalAmount) || 0), 0);
      const totalCollected = transactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

      setStats({
        sales: totalSales,
        collected: totalCollected,
        pending: totalSales - totalCollected
      });
    } catch (error) {
      console.error("Özet yüklenemedi:", error);
    }
  };

  const cards = [
    { label: "Toplam Satış", value: stats.sales, color: "#6366F1", icon: <FiTrendingUp /> },
    { label: "Toplam Tahsilat", value: stats.collected, color: "#10B981", icon: <FiCheckCircle /> },
    { label: "Bekleyen Ödeme", value: stats.pending, color: "#F59E0B", icon: <FiClock /> },
    { label: "Toplam Gider", value: 0, color: "#EF4444", icon: <FiMinusCircle /> },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((c, i) => (
        <div key={i} className="col-md-3 text-center">
          <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "20px" }}>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <span style={{ color: c.color }}>{c.icon}</span>
              <small className="text-muted fw-bold" style={{ fontSize: '9px' }}>{c.label}</small>
            </div>
            <h6 className="fw-bold mb-0">{c.value.toLocaleString()} ₺</h6>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerPaymentSummary;