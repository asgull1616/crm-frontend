"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
import {
  FiDollarSign, FiCalendar, FiFileText, FiX, FiClock, FiCheckCircle, FiInfo
} from "react-icons/fi";
import {
  TransactionType,
} from "../../lib/services/enums/transaction.enums";

export default function IncomeExpenseEditContent({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: "", // Türü korumak için saklıyoruz ama seçim yaptırmıyoruz
    amount: "",
    paidAmount: "",
    currency: "TRY",
    date: "",
    dueDate: "",
    description: "",
    category: "",
    paymentMethod: "",
    referenceNo: "",
  });

  useEffect(() => {
    if (!id) return;
    transactionService.getById(id).then(res => {
      const tx = res?.data;
      setForm({
        type: tx.type,
        amount: String(tx.amount),
        paidAmount: String(tx.paidAmount || "0"),
        currency: tx.currency,
        date: tx.date ? tx.date.slice(0, 10) : "",
        dueDate: tx.dueDate ? tx.dueDate.slice(0, 10) : "",
        description: tx.description || "",
        category: tx.category || "",
        paymentMethod: tx.paymentMethod,
        referenceNo: tx.referenceNo || "",
      });
      setLoading(false);
    }).catch(() => router.push("/income-expense/list"));
  }, [id, router]);

  const onChange = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  // Durum Hesaplama: Ödenen miktara ve vadeye göre dinamik badge
  const statusInfo = useMemo(() => {
    const total = Number(form.amount) || 0;
    const paid = Number(form.paidAmount) || 0;
    const isIncome = form.type === TransactionType.INCOME;

    if (paid >= total && total > 0) {
      return { label: isIncome ? "Ödendi" : "Kapandı", color: "success" };
    }
    
    const isOverdue = form.dueDate && new Date(form.dueDate) < new Date();
    if (isOverdue) {
      return { label: "Gecikti", color: "danger" };
    }

    return { label: "Bekliyor", color: "warning" };
  }, [form.amount, form.paidAmount, form.dueDate, form.type]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: form.amount.replace(",", "."),
        paidAmount: form.paidAmount.replace(",", "."),
        date: form.date ? `${form.date}T00:00:00.000Z` : null,
        dueDate: form.dueDate ? `${form.dueDate}T00:00:00.000Z` : null,
      };
      await transactionService.update(id, payload);
      router.push("/income-expense/list");
    } catch (e) {
      alert("Güncelleme sırasında bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-5 text-center text-muted">Kayıt bilgileri yükleniyor...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">İşlem Detaylarını Güncelle</h5>
          <span className={`badge bg-${statusInfo.color} px-3 py-2 fw-bold`}>
            DURUM: {statusInfo.label.toUpperCase()}
          </span>
        </div>

        <div className="card-body p-4">
          {/* Tür Bilgisi (Salt Okunur) */}
          <div className="alert bg-light border-0 d-flex align-items-center gap-2 mb-4">
            <FiInfo className="text-primary" />
            <span className="small fw-bold text-muted text-uppercase">
              İşlem Türü: <span className={form.type === TransactionType.INCOME ? 'text-success' : 'text-danger'}>
                {form.type === TransactionType.INCOME ? 'GELİR (SATIŞ)' : 'GİDER (HARCAMA)'}
              </span>
            </span>
          </div>

          <div className="row g-4">
            {/* TUTAR BİLGİLERİ */}
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase">Toplam Tutar</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiDollarSign /></span>
                <input className="form-control bg-light" value={form.amount} onChange={onChange("amount")} />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-success text-uppercase">Tahsil Edilen / Ödenen</label>
              <div className="input-group">
                <span className="input-group-text bg-success-subtle border-end-0 text-success"><FiCheckCircle /></span>
                <input className="form-control bg-success-subtle border-start-0 text-success fw-bold" value={form.paidAmount} onChange={onChange("paidAmount")} />
              </div>
            </div>

            {/* TARİH BİLGİLERİ */}
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase">İşlem Tarihi</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiCalendar /></span>
                <input type="date" className="form-control bg-light" value={form.date} onChange={onChange("date")} />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-danger text-uppercase">Vade (Son Ödeme) Tarihi</label>
              <div className="input-group">
                <span className="input-group-text bg-danger-subtle border-end-0 text-danger"><FiClock /></span>
                <input type="date" className="form-control bg-danger-subtle border-start-0 text-danger fw-bold" value={form.dueDate} onChange={onChange("dueDate")} />
              </div>
            </div>

            {/* AÇIKLAMA */}
            <div className="col-12">
              <label className="form-label small fw-bold text-muted text-uppercase">Açıklama / Notlar</label>
              <textarea className="form-control bg-light" rows="3" value={form.description} onChange={onChange("description")} placeholder="İşlem ile ilgili notlarınız..." />
            </div>
          </div>
        </div>

        <div className="card-footer bg-white py-3 d-flex justify-content-end gap-3 border-top">
          <button className="btn btn-light px-4 fw-bold text-muted" onClick={() => router.back()}>
            <FiX className="me-1" /> İptal
          </button>
          <button className="btn text-white px-5 fw-bold shadow-sm" style={{backgroundColor: "#E92B63", borderRadius: "10px"}} onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Kaydediliyor...</>
            ) : "DEĞİŞİKLİKLERİ KAYDET"}
          </button>
        </div>
      </div>
    </div>
  );
}