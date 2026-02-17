"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiEdit2,
  FiEye,
  FiChevronUp,
  FiChevronDown
} from "react-icons/fi";

import { TransactionType } from "../../lib/services/enums/transaction.enums";

export default function IncomeExpenseTable({ filters }) {

  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' }); // ✅ Sıralama State'i geri geldi
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCollected: 0,
    pendingPayment: 0,
    totalExpense: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        transactionService.list({ limit: 100 }),
        transactionService.summary() 
      ]);
      setItems(listRes?.data?.items || []);
      const s = statsRes?.data?.data || statsRes?.data || statsRes;
      if (s) {
        setStats({
          totalSales: Number(s.totalSales || 0),
          totalCollected: Number(s.totalCollected || 0),
          pendingPayment: Number(s.pendingPayment || 0),
          totalExpense: Number(s.totalExpense || 0),
        });
      }
    } catch (err) {
      console.error("Raporlama hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ✅ Toggle Özelliği
  const handleFilterClick = (filterId) => {
    setActiveFilter((prev) => (prev === filterId ? "ALL" : filterId));
  };

  // ✅ Sıralama Fonksiyonu
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const calculateDaysDiff = (dueDate) => {
    if (!dueDate) return 999999;
    const today = new Date().setHours(0,0,0,0);
    const target = new Date(dueDate).setHours(0,0,0,0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const processedItems = useMemo(() => {
  let filtered = [...items];

  // 🔎 SEARCH
  if (filters?.search) {
    const text = filters.search.toLowerCase();
    filtered = filtered.filter(item =>
      item.customer?.fullName?.toLowerCase().includes(text)
    );
  }

  // 📅 MONTH
  if (filters?.month) {
    filtered = filtered.filter(item => {
      const itemMonth = new Date(item.date).getMonth() + 1;
      return itemMonth === Number(filters.month);
    });
  }

  // 📆 YEAR
  if (filters?.year) {
    filtered = filtered.filter(item => {
      const itemYear = new Date(item.date).getFullYear();
      return itemYear === Number(filters.year);
    });
  }

  // 💰 TYPE (Gelir / Gider)
  if (filters?.type) {
    filtered = filtered.filter(item =>
      item.type === filters.type
    );
  }

  // 👤 CUSTOMER
  if (filters?.customerId) {
    filtered = filtered.filter(item =>
      item.customer?.id === filters.customerId
    );
  }

  // 🎯 ÜST KART FİLTRESİ (dokunmadık)
  if (activeFilter !== "ALL") {
    filtered = filtered.filter(item => {
      const remaining =
        Number(item.amount) - (Number(item.paidAmount) || 0);

      if (activeFilter === "INCOME")
        return item.type === TransactionType.INCOME;

      if (activeFilter === "EXPENSE")
        return item.type === TransactionType.EXPENSE;

      if (activeFilter === "PENDING")
        return remaining > 0;

      if (activeFilter === "COLLECTED")
        return Number(item.paidAmount) > 0;

      return true;
    });
  }

  // 📊 Sıralama (aynen bırakıyoruz)
  const sortableItems = [...filtered];

  sortableItems.sort((a, b) => {
    let aVal, bVal;

    if (sortConfig.key === 'remainingDays') {
      aVal = calculateDaysDiff(a.dueDate);
      bVal = calculateDaysDiff(b.dueDate);
    } else if (sortConfig.key === 'remainingAmount') {
      aVal = Number(a.amount) - Number(a.paidAmount || 0);
      bVal = Number(b.amount) - Number(b.paidAmount || 0);
    } else if (sortConfig.key === 'customer') {
      aVal = a.customer?.fullName || "";
      bVal = b.customer?.fullName || "";
    } else {
      aVal = a[sortConfig.key];
      bVal = b[sortConfig.key];
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sortableItems;

}, [items, activeFilter, sortConfig, filters]);


  const formatMoney = (amount) => {
    return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2 }).format(Number(amount) || 0) + " ₺";
  };

  const getRemainingDays = (dueDate) => {
    const diff = calculateDaysDiff(dueDate);
    if (dueDate === null || diff === 999999) return { text: "—", class: "text-muted opacity-50" };
    if (diff < 0) return { text: `${Math.abs(diff)} gün geçti`, class: "text-danger fw-bold" };
    if (diff === 0) return { text: "Bugün", class: "text-warning fw-bold" };
    return { text: `${diff} gün kaldı`, class: "text-secondary" };
  };

  return (
    <div className="col-12 px-3">
      {/* ÜST PANEL: PASTEL KARTLAR */}
      <div className="row g-3 mb-4">
        {[
          { id: "INCOME", label: "Toplam Satış", val: stats.totalSales, color: "#cfe2ff", text: "#084298", icon: <FiTrendingUp /> },
          { id: "COLLECTED", label: "Toplam Tahsilat", val: stats.totalCollected, color: "#d1e7dd", text: "#0f5132", icon: <FiCheckCircle /> },
          { id: "PENDING", label: "Bekleyen Ödeme", val: stats.pendingPayment, color: "#fff3cd", text: "#664d03", icon: <FiClock /> },
          { id: "EXPENSE", label: "Toplam Gider", val: stats.totalExpense, color: "#f8d7da", text: "#842029", icon: <FiTrendingDown /> },
        ].map((card) => {
          const isActive = activeFilter === card.id;
          return (
            <div className="col-md-3" key={card.id} style={{ cursor: 'pointer' }} onClick={() => handleFilterClick(card.id)}>
              <div 
                className="card border-0 shadow-sm transition-all h-100" 
                style={{ 
                  backgroundColor: card.color, 
                  opacity: activeFilter === "ALL" || isActive ? 1 : 0.5, // Saydamlık
                  transform: isActive ? 'translateY(-8px)' : 'none', // Animasyon
                  borderLeft: isActive ? `6px solid ${card.text}` : 'none',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="fw-bold text-uppercase" style={{ color: card.text, fontSize: '11px' }}>{card.label}</small>
                    <span style={{ color: card.text }}>{card.icon}</span>
                  </div>
                  <h4 className="fw-bold mb-0" style={{ color: card.text }}>{formatMoney(card.val)}</h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLO: SIRALAMA ÖZELLİĞİ AKTİF */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr className="small fw-bold text-uppercase text-muted">
                <th className="py-4 ps-4 pointer" onClick={() => requestSort('customer')}>
                  Müşteri {sortConfig.key === 'customer' && (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                </th>
                <th>Tür</th>
                <th className="pointer" onClick={() => requestSort('amount')}>
                  Toplam {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                </th>
                <th className="text-success opacity-75">Ödenen</th>
                <th className="text-danger opacity-75 pointer" onClick={() => requestSort('remainingAmount')}>
                  Kalan {sortConfig.key === 'remainingAmount' && (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                </th>
                <th>Vade</th>
                <th className="pointer text-primary" onClick={() => requestSort('remainingDays')}>
                   Kalan Gün {sortConfig.key === 'remainingDays' && (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                </th>
                <th>Durum</th>
                <th className="text-end pe-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {processedItems.map((x) => {
                const remainingAmount = Number(x.amount) - (Number(x.paidAmount) || 0);
                const dayInfo = getRemainingDays(x.dueDate);
                const isGecikti = dayInfo.text.includes("geçti");
                
                return (
                  <tr key={x.id} style={{ backgroundColor: isGecikti ? "#fff8f8" : "transparent" }}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{x.customer?.fullName || "—"}</div>
                      <small className="text-muted opacity-75">{x.description}</small>
                    </td>
                    <td>
                      <span className={`badge rounded-pill fw-medium ${x.type === TransactionType.INCOME ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '11px', padding: '5px 12px' }}>
                        {x.type === TransactionType.INCOME ? "Gelir" : "Gider"}
                      </span>
                    </td>
                    <td className="fw-bold text-secondary">{formatMoney(x.amount)}</td>
                    <td className="text-success opacity-75">{formatMoney(x.paidAmount || 0)}</td>
                    <td className="text-danger opacity-75 fw-medium">{formatMoney(remainingAmount)}</td>
                    <td className="text-muted small">{x.dueDate ? new Date(x.dueDate).toLocaleDateString("tr-TR") : "—"}</td>
                    <td className={`small ${dayInfo.class}`}>{dayInfo.text}</td>
                    <td>
                        <span className={`badge opacity-75 ${remainingAmount <= 0 ? 'bg-success' : isGecikti ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {remainingAmount <= 0 ? 'Ödendi' : isGecikti ? 'Gecikti' : 'Bekliyor'}
                        </span>
                    </td>
                    <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-link text-muted p-0" onClick={() => router.push(`/income-expense/view/${x.id}`)}><FiEye size={18}/></button>
                            <button className="btn btn-sm btn-link text-primary p-0" onClick={() => router.push(`/income-expense/edit/${x.id}`)}><FiEdit2 size={16}/></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .pointer { cursor: pointer; }
        .pointer:hover { background-color: rgba(0,0,0,0.02); }
      `}</style>
    </div>
  );
}