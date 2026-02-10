"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
// ✅ İkonlar ve Enum Importları
import {
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiTag,
  FiDollarSign,
  FiCreditCard,
  FiHash,
  FiFileText,
  FiUser,
  FiFile,
  FiCheckCircle,
} from "react-icons/fi";
import {
  TransactionTypeConfig,
  PaymentMethodLabels,
} from "../../lib/services/enums/transaction.enums";

// Helper: Para Formatlama
const formatMoney = (amount, currency = "TRY") => {
  const n = Number(String(amount ?? "0").replace(",", "."));
  const safe = Number.isFinite(n) ? n : 0;
  // Türkçe format: 12.345,67 ₺
  return (
    safe.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    " " +
    (currency === "TRY" ? "₺" : currency)
  );
};

export default function IncomeExpenseViewContent({ id }) {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchDetail = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await transactionService.getById(id);
      setData(res.data);
    } catch (e) {
      console.error(e);
      setErrMsg(e?.response?.data?.message || "Kayıt detayı alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Veriyi işleyip kullanıma hazır hale getiren memo
  const info = useMemo(() => {
    if (!data) return null;

    const dateText = data?.date
      ? new Date(data.date).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    return {
      id: data.id,
      type: data.type,
      dateText,
      category: data.category ?? "-",
      description: data.description ?? "-",
      amountText: formatMoney(data.amount, data.currency),
      currency: data.currency ?? "TRY",
      // Enum üzerinden Türkçe label çekiyoruz
      paymentMethod:
        PaymentMethodLabels[data.paymentMethod] || data.paymentMethod || "-",
      referenceNo: data.referenceNo ?? "-",

      customer: data.customer ?? null,
      proposal: data.proposal ?? null,
      createdByUser: data.createdByUser ?? null,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center text-muted py-5">
            <div
              className="spinner-border text-primary mb-2"
              role="status"
            ></div>
            <div>Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger shadow-sm d-flex flex-column align-items-center p-4">
          <h5 className="fw-bold mb-2">Bir Hata Oluştu</h5>
          <p className="mb-4">{errMsg}</p>
          <button
            className="btn btn-light border px-4"
            onClick={() => router.push("/income-expense/list")}
          >
            Listeye Dön
          </button>
        </div>
      </div>
    );
  }

  if (!info) return null;

  // Enum Config'i çekiyoruz
  const typeConfig = TransactionTypeConfig[info.type] || {};

  return (
    <div className="container-fluid py-4">
      {/* TOP BAR */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold text-dark mb-0">İşlem Detayı</h4>
            {/* Dinamik Badge */}
            <span
              className={`badge rounded-pill px-3 py-2 ${typeConfig.class}`}
            >
              {typeConfig.label || info.type}
            </span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-light border shadow-sm px-3"
            onClick={() => router.push("/income-expense/list")}
          >
            <FiArrowLeft className="me-2" /> Listeye Dön
          </button>

          <button
            className="btn text-white shadow-sm px-4"
            style={{ backgroundColor: "#E92B63" }}
            onClick={() => router.push(`/income-expense/edit/${info.id}`)}
          >
            <FiEdit2 className="me-2" /> Düzenle
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* SOL KOLON: ANA BİLGİLER */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-header bg-white py-3 border-bottom">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <FiFileText className="text-muted" /> Temel Bilgiler
              </h6>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {/* Tutar (Vurgulu) */}
                <div className="col-12">
                  <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
                    <span className="text-muted fw-bold small text-uppercase">
                      Toplam Tutar
                    </span>
                    <span className="h3 mb-0 fw-bold text-dark">
                      {info.amountText}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                    <FiCalendar className="me-1" /> Tarih
                  </label>
                  <span className="fw-medium fs-5">{info.dateText}</span>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                    <FiTag className="me-1" /> Kategori
                  </label>
                  <span className="fw-medium fs-5">{info.category}</span>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                    <FiCreditCard className="me-1" /> Ödeme Yöntemi
                  </label>
                  <span className="fw-medium">{info.paymentMethod}</span>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                    <FiHash className="me-1" /> Referans No
                  </label>
                  <span className="fw-medium font-monospace">
                    {info.referenceNo}
                  </span>
                </div>

                <div className="col-12">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                    Açıklama
                  </label>
                  <p className="mb-0 text-dark bg-light p-3 rounded-3 border">
                    {info.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: İLİŞKİLİ KAYITLAR */}
        <div className="col-lg-4">
          {/* MÜŞTERİ KARTI */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <FiUser className="text-muted" /> Müşteri
              </h6>
              {info.customer?.id && (
                <button
                  className="btn btn-sm btn-light border py-0"
                  onClick={() =>
                    router.push(`/customers/view/${info.customer.id}`)
                  }
                >
                  Git
                </button>
              )}
            </div>
            <div className="card-body">
              {info.customer ? (
                <>
                  <div className="fw-bold fs-5 text-dark">
                    {info.customer.fullName}
                  </div>
                  <div className="text-muted small">
                    {info.customer.companyName || "Şirket bilgisi yok"}
                  </div>
                </>
              ) : (
                <span className="text-muted small fst-italic">
                  Bu işlem bir müşteriye bağlanmamış.
                </span>
              )}
            </div>
          </div>

          {/* TEKLİF KARTI */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <FiFile className="text-muted" /> İlgili Teklif
              </h6>
              {info.proposal?.id && (
                <button
                  className="btn btn-sm btn-light border py-0"
                  onClick={() =>
                    router.push(`/proposal/view/${info.proposal.id}`)
                  }
                >
                  Git
                </button>
              )}
            </div>
            <div className="card-body">
              {info.proposal ? (
                <>
                  <div className="fw-bold text-dark">{info.proposal.title}</div>
                  <div className="mt-2">
                    <span className="badge bg-info bg-opacity-10 text-info border border-info">
                      {info.proposal.status}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-muted small fst-italic">
                  Bu işlem bir teklife bağlanmamış.
                </span>
              )}
            </div>
          </div>

          {/* OLUŞTURAN KULLANICI */}
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body d-flex align-items-center gap-3">
              <div className="bg-light rounded-circle p-2 text-muted">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <small
                  className="text-muted d-block text-uppercase fw-bold"
                  style={{ fontSize: "10px" }}
                >
                  Kayıt Oluşturan
                </small>
                <span className="fw-bold text-dark">
                  {info.createdByUser?.username || "Sistem"}
                </span>
                {info.createdByUser?.email && (
                  <div
                    className="text-muted small"
                    style={{ fontSize: "11px" }}
                  >
                    {info.createdByUser.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
