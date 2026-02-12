"use client";
import React, { useEffect, useState } from "react";
import { proposalService } from "@/lib/services/proposal.service";
import { transactionService } from "@/lib/services/transaction.service";

const CustomerPaymentTable = ({ customerId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) fetchData();
  }, [customerId]);

  const fetchData = async () => {
    try {
      // Hem teklifleri hem de bu müşteriye ait tüm işlemleri çekiyoruz
      const [propRes, transRes] = await Promise.all([
        proposalService.list({ limit: 100 }),
        transactionService.list({ customerId, limit: 1000 })
      ]);

      const allProposals = propRes.data?.items || [];
      const allTransactions = transRes.data?.items || transRes.data || [];

      const formattedData = allProposals
        .filter(p => String(p.customerId).toLowerCase() === String(customerId).toLowerCase())
        .map(proposal => {
          // Bu teklife yapılmış toplam ödemeleri topla
          const paidAmount = allTransactions
            .filter(t => String(t.proposalId) === String(proposal.id))
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

          return { ...proposal, paidAmount };
        });

      setData(formattedData);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "25px", background: "#fff" }}>
      <h6 className="fw-bold mb-4">Ödeme Geçmişi</h6>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr className="text-muted small border-bottom">
              <th>Proje</th>
              <th>Tür</th>
              <th>Toplam</th>
              <th>Ödenen</th>
              <th>Kalan Borç</th>
              <th>SON TARİH</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const total = parseFloat(item.totalAmount) || 0;
              const balance = total - item.paidAmount;
              return (
                <tr key={item.id} className="border-bottom" style={{ fontSize: "13px" }}>
                  <td className="fw-bold">{item.title}</td>
                  <td><span className="text-danger fw-bold">Gelir</span></td>
                  <td>{total.toLocaleString()} ₺</td>
                  <td className="text-success fw-bold">{item.paidAmount.toLocaleString()} ₺</td>
                  <td className="fw-bold text-danger">{balance > 0 ? balance.toLocaleString() : 0} ₺</td>
                  <td>
                    <span className={`badge rounded-pill bg-${balance <= 0 ? "success" : "warning"}`}>
                      {balance <= 0 ? "Ödendi" : "Bekliyor"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPaymentTable;