"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
// İkonlar ve Enumlar
import {
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiFileText,
  FiHash,
  FiCreditCard,
  FiUser,
  FiFile,
  FiSave,
  FiX,
  FiAlertCircle, // Hata ikonu
} from "react-icons/fi";
import {
  TransactionType,
  TransactionTypeConfig,
  PaymentMethodLabels,
  PaymentMethod,
} from "../../lib/services/enums/transaction.enums";

// Helper: Tutar temizleme (virgül -> nokta)
const cleanAmount = (val) => String(val).trim().replace(",", ".");

export default function IncomeExpenseEditContent({ id }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({}); // Hataları tutacak state

  // Form State
  const [form, setForm] = useState({
    type: TransactionType.INCOME,
    amount: "",
    currency: "TRY",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "",
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    referenceNo: "",
    customerId: "",
    proposalId: "",
  });

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    // Kullanıcı yazmaya başladığında hatayı sil
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const setType = (type) => setForm((p) => ({ ...p, type }));

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // --------------------------------------------------
  // VALIDATE (Frontend Kontrolü)
  // --------------------------------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.type) newErrors.type = "Tür seçimi zorunludur.";

    // Tutar Kontrolü
    if (!String(form.amount).trim()) {
      newErrors.amount = "Tutar alanı zorunludur.";
    } else {
      const normalized = cleanAmount(form.amount);
      if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
        newErrors.amount = "Geçerli bir sayı giriniz (Örn: 12500.50)";
      }
    }

    if (!form.category.trim()) newErrors.category = "Kategori zorunludur.";
    if (!form.description.trim())
      newErrors.description = "Açıklama zorunludur.";

    if (form.customerId.trim() && !uuidRegex.test(form.customerId.trim()))
      newErrors.customerId = "Geçersiz Müşteri ID formatı.";
    if (form.proposalId.trim() && !uuidRegex.test(form.proposalId.trim()))
      newErrors.proposalId = "Geçersiz Teklif ID formatı.";

    return newErrors;
  };

  // --------------------------------------------------
  // FETCH DETAIL
  // --------------------------------------------------
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getById(id);
      const tx = res?.data;

      const dateForInput = tx?.date ? String(tx.date).slice(0, 10) : "";

      setForm({
        type: tx?.type || TransactionType.INCOME,
        amount: tx?.amount != null ? String(tx.amount) : "",
        currency: tx?.currency || "TRY",
        date: dateForInput || new Date().toISOString().slice(0, 10),
        description: tx?.description || "",
        category: tx?.category || "",
        paymentMethod: tx?.paymentMethod || PaymentMethod.BANK_TRANSFER,
        referenceNo: tx?.referenceNo || "",
        customerId: tx?.customer?.id || tx?.customerId || "",
        proposalId: tx?.proposal?.id || tx?.proposalId || "",
      });
    } catch (err) {
      console.error(err);
      alert("Kayıt detayı alınamadı, listeye yönlendiriliyorsunuz.");
      router.push("/income-expense/list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --------------------------------------------------
  // UPDATE (Hata Çözümü Burada)
  // --------------------------------------------------
  const handleSubmit = async () => {
    // 1. Önce Frontend Validasyonu
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Hata varsa dur
    }

    setSaving(true);
    setErrors({}); // Hataları temizle

    try {
      const normalizedAmountStr = cleanAmount(form.amount);

      // 🔥 KRİTİK DÜZELTME: Backend Number bekliyorsa parseFloat yapıyoruz
      const amountNumber = parseFloat(normalizedAmountStr);

      const isoDate = form.date ? new Date(form.date).toISOString() : undefined;

      const payload = {
        type: form.type,
        amount: amountNumber, // ✅ String yerine Number gönderiyoruz
        currency: form.currency?.trim() || "TRY",
        date: isoDate,
        description: form.description.trim(),
        category: form.category.trim(),
        paymentMethod: form.paymentMethod,
        referenceNo: form.referenceNo?.trim() || null,
        customerId: form.customerId?.trim() || null,
        proposalId: form.proposalId?.trim() || null,
      };

      await transactionService.update(id, payload);
      router.push("/income-expense/list");
    } catch (e) {
      console.error(e);
      // Backend'den gelen hatayı alert yerine state'e yazabiliriz
      const serverMsg = e?.response?.data?.message;
      if (Array.isArray(serverMsg)) {
        // Backend class-validator hataları dizi dönerse
        alert(serverMsg.join("\n"));
      } else {
        alert(serverMsg || "Güncelleme sırasında bir hata oluştu.");
      }
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="container-fluid py-4">
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        {/* HEADER */}
        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold text-dark">Gelir / Gider Güncelle</h5>
          <span className="badge bg-light text-muted border">ID: {id}</span>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            {/* TÜR SEÇİMİ (BUTONLAR) */}
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
                        disabled={saving}
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

            {/* TARİH */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Tarih
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiCalendar />
                </span>
                <input
                  type="date"
                  className={`form-control form-control-lg bg-light border-start-0 ${errors.date ? "is-invalid" : ""}`}
                  value={form.date}
                  onChange={onChange("date")}
                  disabled={saving}
                />
                {errors.date && (
                  <div className="invalid-feedback ps-2">{errors.date}</div>
                )}
              </div>
            </div>

            {/* CURRENCY */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Para Birimi
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  ₺
                </span>
                <input
                  className="form-control form-control-lg bg-light border-start-0"
                  placeholder="TRY"
                  value={form.currency}
                  onChange={onChange("currency")}
                  disabled={saving}
                />
              </div>
            </div>

            {/* TUTAR - Hata Gösterimli */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Tutar
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiDollarSign />
                </span>
                <input
                  className={`form-control form-control-lg bg-light border-start-0 ${errors.amount ? "is-invalid" : ""}`}
                  placeholder="12500.00"
                  value={form.amount}
                  onChange={onChange("amount")}
                  disabled={saving}
                  inputMode="decimal"
                />
                {errors.amount && (
                  <div className="invalid-feedback d-flex align-items-center gap-1 ps-2">
                    <FiAlertCircle /> {errors.amount}
                  </div>
                )}
              </div>
              {!errors.amount && (
                <small
                  className="text-muted fst-italic ms-1"
                  style={{ fontSize: "11px" }}
                >
                  Örn: 12500.50
                </small>
              )}
            </div>

            {/* ÖDEME YÖNTEMİ */}
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
                  disabled={saving}
                >
                  {Object.entries(PaymentMethodLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* KATEGORİ */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Kategori
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiTag />
                </span>
                <input
                  className={`form-control bg-light border-start-0 ${errors.category ? "is-invalid" : ""}`}
                  placeholder="Satış / Kira / Yakıt"
                  value={form.category}
                  onChange={onChange("category")}
                  disabled={saving}
                />
                {errors.category && (
                  <div className="invalid-feedback ps-2">{errors.category}</div>
                )}
              </div>
            </div>

            {/* REFERANS NO */}
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
                  placeholder="DEKONT-123"
                  value={form.referenceNo}
                  onChange={onChange("referenceNo")}
                  disabled={saving}
                />
              </div>
            </div>

            {/* AÇIKLAMA */}
            <div className="col-12">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Açıklama
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <FiFileText />
                </span>
                <input
                  className={`form-control bg-light border-start-0 ${errors.description ? "is-invalid" : ""}`}
                  placeholder="İşlem açıklaması..."
                  value={form.description}
                  onChange={onChange("description")}
                  disabled={saving}
                />
                {errors.description && (
                  <div className="invalid-feedback ps-2">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <hr className="text-muted opacity-25" />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer bg-white py-3 d-flex justify-content-end gap-3 border-top">
          <button
            className="btn btn-light px-4 fw-bold text-muted"
            onClick={() => router.push("/income-expense/list")}
            disabled={saving}
            style={{ borderRadius: "10px" }}
          >
            <FiX className="me-2" /> İptal
          </button>

          <button
            className="btn px-5 fw-bold text-white shadow-sm"
            style={{ backgroundColor: "#E92B63", borderRadius: "10px" }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Güncelleniyor...
              </>
            ) : (
              <>
                <FiSave className="me-2" /> GÜNCELLE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
