"use client";

import React, { useCallback, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { proposalService } from "@/lib/services/proposal.service";
import { customerService } from "@/lib/services/customer.service";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

registerLocale("tr", tr);

export default function ProposalEditContent({ id, onReady }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [totalAmount, setTotalAmount] = useState(0);
  const [validUntil, setValidUntil] = useState(null);
  const [items, setItems] = useState([]); 
  const [customers, setCustomers] = useState([]);

  const handleItemsChange = useCallback((updatedItems) => {
    setItems(updatedItems);
    const grandTotal = (updatedItems || []).reduce((acc, item) => {
      const sub = Number(item.price || 0) * Number(item.qty || 0);
      const tax = sub * (Number(item.tax || 0) / 100);
      return acc + sub + tax;
    }, 0);
    setTotalAmount(grandTotal);
  }, []);

  // ✅ Kaydetme Fonksiyonu (Yönlendirme Eklenmiş)
  // ✅ handleSave fonksiyonun artık 'router'ı görebilir
  const handleSave = useCallback(
    async (send = false) => {
      if (!id) return;
      if (!title?.trim() || !customerId || !validUntil) {
        return alert("Zorunlu alanları doldurunuz.");
      }

      setSaving(true);
      try {
        await proposalService.update(id, {
          title: title.trim(),
          customerId,
          validUntil: validUntil.toISOString(),
          status: send ? "SENT" : status,
          totalAmount: totalAmount,
          items: items.map(item => ({
            product: item.product,
            qty: Number(item.qty),
            price: Number(item.price),
            tax: Number(item.tax)
          }))
        });
        
        // Artık hata vermeyecek:
        router.push(`/proposal/view/${id}`); 
        
      } catch (e) {
        console.error("Hata:", e?.response?.data);
        alert("Güncelleme başarısız.");
      } finally {
        setSaving(false);
      }
    },
    [id, title, customerId, validUntil, status, totalAmount, items, router] // ✅ router bağımlılıkta
  );

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

        const rawCustomers = cRes?.data?.items || cRes?.data?.data || cRes?.data || [];
        setCustomers(Array.isArray(rawCustomers) ? rawCustomers : []);

        const p = pRes.data;
        setTitle(p?.title || "");
        setCustomerId(p?.customerId || "");
        setStatus(p?.status || "DRAFT");
        setTotalAmount(Number(p?.totalAmount) || 0);
        setValidUntil(p?.validUntil ? new Date(p.validUntil) : null);
        
        if (p?.items) {
          setItems(p.items.map(i => ({
            id: i.id,
            product: i.description || i.product,
            qty: i.quantity || i.qty || 1,
            price: i.unitPrice || i.price || 0,
            tax: i.taxRate || i.tax || 20
          })));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    if (!onReady) return;
    onReady({
      onSave: () => handleSave(false),
      onSaveAndSend: () => handleSave(true),
      loading: saving,
    });
  }, [onReady, handleSave, saving]);

  if (loading) return <Loading />;

  return (
    <div className="proposal-edit-wrapper p-3 bg-light min-vh-100">
      <div className="container-fluid">
        <div className="row g-4 justify-content-center">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white pt-4 px-4 border-0">
                 <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="fw-bold text-dark mb-0">Teklif Düzenle</h4>
                        <p className="text-muted small mb-0">Teklif detaylarını ve kalemlerini buradan yönetebilirsiniz.</p>
                    </div>
                    <div className="d-none d-md-block">
                        <span className="badge bg-soft-primary text-primary px-3 py-2">Düzenleme Modu</span>
                    </div>
                 </div>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-lg-4">
                    <label className="form-label fw-bold text-muted small mb-1">TEKLİF BAŞLIĞI</label>
                    <div className="input-group border-2 rounded">
                        <span className="input-group-text bg-white border-0"><i className="feather-type"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-0 ps-0" 
                            placeholder="Teklif konusu..."
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label fw-bold text-muted small mb-1">İLGİLİ MÜŞTERİ</label>
                    <div className="input-group border-2 rounded">
                        <span className="input-group-text bg-white border-0"><i className="feather-user"></i></span>
                        <select 
                            className="form-select border-0 ps-0" 
                            value={customerId} 
                            onChange={(e) => setCustomerId(e.target.value)}
                        >
                          <option value="">Seçiniz...</option>
                          {Array.isArray(customers) && customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.fullName}</option>
                          ))}
                        </select>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label fw-bold text-muted small mb-1">GEÇERLİLİK TARİHİ</label>
                    <div className="input-group border-2 rounded custom-datepicker-group">
                        <span className="input-group-text bg-white border-0"><i className="feather-calendar"></i></span>
                        <DatePicker 
                            selected={validUntil} 
                            onChange={(date) => setValidUntil(date)} 
                            locale="tr" 
                            dateFormat="dd.MM.yyyy" 
                            placeholderText="Tarih seçin"
                            className="form-control border-0 ps-0" 
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <AddProposal previtems={items} onItemsChange={handleItemsChange} />
          </div>

          <div className="col-12 mt-4 text-end">
             <div className="card border-0 bg-dark text-white shadow-lg d-inline-block text-start" style={{ borderRadius: '15px', minWidth: '320px' }}>
                <div className="card-body p-4">
                   <div className="d-flex justify-content-between align-items-center mb-3">
                      <p className="small text-uppercase fw-bold text-white-50 mb-0">Genel Toplam</p>
                      <span className="badge bg-primary">KDV Dahil</span>
                   </div>
                   <h2 className="fw-bold text-info mb-4 text-center text-md-start">
                    ₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                   </h2>
                   <button 
                      className="btn btn-primary w-100 fw-bold py-2 rounded-pill" 
                      onClick={() => handleSave(false)} 
                      disabled={saving}
                   >
                      {saving ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>İŞLENİYOR...</>
                      ) : "DEĞİŞİKLİKLERİ KAYDET"}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .proposal-edit-wrapper {
            font-family: 'Inter', sans-serif;
        }
        .input-group {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0 !important;
            transition: all 0.2s ease;
        }
        .input-group:focus-within {
            border-color: #3b82f6 !important;
            background-color: #fff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .bg-soft-primary {
            background-color: #eff6ff;
        }
        .input-group-text {
            color: #64748b;
        }
        :global(.custom-datepicker-group .react-datepicker-wrapper) {
            flex: 1;
        }
        :global(.custom-datepicker-group .react-datepicker__input-container input) {
            width: 100%;
            height: 100%;
            background: transparent;
        }
        .form-select, .form-control {
            background: transparent;
            box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}