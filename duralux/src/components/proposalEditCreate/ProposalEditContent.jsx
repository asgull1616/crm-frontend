"use client";

import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { proposalService } from "@/lib/services/proposal.service";
import { customerService } from "@/lib/services/customer.service";

const previtems = [
  { id: 1, product: "Website design and development", qty: 1, price: 250 },
  {
    id: 2,
    product: "Search engine optimization (SEO) optimization",
    qty: 2,
    price: 300,
  },
];

export default function ProposalEditContent({ id, onReady }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // backend alanları
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [totalAmount, setTotalAmount] = useState("");
  const [validUntil, setValidUntil] = useState(null);

  const [customers, setCustomers] = useState([]);

  // ✅ Save fonksiyonu (stable)
  const handleSave = useCallback(
    async (send) => {
      if (!id) return;

      if (!title?.trim()) return alert("Başlık zorunlu");
      if (!customerId) return alert("Müşteri zorunlu");
      if (!validUntil) return alert("Geçerlilik tarihi zorunlu");

      setSaving(true);
      try {
        // ✅ totalAmount'ı number'a çevir (TR virgül destekli)
        const amount = totalAmount?.trim()
          ? Number(totalAmount.trim().replace(",", "."))
          : undefined;

        if (amount !== undefined && Number.isNaN(amount)) {
          alert("Toplam tutar sayı olmalı (örn: 175000.5)");
          return;
        }

        await proposalService.update(id, {
          title: title.trim(),
          customerId,
          validUntil: validUntil.toISOString(),
          status: send ? "SENT" : status,
          ...(amount !== undefined ? { totalAmount: amount } : {}),
        });

        alert("Kaydedildi ✅");
      } catch (e) {
        console.log("STATUS:", e?.response?.status);
        console.log("DATA:", e?.response?.data);
        console.log("CONFIG:", e?.config);
        alert(JSON.stringify(e?.response?.data || {}, null, 2));
      } finally {
        setSaving(false);
      }
    },
    [id, title, customerId, validUntil, status, totalAmount],
  );

  // ✅ Sayfa açılınca: teklif + müşteri listesi çek
  useEffect(() => {
    if (!id) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const [pRes, cRes] = await Promise.all([
          proposalService.getById(id),
          customerService.list({ page: 1, limit: 100 }),
        ]);

        if (!alive) return;

        const p = pRes.data;

        const payload = cRes.data;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload?.data)
              ? payload.data
              : Array.isArray(payload?.customers)
                ? payload.customers
                : [];

        setCustomers(items);

        setTitle(p.title ?? "");
        setCustomerId(p.customerId ?? "");
        setStatus(p.status ?? "DRAFT");
        setTotalAmount(p.totalAmount ? String(p.totalAmount) : "");
        setValidUntil(p.validUntil ? new Date(p.validUntil) : null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  // ✅ Header aksiyonlarını sadece 1 kere kur
  useEffect(() => {
    if (!onReady) return;

    onReady({
      onSave: () => handleSave(false),
      onSaveAndSend: () => handleSave(true),
      loading: false,
    });
  }, [onReady, handleSave]);

  // ✅ saving değişince header loading güncelle (loop yapmaz)
  useEffect(() => {
    if (!onReady) return;

    onReady((prev) => ({
      ...prev,
      loading: saving,
    }));
  }, [onReady, saving]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="col-xl-6">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="mb-4">
              <label className="form-label">
                Teklif Başlığı <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Konu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Müşteri <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                value={customerId || ""}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label">Toplam Tutar</label>
              <input
                type="number"
                className="form-control no-spinner"
                placeholder="Örn: 150000"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Geçerlilik Tarihi <span className="text-danger">*</span>
                </label>
                <div className="input-group date">
                  <DatePicker
                    placeholderText="Tarih seçin"
                    selected={validUntil}
                    showPopperArrow={false}
                    onChange={(date) => setValidUntil(date)}
                    className="form-control"
                    popperPlacement="bottom-start"
                  />
                </div>
              </div>

              <div className="col-lg-6 mb-4">
                <label className="form-label">Durum</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="SENT">SENT</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>
            </div>

            {/* Sayfa içi butonlar dursun, header ile aynı işi yapar */}
            <div className="d-flex gap-2">
            <button
  className="btn text-white"
  onClick={() => handleSave(false)}
  disabled={saving}
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
    opacity: saving ? 0.7 : 1,
  }}
>
  {saving ? "Kaydediliyor..." : "Kaydet"}
</button>

              <button
                className="btn btn-light-brand"
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                {saving ? "Gönderiliyor..." : "Kaydet & Gönder"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddProposal previtems={previtems} />
    </>
  );
}
