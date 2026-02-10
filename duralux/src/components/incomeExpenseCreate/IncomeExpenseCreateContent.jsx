"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
import { proposalService } from "@/lib/services/proposal.service";
import {
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiFileText,
  FiHash,
  FiCreditCard,
} from "react-icons/fi";

// ✅ 1. Enum dosyamızı import ediyoruz
import {
  TransactionType,
  TransactionTypeConfig,
  PaymentMethod,
  PaymentMethodLabels,
} from "../../lib/services/enums/transaction.enums";

// Helperlar (Aynen kaldı)
const normalizeAmount = (value) =>
  value
    .toString()
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3})/g, "")
    .replace(",", ".");

const optional = (v) => v?.trim() || undefined;

export default function IncomeExpenseCreateContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    type: TransactionType.INCOME, // ✅ Enum kullanımı
    amount: "",
    currency: "TRY",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "",
    paymentMethod: PaymentMethod.BANK_TRANSFER, // ✅ Enum kullanımı
    referenceNo: "",
    proposalId: "",
  });

  useEffect(() => {
    proposalService.list({ page: 1, limit: 100 }).then((res) => {
      setProposals(res?.data?.items || []);
    });
  }, []);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const setType = (type) => setForm((p) => ({ ...p, type }));

  const onProposalChange = (e) => {
    const id = e.target.value;
    setForm((p) => ({ ...p, proposalId: id }));
    setSelectedProposal(proposals.find((x) => x.id === id) || null);
  };

  // --------------------------------------------------
  // VALIDATE (Aynen kaldı)
  // --------------------------------------------------
  const validate = () => {
    const e = {};
    if (!form.amount.trim()) {
      e.amount = "Tutar zorunludur";
    } else {
      const normalized = normalizeAmount(form.amount);
      if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
        e.amount = "Geçerli bir tutar giriniz (örn: 12500.00)";
      }
    }
    if (!form.category.trim()) e.category = "Kategori zorunludur";
    if (!form.description.trim()) e.description = "Açıklama zorunludur";
    if (!form.date) e.date = "Tarih zorunludur";
    return e;
  };

  // --------------------------------------------------
  // SUBMIT (Aynen kaldı)
  // --------------------------------------------------
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        type: form.type,
        amount: normalizeAmount(form.amount),
        currency: form.currency,
        date: `${form.date}T00:00:00.000Z`,
        description: form.description.trim(),
        category: form.category.trim(),
        paymentMethod: form.paymentMethod,
        referenceNo: optional(form.referenceNo),
        proposalId: optional(form.proposalId),
      };

      await transactionService.create(payload);
      router.push("/income-expense/list");
    } catch (err) {
      const msg = err?.response?.data?.message;
      alert(
        Array.isArray(msg) ? msg.join("\n") : msg || "Kayıt oluşturulamadı",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">Yeni Finansal İşlem Kaydı</h5>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            {/* TÜR SEÇİMİ - Enum Config ile Dinamik Butonlar */}
            <div className="col-12 mb-2">
              <label className="form-label fw-bold small text-muted text-uppercase mb-3">
                İşlem Türü
              </label>
              <div className="d-flex gap-3">
                {[TransactionType.INCOME, TransactionType.EXPENSE].map(
                  (typeKey) => {
                    const config = TransactionTypeConfig[typeKey];
                    const isActive = form.type === typeKey;

                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => setType(typeKey)}
                        className={`btn flex-fill py-3 fw-bold transition-all ${
                          isActive
                            ? `${config.btnClass} shadow-sm`
                            : `${config.outlineClass} border-2`
                        }`}
                        style={{ borderRadius: "12px" }}
                      >
                        {config.label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* TUTAR VE TARİH (Aynen kaldı) */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Tutar
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiDollarSign />
                </span>
                <input
                  className={`form-control form-control-lg bg-light border-start-0 ${
                    errors.amount ? "is-invalid" : ""
                  }`}
                  placeholder="0.00"
                  value={form.amount}
                  onChange={onChange("amount")}
                  disabled={loading}
                />
              </div>
              {errors.amount && (
                <div className="text-danger small mt-1">{errors.amount}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                İşlem Tarihi
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiCalendar />
                </span>
                <input
                  type="date"
                  className={`form-control form-control-lg bg-light border-start-0 ${
                    errors.date ? "is-invalid" : ""
                  }`}
                  value={form.date}
                  onChange={onChange("date")}
                  disabled={loading}
                />
              </div>
            </div>

            {/* KATEGORİ VE ÖDEME YÖNTEMİ */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Kategori
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiTag />
                </span>
                <input
                  className={`form-control bg-light border-start-0 ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  placeholder="Örn: Satış, Maaş, Kira..."
                  value={form.category}
                  onChange={onChange("category")}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Ödeme Yöntemi
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiCreditCard />
                </span>
                <select
                  className="form-select bg-light border-start-0"
                  value={form.paymentMethod}
                  onChange={onChange("paymentMethod")}
                  disabled={loading}
                >
                  {/* ✅ Enum'dan gelen değerleri döngüyle basıyoruz */}
                  {Object.entries(PaymentMethodLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TEKLİF VE MÜŞTERİ (Aynen kaldı) */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                İlgili Teklif
              </label>
              <select
                className="form-select bg-light"
                value={form.proposalId}
                onChange={onProposalChange}
                disabled={loading}
              >
                <option value="">Teklif Seçiniz (Opsiyonel)</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Referans No
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiHash />
                </span>
                <input
                  className="form-control bg-light border-start-0"
                  placeholder="İşlem veya Fatura No"
                  value={form.referenceNo}
                  onChange={onChange("referenceNo")}
                  disabled={loading}
                />
              </div>
            </div>

            {selectedProposal?.customer && (
              <div className="col-12 animate__animated animate__fadeIn">
                <div className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                  <div>
                    <span className="small text-muted d-block text-uppercase fw-bold">
                      Bağlı Müşteri
                    </span>
                    <span className="fw-bold text-primary">
                      {selectedProposal.customer.fullName}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AÇIKLAMA */}
            <div className="col-12">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Açıklama
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiFileText />
                </span>
                <textarea
                  className={`form-control bg-light border-start-0 ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  rows="3"
                  placeholder="İşlem ile ilgili notlarınız..."
                  value={form.description}
                  onChange={onChange("description")}
                  disabled={loading}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-white py-3 d-flex justify-content-end gap-3 border-top">
          <button
            type="button"
            className="btn btn-light px-4 fw-bold text-muted"
            onClick={() => router.push("/income-expense/list")}
            disabled={loading}
            style={{ borderRadius: "10px" }}
          >
            Vazgeç
          </button>
          <button
            type="button"
            className="btn px-5 fw-bold text-white shadow-sm"
            style={{ backgroundColor: "#E92B63", borderRadius: "10px" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Kaydediliyor...
              </>
            ) : (
              "KAYDET"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
