"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DatePicker, { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { proposalService } from "@/lib/services/proposal.service";
import { customerService } from "@/lib/services/customer.service";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("tr", tr);

const ProposalCreateContent = () => {
    const router = useRouter();
    const [customers, setCustomers] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [title, setTitle] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [validUntil, setValidUntil] = useState(new Date(new Date().setHours(23, 59, 59, 999) + 7 * 24 * 60 * 60 * 1000));

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await customerService.list();
                const list = res?.data?.items || res?.data?.data || res?.data || [];
                setCustomers(list);
            } catch (err) {
                console.error("Müşteri listesi yüklenemedi:", err);
            }
        };
        fetchCustomers();
    }, []);

    // ✅ AddProposal'dan gelen güncel kalemleri ve hesaplanmış toplam tutarı yakalıyoruz
    const handleItemsChange = useCallback((updatedItems, calculatedTotal) => {
        setItems(updatedItems);
        setTotalAmount(Number(calculatedTotal));
    }, []);

    const handleCreateProposal = async () => {
        if (!title || !customerId || !validUntil || items.length === 0) {
            alert("Lütfen tüm alanları doldurunuz.");
            return;
        }

        setLoading(true);
        try {
            // ✅ Backend DTO yapısına tam uyumlu Payload
            const payload = {
                title,
                customerId,
                validUntil: validUntil.toISOString(),
                status: "SENT",
                totalAmount: totalAmount.toString(), // Kalemlerin toplamı
                items: items // AddProposal'dan gelen description, quantity, unitPrice, taxRate
            };

            await proposalService.create(payload);
            router.push("/proposal/list");
        } catch (e) {
            console.error("Hata:", e.message);
            alert("Teklif kaydedilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="proposal-form-container pb-5 px-3">
            {loading && <Loading />}

            <div className="row g-4 justify-content-center">
                <div className="col-xl-10">
                    {/* Üst Bilgi Kartı */}
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', borderTop: '5px solid #E92B63' }}>
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">Proje Adı / Referans</label>
                                    <input type="text" className="form-control border-2 bg-light-subtle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Portlink Yazılım Projesi" />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">Muhatap Müşteri</label>
                                    <select className="form-select border-2 bg-light-subtle" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                                        <option value="">Seçiniz...</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.fullName} {c.companyName ? `- ${c.companyName}` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">Geçerlilik Tarihi</label>
                                    <DatePicker selected={validUntil} onChange={(date) => setValidUntil(date)} locale="tr" dateFormat="dd.MM.yyyy" className="form-control border-2 bg-light-subtle w-100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Kalem Ekleme Bileşeni */}
                    <AddProposal onItemsChange={handleItemsChange} />

                    {/* Gradyanlı Özet Kartı */}
                    <div className="card border-0 shadow-lg mt-4 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="row g-0">
                            <div className="col-md-7 bg-white p-4 d-flex align-items-center">
                                <div className="p-3 w-100 rounded" style={{backgroundColor: '#fff1f2', borderLeft: '5px solid #E92B63'}}>
                                    <span style={{color: '#E92B63'}} className="fw-bold small">
                                        <i className="feather-check-circle me-2"></i>
                                        Bu teklif onaylandığında sistem üzerinden otomatik olarak kaydedilecektir.
                                    </span>
                                </div>
                            </div>
                            
                            <div className="col-md-5 p-4 text-white" style={{ background: 'linear-gradient(135deg, #FF4081 0%, #E92B63 50%, #C2185B 100%)' }}>
                                <div className="text-md-end text-center">
                                    <p className="small text-uppercase fw-bold text-white mb-1">ÖDENECEK TOPLAM TUTAR</p>
                                    
                                    <h1 className="display-5 fw-bold mb-4 text-white">
                                        <small className="fs-3 fw-normal">₺</small>
                                        {totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </h1>
                                    
                                    <div className="d-flex gap-4 justify-content-md-end justify-content-center align-items-center">
                                        <button type="button" onClick={() => router.back()} className="btn btn-link text-white text-decoration-none fw-bold px-0">
                                            VAZGEÇ
                                        </button>
                                        <button onClick={handleCreateProposal} disabled={loading} className="btn btn-white px-5 fw-bold shadow-sm" style={{ color: '#E92B63', backgroundColor: '#fff', borderRadius: '10px', border: 'none' }}>
                                            {loading ? "İŞLENİYOR..." : "ONAYLA VE GÖNDER"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalCreateContent;