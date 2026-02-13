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
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import {
  TransactionType,
  TransactionTypeConfig,
  PaymentMethod,
  PaymentMethodLabels,
} from "../../lib/services/enums/transaction.enums";

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
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    type: TransactionType.INCOME,
    amount: "",
    paidAmount: "", 
    currency: "TRY",
    date: new Date().toISOString().slice(0, 10),
    dueDate: "", 
    description: "",
    category: "",
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    referenceNo: "",
    proposalId: "",
  });

  useEffect(() => {
    proposalService.list({ page: 1, limit: 100 }).then((res) => {
      setProposals(res?.data?.items || []);
    });
  }, []);

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  // --------------------------------------------------
  // TEKLİF DEĞİŞTİĞİNDE TUTAR VE AÇIKLAMA GÜNCELLEME
  // --------------------------------------------------
  const onProposalChange = (e) => {
    const id = e.target.value;
    const selected = proposals.find((x) => x.id === id);

    setForm((p) => ({ 
      ...p, 
      proposalId: id,
      // Teklif seçildiyse tutarı otomatik doldur
      amount: selected?.totalAmount ? String(selected.totalAmount) : p.amount,
      // Açıklamayı otomatik oluştur
      description: selected?.title ? `${selected.title} Tahsilatı` : p.description
    }));

    if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.amount.trim()) e.amount = "Toplam tutar zorunludur";
    if (!form.category.trim()) e.category = "Kategori zorunludur";
    if (!form.description.trim()) e.description = "Açıklama zorunludur";
    if (!form.date) e.date = "İşlem tarihi zorunludur";
    return e;
  };

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
        paidAmount: normalizeAmount(form.paidAmount || "0"),
        currency: form.currency,
        date: `${form.date}T00:00:00.000Z`,
        dueDate: form.dueDate ? `${form.dueDate}T00:00:00.000Z` : undefined,
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
      alert(Array.isArray(msg) ? msg.join("\n") : msg || "Kayıt oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark text-uppercase">YENİ ÖDEME / TAHSİLAT KAYDI</h5>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            {/* İŞLEM TÜRÜ */}
            <div className="col-12">
              <label className="form-label fw-bold small text-muted text-uppercase mb-3">İşlem Türü</label>
              <div className="d-flex gap-3">
                {[TransactionType.INCOME, TransactionType.EXPENSE].map((typeKey) => {
                  const config = TransactionTypeConfig[typeKey];
                  const isActive = form.type === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, type: typeKey }))}
                      className={`btn flex-fill py-3 fw-bold transition-all shadow-sm ${
                        isActive ? config.btnClass : `${config.outlineClass} border-2`
                      }`}
                      style={{ borderRadius: "12px" }}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TUTAR BİLGİLERİ */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">Toplam Tutar</label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiDollarSign /></span>
                <input
                  className={`form-control form-control-lg bg-light border-start-0 ${errors.amount ? "is-invalid" : ""}`}
                  placeholder="0.00"
                  value={form.amount}
                  onChange={onChange("amount")}
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-success text-uppercase">Tahsil Edilen / Ödenen</label>
              <div className="input-group">
                <span className="input-group-text bg-success-subtle border-end-0 text-success">
                  <FiCheckCircle />
                </span>
                <input
                  className="form-control form-control-lg bg-success-subtle border-start-0 text-success fw-bold"
                  placeholder="0.00"
                  value={form.paidAmount}
                  onChange={onChange("paidAmount")}
                />
              </div>
            </div>

            {/* TARİH BİLGİLERİ */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">İşlem Tarihi</label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiCalendar /></span>
                <input type="date" className={`form-control bg-light border-start-0 ${errors.date ? "is-invalid" : ""}`} value={form.date} onChange={onChange("date")} />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-danger text-uppercase">Vade (Son Ödeme) Tarihi</label>
              <div className="input-group">
                <span className="input-group-text bg-danger-subtle border-end-0 text-danger">
                  <FiClock />
                </span>
                <input type="date" className="form-control bg-danger-subtle border-start-0 text-danger fw-bold" value={form.dueDate} onChange={onChange("dueDate")} />
              </div>
            </div>

            {/* KATEGORİ VE TEKLİF */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">Kategori</label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiTag /></span>
                <input className={`form-control bg-light border-start-0 ${errors.category ? "is-invalid" : ""}`} placeholder="Örn: Yazılım Bedeli" value={form.category} onChange={onChange("category")} />
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">İlgili Teklif</label>
              <select className="form-select bg-light" value={form.proposalId} onChange={onProposalChange}>
                <option value="">Teklif Seçiniz (Opsiyonel)</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.totalAmount} ₺)</option>
                ))}
              </select>
            </div>

            {/* YÖNTEM VE REF */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">Ödeme Yöntemi</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiCreditCard /></span>
                <select className="form-select bg-light border-start-0" value={form.paymentMethod} onChange={onChange("paymentMethod")}>
                  {Object.entries(PaymentMethodLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-muted text-uppercase">Referans No</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiHash /></span>
                <input className="form-control bg-light border-start-0" placeholder="Dekont No" value={form.referenceNo} onChange={onChange("referenceNo")} />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-bold small text-muted text-uppercase">Açıklama</label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiFileText /></span>
                <textarea className={`form-control bg-light border-start-0 ${errors.description ? "is-invalid" : ""}`} rows="3" placeholder="İşlem notları..." value={form.description} onChange={onChange("description")}></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-white py-3 d-flex justify-content-end gap-3 border-top">
          <button type="button" className="btn btn-light px-4 fw-bold text-muted border" onClick={() => router.push("/income-expense/list")}>İptal</button>
          <button type="button" className="btn px-5 fw-bold text-white shadow-sm" style={{ backgroundColor: "#E92B63", borderRadius: "10px" }} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "KAYDI TAMAMLA"}
          </button>
        </div>
      </div>
    </div>
  );
}