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
  FiChevronDown,
  FiSearch,
  FiX
} from "react-icons/fi";

import { TransactionType } from "../../lib/services/enums/transaction.enums";

export default function IncomeExpenseTable() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
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
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFilterClick = (filterId) => {
    setActiveFilter((prev) => (prev === filterId ? "ALL" : filterId));
  };

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
    // 1. FİLTRELEME (Hem Kategori Hem Arama)
    let filtered = items.filter(item => {
      // ✅ AKILLI ARAMA: Hem Müşteri Adı hem Açıklama (Kategori altındaki metin) kontrol edilir
      const fullName = (item.customer?.fullName || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const searchMatch = fullName.includes(search) || description.includes(search);
      
      if (!searchMatch) return false;

      // Üst Kart Filtreleri
      if (activeFilter === "ALL") return true;
      const remaining = Number(item.amount) - (Number(item.paidAmount) || 0);
      if (activeFilter === "INCOME") return item.type === TransactionType.INCOME;
      if (activeFilter === "EXPENSE") return item.type === TransactionType.EXPENSE;
      if (activeFilter === "PENDING") return remaining > 0;
      if (activeFilter === "COLLECTED") return Number(item.paidAmount) > 0;
      return true;
    });

    // 2. SIRALAMA
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
  }, [items, activeFilter, searchTerm, sortConfig]);

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
      {/* ÜST PANEL KARTLAR */}
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
                className="card border-0 shadow-sm h-100" 
                style={{ 
                  backgroundColor: card.color, 
                  opacity: activeFilter === "ALL" || isActive ? 1 : 0.6,
                  transform: isActive ? 'translateY(-5px)' : 'none',
                  borderBottom: isActive ? `4px solid ${card.text}` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="fw-bold text-uppercase" style={{ color: card.text, fontSize: '10px', letterSpacing: '0.5px' }}>{card.label}</small>
                    <span style={{ color: card.text }}>{card.icon}</span>
                  </div>
                  <h4 className="fw-bold mb-0" style={{ color: card.text }}>{formatMoney(card.val)}</h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLO */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr className="small fw-bold text-uppercase text-muted">
                {/* ✅ MÜŞTERİ + AKILLI ARAMA BAŞLIĞI */}
                <th className="py-3 ps-4" style={{ minWidth: '320px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="pointer d-flex align-items-center flex-shrink-0" onClick={() => requestSort('customer')}>
                      Müşteri {sortConfig.key === 'customer' && (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </div>
                    
                    {/* Arama Kutusu */}
                    <div className="position-relative w-100">
                      <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" size={13} />
                      <input
                        type="text"
                        className="form-control form-control-sm border-0 ps-4 bg-white shadow-sm"
                        placeholder="Müşteri veya açıklama ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                          fontSize: '11px', 
                          borderRadius: '8px', 
                          border: '1px solid #e2e8f0',
                          paddingRight: '25px'
                        }}
                      />
                      {searchTerm && (
                        <FiX 
                          className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted pointer" 
                          size={13} 
                          onClick={() => setSearchTerm("")}
                        />
                      )}
                    </div>
                  </div>
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
                   Gün {sortConfig.key === 'remainingDays' && (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                </th>
                <th>Durum</th>
                <th className="text-end pe-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {processedItems.length > 0 ? processedItems.map((x) => {
                const remainingAmount = Number(x.amount) - (Number(x.paidAmount) || 0);
                const dayInfo = getRemainingDays(x.dueDate);
                const isGecikti = dayInfo.text.includes("geçti");
                
                return (
                  <tr key={x.id} style={{ backgroundColor: isGecikti ? "#fffcfc" : "transparent" }}>
                    <td className="ps-4">
                      {/* Müşteri İsmi */}
                      <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{x.customer?.fullName || "—"}</div>
                      {/* Altındaki Kategori/Açıklama Alanı (Aramaya dahil) */}
                      <small className="text-muted text-truncate d-block" style={{ fontSize: '11px', maxWidth: '200px' }}>{x.description}</small>
                    </td>
                    <td>
                      <span className={`badge rounded-pill fw-medium ${x.type === TransactionType.INCOME ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '10px', padding: '4px 10px' }}>
                        {x.type === TransactionType.INCOME ? "Gelir" : "Gider"}
                      </span>
                    </td>
                    <td className="fw-bold text-secondary" style={{ fontSize: '13px' }}>{formatMoney(x.amount)}</td>
                    <td className="text-success small">{formatMoney(x.paidAmount || 0)}</td>
                    <td className="text-danger fw-medium" style={{ fontSize: '13px' }}>{formatMoney(remainingAmount)}</td>
                    <td className="text-muted" style={{ fontSize: '12px' }}>{x.dueDate ? new Date(x.dueDate).toLocaleDateString("tr-TR") : "—"}</td>
                    <td className={`small fw-medium ${dayInfo.class}`}>{dayInfo.text}</td>
                    <td>
                        <span className={`badge ${remainingAmount <= 0 ? 'bg-success' : isGecikti ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '10px' }}>
                            {remainingAmount <= 0 ? 'Ödendi' : isGecikti ? 'Gecikti' : 'Bekliyor'}
                        </span>
                    </td>
                    <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-1">
                            <button className="btn btn-sm btn-light avatar-sm" onClick={() => router.push(`/income-expense/view/${x.id}`)} title="Görüntüle"><FiEye size={14}/></button>
                            <button className="btn btn-sm btn-light avatar-sm text-primary" onClick={() => router.push(`/income-expense/edit/${x.id}`)} title="Düzenle"><FiEdit2 size={14}/></button>
                        </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted small">
                    Aranan kriterlere uygun kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .pointer { cursor: pointer; }
        .pointer:hover { color: #000 !important; }
        .form-control:focus {
           border-color: #cbd5e1 !important;
           background-color: #fff !important;
           box-shadow: 0 0 0 2px rgba(203, 213, 225, 0.2) !important;
        }
        .avatar-sm {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f1f5f9;
          border: none;
          transition: background 0.2s;
        }
        .avatar-sm:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  );
}