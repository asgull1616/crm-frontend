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

export default function IncomeExpenseCreateContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const [form, setForm] = useState({
    type: "INCOME",
    amount: "",
    currency: "TRY",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "",
    paymentMethod: "BANK_TRANSFER",
    referenceNo: "",
    proposalId: "",
  });

  // --------------------------------------------------
  // FETCH PROPOSALS (for select)
  // --------------------------------------------------
  useEffect(() => {
    proposalService.list({ page: 1, limit: 100 }).then((res) => {
      const items = res?.data?.items || [];
      setProposals(items);
    });
  }, []);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  // Proposal change
  const onProposalChange = (e) => {
    const id = e.target.value;
    setForm((p) => ({ ...p, proposalId: id }));
    const p = proposals.find((x) => x.id === id);
    setSelectedProposal(p || null);
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------
  const validate = () => {
    if (!form.type) return "Tür zorunlu";
    if (!form.amount.trim()) return "Tutar zorunlu";

    const normalized = form.amount.trim().replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(normalized))
      return "Tutar sayı olmalı (örn: 12500.00)";

    if (!form.category.trim()) return "Kategori zorunlu";
    if (!form.description.trim()) return "Açıklama zorunlu";

    return null;
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------
  const handleSubmit = async () => {
    const err = validate();
    if (err) return alert(err);

    setLoading(true);
    try {
      const payload = {
        type: form.type,
        amount: form.amount.trim().replace(",", "."),
        currency: form.currency,
        date: new Date(form.date).toISOString(),
        description: form.description.trim(),
        category: form.category.trim(),
        paymentMethod: form.paymentMethod,
        referenceNo: form.referenceNo?.trim() || undefined,
        proposalId: form.proposalId || undefined,
      };

      await transactionService.create(payload);

      router.push("/income-expense/list");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Kayıt oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header fw-semibold">
          Yeni Gelir / Gider (Checkout)
        </div>

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
            </div>

            {/* CATEGORY */}
            <div className="col-md-6">
              <label className="form-label">Kategori</label>
              <input
                className="form-control"
                placeholder="Satış / Kira"
                value={form.category}
                onChange={onChange("category")}
                disabled={loading}
              />
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
            </div>

            {/* PROPOSAL SELECT */}
            <div className="col-12">
              <label className="form-label">Teklif (Proposal)</label>
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
              <small className="text-muted">
                Proposal seçilirse müşteri otomatik bağlanır.
              </small>
            </div>

            {/* AUTO CUSTOMER INFO */}
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
                placeholder="Web sitesi ödeme"
                value={form.description}
                onChange={onChange("description")}
                disabled={loading}
              />
            </div>

            {/* REFERENCE */}
            <div className="col-md-6">
              <label className="form-label">Referans No</label>
              <input
                className="form-control"
                placeholder="DEKONT-123"
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
