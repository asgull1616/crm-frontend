"use client";
import React, { useEffect, useState } from "react";
import { customerService } from "@/lib/services/customer.service"; // Yeni eklediğimiz metod burada

const CustomerPaymentTable = ({ customerId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) fetchData();
  }, [customerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Backend'den direkt müşterinin işlemlerini çekiyoruz
      const res = await customerService.getTransactions(customerId, { limit: 100 });
      
      // JSON yapına göre veri res.data.items içinde geliyor
      setTransactions(res.data?.items || []);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Yükleniyor...</div>;

  return (
    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "25px", background: "#fff" }}>
      <h6 className="fw-bold mb-4">Ödeme Geçmişi</h6>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr className="text-muted small border-bottom">
              <th>Proje</th>
              <th>Tür</th>
              <th>Toplam Tutar</th>
              <th>Ödenen</th>
              <th>Kalan</th>
              <th>Son Tarih</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const amount = parseFloat(tx.amount) || 0;
              const paidAmount = parseFloat(tx.paidAmount) || 0;
              const balance = amount - paidAmount;
              
              return (
                <tr key={tx.id} className="border-bottom" style={{ fontSize: "13px" }}>
                  {/* Proposal bilgisini backend include ettiği için direkt çekiyoruz */}
                  <td className="fw-bold">{tx.proposal?.title || "Genel Ödeme"}</td>
                  <td>
                    <span className={tx.type === "INCOME" ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {tx.type === "INCOME" ? "Gelir" : "Gider"}
                    </span>
                  </td>
                  <td>{amount.toLocaleString()} {tx.currency}</td>
                  <td className="text-success fw-bold">{paidAmount.toLocaleString()} {tx.currency}</td>
                  <td className="fw-bold text-danger">
                    {balance > 0 ? balance.toLocaleString() : "0"} {tx.currency}
                  </td>
                  <td>{tx.dueDate ? new Date(tx.dueDate).toLocaleDateString('tr-TR') : "-"}</td>
                  <td>
                    <span className={`badge rounded-pill ${balance <= 0 ? "bg-success" : "bg-warning text-dark"}`}>
                      {balance <= 0 ? "Tamamlandı" : "Kısmi Ödeme"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">İşlem kaydı bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPaymentTable;