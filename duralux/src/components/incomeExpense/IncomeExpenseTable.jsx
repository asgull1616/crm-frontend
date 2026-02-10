"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
// İkonlar
import {
  FiCreditCard,
  FiDollarSign,
  FiBriefcase,
  FiArchive,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
} from "react-icons/fi";

// Enumlar
import {
  TransactionType,
  TransactionTypeConfig,
  PaymentMethod,
  PaymentMethodLabels,
} from "../../lib/services/enums/transaction.enums";

export default function IncomeExpenseTable() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // FETCH LIST
  // --------------------------------------------------
  const fetchList = async () => {
    setLoading(true);
    try {
      // Not: İstatistiklerin tüm veriyi kapsaması için limit yüksek tutuldu
      // Gerçek projede bu istatistikler Backend'den (/summary endpointi ile) gelmelidir.
      const res = await transactionService.list({ limit: 100 });
      setItems(res?.data?.items || []);
    } catch (err) {
      console.error(err);
      alert("Kayıtlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // --------------------------------------------------
  // SUMMARY (Gelir/Gider + Ödeme Yöntemleri)
  // --------------------------------------------------
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    // Ödeme Yöntemlerine göre toplamları tutacak obje
    // Başlangıç: { CASH: 0, BANK_TRANSFER: 0 ... }
    const byMethod = {};
    Object.keys(PaymentMethod).forEach((key) => (byMethod[key] = 0));

    for (const item of items) {
      const amt = Number(item.amount);

      // 1. Genel Toplamlar
      if (item.type === TransactionType.INCOME) {
        income += amt;
      } else {
        expense += amt;
      }

      // 2. Ödeme Yöntemi Toplamları (Varsa ekle)
      if (byMethod[item.paymentMethod] !== undefined) {
        byMethod[item.paymentMethod] += amt;
      }
    }

    return { income, expense, net: income - expense, byMethod };
  }, [items]);

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------
  const handleDelete = async (id) => {
    const ok = window.confirm("Kayıt silinsin mi?");
    if (!ok) return;

    try {
      await transactionService.remove(id);
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız");
    }
  };

  const formatMoney = (amount, currency = "TRY") => {
    return (
      Number(amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) +
      " ₺"
    );
  };

  // Kart İkon Helper'ı
  const getMethodIcon = (method) => {
    switch (method) {
      case PaymentMethod.CASH:
        return <FiDollarSign size={20} />;
      case PaymentMethod.CREDIT_CARD:
        return <FiCreditCard size={20} />;
      case PaymentMethod.BANK_TRANSFER:
        return <FiBriefcase size={20} />;
      default:
        return <FiArchive size={20} />;
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="col-12">
      {/* BAŞLIK VE BUTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Finansal Genel Bakış</h5>
        <button
          className="btn btn-sm text-white fw-bold px-4 py-2 shadow-sm"
          style={{ backgroundColor: "#E92B63", borderRadius: "8px" }}
          onClick={() => router.push("/income-expense/create")}
        >
          + Yeni Kayıt
        </button>
      </div>

      {/* 1. SATIR: ANA KARTLAR (GELİR - GİDER - NET) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #198754" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="text-muted small fw-bold text-uppercase">
                  Toplam Gelir
                </div>
                <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                  <FiTrendingUp />
                </div>
              </div>
              <div className="h3 mb-0 fw-bold text-success">
                {formatMoney(summary.income)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderLeft: "4px solid #dc3545" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="text-muted small fw-bold text-uppercase">
                  Toplam Gider
                </div>
                <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle">
                  <FiTrendingDown />
                </div>
              </div>
              <div className="h3 mb-0 fw-bold text-danger">
                {formatMoney(summary.expense)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft: `4px solid ${summary.net >= 0 ? "#0d6efd" : "#dc3545"}`,
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="text-muted small fw-bold text-uppercase">
                  Net Bakiye
                </div>
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                  <FiActivity />
                </div>
              </div>
              <div
                className={`h3 mb-0 fw-bold ${summary.net >= 0 ? "text-primary" : "text-danger"}`}
              >
                {formatMoney(summary.net)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SATIR: ÖDEME YÖNTEMLERİNE GÖRE DAĞILIM */}
      <h6 className="text-muted small fw-bold text-uppercase mb-3 ps-1">
        Ödeme Yöntemi Dağılımı
      </h6>
      <div className="row g-3 mb-4">
        {Object.keys(PaymentMethod).map((method) => (
          <div className="col-md-3 col-sm-6" key={method}>
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-light p-3 rounded-circle text-muted">
                  {getMethodIcon(method)}
                </div>
                <div>
                  <div
                    className="text-muted small fw-bold"
                    style={{ fontSize: "11px" }}
                  >
                    {PaymentMethodLabels[method]}
                  </div>
                  <div className="fw-bold fs-5 text-dark">
                    {formatMoney(summary.byMethod[method])}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TABLO */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 ps-4 text-muted small fw-bold text-uppercase border-0">
                    Tarih
                  </th>
                  <th className="py-3 text-muted small fw-bold text-uppercase border-0">
                    Açıklama
                  </th>
                  <th className="py-3 text-muted small fw-bold text-uppercase border-0">
                    Tür
                  </th>
                  <th className="py-3 text-muted small fw-bold text-uppercase border-0">
                    Kategori
                  </th>
                  <th className="py-3 text-muted small fw-bold text-uppercase border-0">
                    Ödeme Yöntemi
                  </th>
                  <th className="py-3 text-muted small fw-bold text-uppercase border-0 text-end pe-4">
                    Tutar
                  </th>
                  <th className="py-3 text-muted small fw-bold text-uppercase border-0 text-end pe-4">
                    Aksiyon
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((x) => {
                  const typeConfig = TransactionTypeConfig[x.type] || {};
                  return (
                    <tr key={x.id}>
                      <td className="ps-4">
                        {new Date(x.date).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="fw-medium text-dark">{x.description}</td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${typeConfig.class}`}
                        >
                          {typeConfig.label || x.type}
                        </span>
                      </td>
                      <td>{x.category}</td>
                      <td className="text-muted small">
                        {PaymentMethodLabels[x.paymentMethod] ||
                          x.paymentMethod}
                      </td>
                      <td className="text-end pe-4 fw-bold text-dark">
                        {formatMoney(x.amount, x.currency)}
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-light border"
                            onClick={() =>
                              router.push(`/income-expense/view/${x.id}`)
                            }
                          >
                            👁️
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-primary"
                            onClick={() =>
                              router.push(`/income-expense/edit/${x.id}`)
                            }
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger"
                            onClick={() => handleDelete(x.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      Yükleniyor...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
