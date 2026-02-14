"use client";

import React, { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiBarChart2 } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { transactionService } from "@/lib/services/transaction.service";

export default function TransactionSummaryGraph() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCollected: 0,
    pendingPayment: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await transactionService.summary();
        const s = res?.data?.data || res?.data || res;
        if (s) {
          setStats({
            totalSales: Number(s.totalSales || 0),
            totalCollected: Number(s.totalCollected || 0),
            pendingPayment: Number(s.pendingPayment || 0),
            totalExpense: Number(s.totalExpense || 0),
          });
        }
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: "Tahsil Edilen", value: stats.totalCollected, color: "#10b981" }, // Daha modern bir yeşil
    { name: "Bekleyen", value: stats.pendingPayment, color: "#f59e0b" },    // Daha modern bir sarı
    { name: "Giderler", value: stats.totalExpense, color: "#f43f5e" },      // Daha modern bir kırmızı
  ];

  const formatMoney = (val) => 
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);

  if (loading) return (
    <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: "16px" }}>
        <div className="spinner-border text-primary mx-auto" role="status"></div>
        <p className="mt-3 text-muted">Finansal veriler hazırlanıyor...</p>
    </div>
  );

  return (
    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
      {/* BAŞLIK KISMI */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
            <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>Finansal Özet</h5>
            <p className="text-muted small mb-0">Gelir, gider ve tahsilat durumunuzun genel görünümü</p>
        </div>
        <div className="bg-light p-2 rounded-3 text-primary">
            <FiBarChart2 size={20} />
        </div>
      </div>

      <div className="row align-items-center">
        {/* SOL TARAF: KARTLAR */}
        <div className="col-lg-7">
          <div className="row g-3">
            {[
              { label: "Toplam Satış", val: stats.totalSales, color: "#cfe2ff", text: "#084298", icon: <FiTrendingUp /> },
              { label: "Toplam Tahsilat", val: stats.totalCollected, color: "#d1e7dd", text: "#0f5132", icon: <FiCheckCircle /> },
              { label: "Bekleyen Ödeme", val: stats.pendingPayment, color: "#fff3cd", text: "#664d03", icon: <FiClock /> },
              { label: "Toplam Gider", val: stats.totalExpense, color: "#f8d7da", text: "#842029", icon: <FiTrendingDown /> },
            ].map((card, idx) => (
              <div className="col-sm-6" key={idx}>
                <div className="p-3 shadow-sm h-100 transition-all" 
                     style={{ 
                        backgroundColor: card.color, 
                        borderRadius: "12px",
                        border: "1px solid rgba(0,0,0,0.03)"
                     }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="fw-bold text-uppercase opacity-75" style={{ color: card.text, fontSize: '10px' }}>{card.label}</small>
                    <span style={{ color: card.text }}>{card.icon}</span>
                  </div>
                  <h5 className="fw-bold mb-0" style={{ color: card.text }}>{formatMoney(card.val)}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ TARAF: GRAFİK */}
        <div className="col-lg-5 mt-4 mt-lg-0" style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={70} // Biraz daha ince bir donut halkası
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatMoney(value), "Miktar"]} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}