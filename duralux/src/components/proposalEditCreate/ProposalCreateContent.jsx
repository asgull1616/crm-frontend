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
    
    // Form State
    const [title, setTitle] = useState("");
    const [customerId, setCustomerId] = useState("");
    // Tarih hatasını önlemek için başlangıçta temiz bir tarih objesi
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

    const handleItemsChange = useCallback((updatedItems) => {
        // Backend'in beklediği ProposalItem modeline uygun mapping
        setItems(updatedItems);
        
        const grandTotal = updatedItems.reduce((acc, item) => {
            const sub = Number(item.price || 0) * Number(item.qty || 0);
            const tax = sub * (Number(item.tax || 0) / 100);
            return acc + sub + tax;
        }, 0);
        setTotalAmount(grandTotal);
    }, []);

    const handleCreateProposal = async () => {
        if (!title || !customerId || !validUntil || items.length === 0) {
            alert("Lütfen tüm zorunlu alanları ve en az bir teklif kalemini doldurunuz.");
            return;
        }

        setLoading(true);
        try {
            // Prisma şeması ve DTO ile tam uyumlu payload
            const payload = {
                title,
                customerId,
                validUntil: validUntil.toISOString(),
                status: "SENT",
                totalAmount: totalAmount.toString(), // Decimal için string gönderimi daha güvenlidir
                items: items.map(item => ({
                    product: item.product,
                    qty: Number(item.qty),
                    price: Number(item.price),
                    tax: Number(item.tax)
                }))
            };

            await proposalService.create(payload);
            router.push("/proposal/list");
        } catch (e) {
            console.error("Teklif oluşturma hatası:", e.response?.data || e.message);
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
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '10px', borderTop: '4px solid #1e293b' }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold text-dark mb-1">Resmi Satış Teklifi</h4>
                                    <p className="text-muted small mb-0">Kurumsal standartlara uygun teklif dökümanı hazırlama paneli</p>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">
                                        DURUM: GÖNDERİLECEK
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">Teklif Başlığı / Referans</label>
                                    <input
                                        type="text"
                                        className="form-control border-2 bg-light-subtle"
                                        placeholder="Örn: Yazılım Geliştirme Hizmet Bedeli"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">Muhatap Müşteri</label>
                                    <select
                                        className="form-select border-2 bg-light-subtle"
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                    >
                                        <option value="">Seçim Yapınız...</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.fullName} {c.companyName ? `- ${c.companyName}` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">Geçerlilik Tarihi</label>
                                    <div className="custom-date-picker">
                                        <DatePicker
                                            selected={validUntil}
                                            onChange={(date) => setValidUntil(date)}
                                            locale="tr"
                                            dateFormat="dd.MM.yyyy"
                                            className="form-control border-2 bg-light-subtle w-100"
                                            minDate={new Date()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kalemler Bölümü */}
                    <AddProposal onItemsChange={handleItemsChange} />

                    {/* Finansal Özet Kartı */}
                    <div className="card border-0 shadow-lg mt-4 overflow-hidden" style={{ borderRadius: '12px' }}>
                        <div className="row g-0">
                            <div className="col-md-7 bg-white p-4 d-flex align-items-center">
                                <div className="alert alert-info border-0 bg-info-subtle m-0 w-100">
                                    <i className="feather-info me-2"></i>
                                    Bu teklif onaylandığında ilgili müşteri için otomatik aktivite kaydı oluşturulacaktır.
                                </div>
                            </div>
                            <div className="col-md-5 p-4 text-white" style={{ backgroundColor: '#1e293b' }}>
                                <div className="text-md-end text-center">
                                    <p className="small text-uppercase fw-bold text-white-50 mb-1" style={{ letterSpacing: '1px' }}>Ödenecek Toplam Tutar</p>
                                    <h1 className="display-6 fw-bold mb-3" >
                                        <span className="text-white">
                                        <small className="fs-4 fw-normal opacity-50">₺</small>
                                        </span>
                                        <span className="text-success">
                                        {totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </h1>
                                    <div className="d-flex gap-2 justify-content-md-end justify-content-center">
                                        <button 
                                            type="button" 
                                            onClick={() => router.back()}
                                            className="btn btn-outline-light px-4 border-2 fw-bold"
                                        >
                                            VAZGEÇ
                                        </button>
                                        <button
                                            onClick={handleCreateProposal}
                                            disabled={loading}
                                            className="btn btn-primary px-4 fw-bold shadow"
                                            style={{ backgroundColor: '#3b82f6', border: 'none' }}
                                        >
                                            {loading ? "İŞLENİYOR..." : "ONAYLA VE GÖNDER"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-date-picker :global(.react-datepicker-wrapper) { width: 100%; }
                .form-control:focus, .form-select:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.1) !important;
                }
                .bg-info-subtle { background-color: #e0f2fe !important; color: #0369a1 !important; }
                .bg-soft-primary { background-color: #eef2ff !important; }
            `}</style>
        </div>
    );
};

export default ProposalCreateContent;