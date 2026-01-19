"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Banka Havalesi" },
  { value: "CASH", label: "Nakit" },
  { value: "CREDIT_CARD", label: "Kredi Kartı" },
  { value: "OTHER", label: "Diğer" },
];

export default function IncomeExpenseEditContent({ id }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true); // sayfa açılışında fetch için
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: "INCOME",
    amount: "", // UI string
    currency: "TRY",
    date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    description: "",
    category: "",
    paymentMethod: "BANK_TRANSFER",
    referenceNo: "",
    customerId: "",
    proposalId: "",
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const validate = () => {
    if (!form.type) return "Tür zorunlu";

    // amount: UI'da string tutuyoruz, update'e number yollayacağız
    if (!String(form.amount).trim()) return "Tutar zorunlu";
    const normalized = String(form.amount).trim().replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(normalized))
      return "Tutar sayı olmalı (örn: 12500.00)";

    if (!form.category.trim()) return "Kategori zorunlu";
    if (!form.description.trim()) return "Açıklama zorunlu";

    if (form.customerId.trim() && !uuidRegex.test(form.customerId.trim()))
      return "CustomerId UUID formatında olmalı";
    if (form.proposalId.trim() && !uuidRegex.test(form.proposalId.trim()))
      return "ProposalId UUID formatında olmalı";

    return null;
  };

  // --------------------------------------------------
  // FETCH DETAIL
  // --------------------------------------------------
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getById(id);
      const tx = res?.data;

      // date API'dan ISO gelebilir: "2026-01-10T00:00:00.000Z"
      const dateForInput = tx?.date ? String(tx.date).slice(0, 10) : "";

      setForm({
        type: tx?.type || "INCOME",
        amount: tx?.amount != null ? String(tx.amount) : "",
        currency: tx?.currency || "TRY",
        date: dateForInput || new Date().toISOString().slice(0, 10),
        description: tx?.description || "",
        category: tx?.category || "",
        paymentMethod: tx?.paymentMethod || "BANK_TRANSFER",
        referenceNo: tx?.referenceNo || "",
        customerId: tx?.customer?.id || tx?.customerId || "",
        proposalId: tx?.proposal?.id || tx?.proposalId || "",
      });
    } catch (err) {
      console.error(err);
      alert("Kayıt detayı alınamadı");
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
  // UPDATE
  // --------------------------------------------------
  const handleSubmit = async () => {
    const err = validate();
    if (err) return alert(err);

    setSaving(true);
    try {
      const normalizedAmount = String(form.amount).trim().replace(",", ".");
      // number'a çevirmiyoruz, string gönderiyoruz ✅

      const isoDate = form.date ? new Date(form.date).toISOString() : undefined;

      const payload = {
        type: form.type,
        amount: normalizedAmount, // ✅ string
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
      alert(e?.response?.data?.message || "Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="col-12">
        <div className="card">
          <div className="card-body text-muted">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header fw-semibold">Gelir / Gider Güncelle</div>

        <div className="card-body">
          <div className="row g-3">
            {/* TYPE */}
            <div className="col-md-4">
              <label className="form-label">Tür</label>
              <select
                className="form-select"
                value={form.type}
                onChange={onChange("type")}
                disabled={saving}
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
                disabled={saving}
              />
            </div>

            {/* CURRENCY */}
            <div className="col-md-4">
              <label className="form-label">Para Birimi</label>
              <input
                className="form-control"
                placeholder="TRY"
                value={form.currency}
                onChange={onChange("currency")}
                disabled={saving}
              />
            </div>

            {/* AMOUNT */}
            <div className="col-md-6">
              <label className="form-label">Tutar</label>
              <input
                className="form-control"
                placeholder="12500.00"
                value={form.amount}
                onChange={onChange("amount")}
                disabled={saving}
                inputMode="decimal"
              />
              <small className="text-muted">
                Virgül veya nokta yazabilirsin (örn: 12500,50)
              </small>
            </div>

            {/* PAYMENT METHOD */}
            <div className="col-md-6">
              <label className="form-label">Ödeme Yöntemi</label>
              <select
                className="form-select"
                value={form.paymentMethod}
                onChange={onChange("paymentMethod")}
                disabled={saving}
              >
                {PAYMENT_METHODS.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}
            <div className="col-md-6">
              <label className="form-label">Kategori</label>
              <input
                className="form-control"
                placeholder="Satış / Kira / Yakıt"
                value={form.category}
                onChange={onChange("category")}
                disabled={saving}
              />
            </div>

            {/* REFERENCE NO */}
            <div className="col-md-6">
              <label className="form-label">Referans No (Opsiyonel)</label>
              <input
                className="form-control"
                placeholder="DEKONT-123"
                value={form.referenceNo}
                onChange={onChange("referenceNo")}
                disabled={saving}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="col-12">
              <label className="form-label">Açıklama</label>
              <input
                className="form-control"
                placeholder="Web sitesi ödeme"
                value={form.description}
                onChange={onChange("description")}
                disabled={saving}
              />
            </div>

            {/* CUSTOMER / PROPOSAL (opsiyonel) */}
            <div className="col-md-6">
              <label className="form-label">CustomerId (Opsiyonel)</label>
              <input
                className="form-control"
                placeholder="customer-uuid"
                value={form.customerId}
                onChange={onChange("customerId")}
                disabled={saving}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">ProposalId (Opsiyonel)</label>
              <input
                className="form-control"
                placeholder="proposal-uuid"
                value={form.proposalId}
                onChange={onChange("proposalId")}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/income-expense/list")}
            disabled={saving}
          >
            İptal
          </button>

          <button
            className="btn text-white"
            style={{ backgroundColor: "#E92B63", borderColor: "#E92B63" }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </div>
      </div>
    </div>
  );
}
