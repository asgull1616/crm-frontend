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
  const [validUntil, setValidUntil] = useState(null);
  const [items, setItems] = useState([]); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [customers, setCustomers] = useState([]);

  // 🔹 Ücreti hesaplayan fonksiyon (KDV dahil)
  const calculateTotal = (itemList) => {
    return (itemList || []).reduce((acc, item) => {
      const sub = Number(item.price || 0) * Number(item.qty || 1);
      const tax = sub * (Number(item.tax || 20) / 100);
      return acc + sub + tax;
    }, 0);
  };

  const handleItemsChange = useCallback((updatedItems) => {
    setItems(updatedItems);
    setTotalAmount(calculateTotal(updatedItems));
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [pRes, cRes] = await Promise.all([
          proposalService.getById(id),
          customerService.list({ page: 1, limit: 100 }),
        ]);

        const rawCustomers = cRes?.data?.items || cRes?.data || [];
        setCustomers(Array.isArray(rawCustomers) ? rawCustomers : []);

        const p = pRes.data;
        setTitle(p?.title || "");
        setCustomerId(p?.customerId || p?.customer?.id || "");
        setValidUntil(p?.validUntil ? new Date(p.validUntil) : null);
        
        // 🔹 ÜCRET VE KALEM EŞLEŞTİRMESİ
        if (p?.items && Array.isArray(p.items)) {
          const mapped = p.items.map(i => ({
            id: i.id || Math.random(),
            product: i.product || i.description || "", 
            content: i.content || i.description || "", 
            guaranty: i.guaranty || i.warranty || "2 Yıl", 
            qty: Number(i.qty || i.quantity || 1),
            price: Number(i.price || i.unitPrice || 0), // 👈 Fiyat buraya doluyor
            tax: Number(i.tax || i.taxRate || 20)
          }));
          setItems(mapped);
          
          // Eğer backend'de hazır toplam varsa onu al, yoksa kalemlerden hesapla
          setTotalAmount(p.totalAmount || calculateTotal(mapped));
        }
      } catch (err) {
        console.error("Veri yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="p-4" style={{ backgroundColor: '#F8F9FD', minHeight: '100vh' }}>
      <div className="container-fluid">
        {/* Üst Bilgiler */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label fw-bold text-muted small text-uppercase">PROJE ADI / REFERANS</label>
                <input type="text" className="form-control bg-light border-0 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold text-muted small text-uppercase">MUHATAP MÜŞTERİ</label>
                <select className="form-select bg-light border-0 py-2" value={customerId} onChange={(e)=>setCustomerId(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold text-muted small text-uppercase">GEÇERLİLİK TARİHİ</label>
                <DatePicker selected={validUntil} onChange={d=>setValidUntil(d)} locale="tr" dateFormat="dd.MM.yyyy" className="form-control bg-light border-0 py-2" />
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Ücretlerin dolu geldiği tablo */}
        <AddProposal previtems={items} onItemsChange={handleItemsChange} />

        {/* 🔹 Sağ alt köşedeki ücret kartı */}
        <div className="d-flex justify-content-end mt-4">
          <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px', minWidth: '450px' }}>
            <div className="row g-0">
              <div className="col-6 p-4 bg-white d-flex align-items-center">
                <p className="mb-0 text-muted small px-3 font-italic">Teklif kalemlerini düzenledikçe toplam ücret otomatik güncellenir.</p>
              </div>
              <div className="col-6 p-4 text-white d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#E92B63' }}>
                <p className="small text-uppercase fw-bold mb-1 opacity-75">ÖDENECEK TOPLAM TUTAR</p>
                <h2 className="fw-bold mb-3">₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <div className="d-flex gap-3 w-100 px-3">
                  <button className="btn btn-link text-white text-decoration-none fw-bold p-0" onClick={() => router.back()}>VAZGEÇ</button>
                  <button className="btn btn-white w-100 fw-bold py-2 rounded-pill shadow-sm bg-white" style={{ color: '#E92B63' }} disabled={saving}>
                    {saving ? "..." : "KAYDET"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}