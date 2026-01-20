"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
import { proposalService } from "@/lib/services/proposal.service";

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Banka Havalesi" },
  { value: "CASH", label: "Nakit" },
  { value: "CREDIT_CARD", label: "Kredi Kartı" },
  { value: "OTHER", label: "Diğer" },
];

// -------------------------------
// HELPERS
// -------------------------------
const normalizeAmount = (value) =>
  value
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3})/g, "")
    .replace(",", ".");

const optional = (v) => v?.trim() || undefined;

// -------------------------------
// COMPONENT
// -------------------------------
export default function IncomeExpenseCreateContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    type: "INCOME",
    amount: "",
    currency: "TRY",
    date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    description: "",
    category: "",
    paymentMethod: "BANK_TRANSFER",
    referenceNo: "",
    proposalId: "",
  });

  // -------------------------------
  // FETCH PROPOSALS
  // -------------------------------
  useEffect(() => {
    proposalService.list({ page: 1, limit: 100 }).then((res) => {
      setProposals(res?.data?.items || []);
    });
  }, []);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onProposalChange = (e) => {
    const id = e.target.value;
    setForm((p) => ({ ...p, proposalId: id }));
    setSelectedProposal(proposals.find((x) => x.id === id) || null);
  };

  // -------------------------------
  // VALIDATION
  // -------------------------------
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
    if (!form.paymentMethod) e.paymentMethod = "Ödeme yöntemi zorunludur";
    if (!form.date) e.date = "Tarih zorunludur";

    return e;
  };

  // -------------------------------
  // SUBMIT
  // -------------------------------
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
        amount: normalizeAmount(form.amount), // STRING
        currency: form.currency,
        date: `${form.date}T00:00:00.000Z`, // IsDateString uyumlu
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

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header fw-semibold">Yeni Gelir / Gider</div>

        <div className="card-body">
          <div className="row g-3">
            {/* TYPE */}
            <div className="col-md-4">
              <label className="form-label">Tür</label>
              <select
                className="form-select"
                value={form.type}
                onChange={onChange("type")}
                disabled={loading}
              >
                <option value="INCOME">Gelir</option>
                <option value="EXPENSE">Gider</option>
              </select>
            </div>

            {/* DATE */}
            <div className="col-md-4">
              <label className="form-label">Tarih</label>
              <input
                type="date"
                className="form-control"
                value={form.date}
                onChange={onChange("date")}
                disabled={loading}
              />
              {errors.date && (
                <small className="text-danger">{errors.date}</small>
              )}
            </div>

            {/* AMOUNT */}
            <div className="col-md-4">
              <label className="form-label">Tutar</label>
              <input
                className="form-control"
                placeholder="12500.00"
                value={form.amount}
                onChange={onChange("amount")}
                disabled={loading}
              />
              {errors.amount && (
                <small className="text-danger">{errors.amount}</small>
              )}
            </div>

            {/* CATEGORY */}
            <div className="col-md-6">
              <label className="form-label">Kategori</label>
              <input
                className="form-control"
                value={form.category}
                onChange={onChange("category")}
                disabled={loading}
              />
              {errors.category && (
                <small className="text-danger">{errors.category}</small>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="col-md-6">
              <label className="form-label">Ödeme Yöntemi</label>
              <select
                className="form-select"
                value={form.paymentMethod}
                onChange={onChange("paymentMethod")}
                disabled={loading}
              >
                {PAYMENT_METHODS.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <small className="text-danger">{errors.paymentMethod}</small>
              )}
            </div>

            {/* PROPOSAL */}
            <div className="col-12">
              <label className="form-label">Teklif</label>
              <select
                className="form-select"
                value={form.proposalId}
                onChange={onProposalChange}
                disabled={loading}
              >
                <option value="">Seçiniz</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* AUTO CUSTOMER */}
            {selectedProposal?.customer && (
              <div className="col-12">
                <label className="form-label">Müşteri</label>
                <input
                  className="form-control"
                  value={selectedProposal.customer.fullName}
                  disabled
                />
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="col-12">
              <label className="form-label">Açıklama</label>
              <input
                className="form-control"
                value={form.description}
                onChange={onChange("description")}
                disabled={loading}
              />
              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
            </div>

            {/* REFERENCE */}
            <div className="col-md-6">
              <label className="form-label">Referans No</label>
              <input
                className="form-control"
                value={form.referenceNo}
                onChange={onChange("referenceNo")}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/income-expense/list")}
            disabled={loading}
          >
            İptal
          </button>

          <button
            className="btn text-white"
            style={{ backgroundColor: "#E92B63" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
