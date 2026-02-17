"use client";

import React, { useEffect, useMemo, useState } from "react";
import { proposalService } from "@/lib/services/proposal.service";
import Link from "next/link";

/** YARDIMCI FONKSİYONLAR */
function formatDateTR(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("tr-TR", {
        year: "numeric", month: "long", day: "2-digit",
    });
}

function formatMoney(amount, currency = "TRY") {
    if (amount === null || amount === undefined || amount === "") return "-";
    const num = Number(amount);
    if (isNaN(num)) return "-";
    return new Intl.NumberFormat("tr-TR", {
        style: "currency", currency: currency,
        maximumFractionDigits: 2,
    }).format(num);
}

const STATUS_MAP = {
    DRAFT: { label: "Taslak", class: "bg-soft-warning text-warning border-warning" },
    SENT: { label: "Gönderildi", class: "bg-soft-primary text-primary border-primary" },
    APPROVED: { label: "Kabul Edildi", class: "bg-soft-success text-success border-success" },
    REJECTED: { label: "Reddedildi", class: "bg-soft-danger text-danger border-danger" },
    EXPIRED: { label: "Süresi Doldu", class: "bg-soft-secondary text-secondary border-secondary" },
};

export default function ProposalViewContent({ id }) {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        proposalService.getById(id)
            .then((res) => setProposal(res.data))
            .catch((err) => {
                console.error("Teklif detayı yüklenemedi:", err);
                setProposal(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const finance = useMemo(() => {
        if (!proposal?.items || !Array.isArray(proposal.items)) return { subTotal: 0, taxTotal: 0 };
        return proposal.items.reduce((acc, item) => {
            const price = Number(item.unitPrice || 0);
            const qty = Number(item.quantity || 0);
            const taxRate = Number(item.taxRate || 0);
            const lineTotal = qty * price;
            const taxAmount = lineTotal * (taxRate / 100);
            return {
                subTotal: acc.subTotal + lineTotal,
                taxTotal: acc.taxTotal + taxAmount
            };
        }, { subTotal: 0, taxTotal: 0 });
    }, [proposal]);

    if (loading) return <div className="p-5 text-center"><div className="spinner-border" style={{color: '#E92B63'}}></div></div>;
    if (!proposal) return <div className="alert alert-danger m-4">Teklif kaydı bulunamadı.</div>;

    const status = STATUS_MAP[proposal.status] || { label: proposal.status, class: "bg-light" };

    return (
        <div className="proposal-view-main">
            
            {/* --- 1. EKRAN ARAYÜZÜ (EKRANDA GÖRÜNEN, BASKIDA GİZLENEN) --- */}
            <div className="d-print-none p-4 px-lg-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Link href="/proposal/list" className="btn btn-sm btn-outline-secondary border-2 fw-bold px-3 py-2" style={{borderRadius: '8px'}}>
                       <i className="feather-arrow-left me-1"></i> Geri Dön
                    </Link>
                    <div className="d-flex gap-2">
                        <button onClick={() => window.print()} className="btn btn-sm btn-dark px-3 py-2 fw-bold" style={{borderRadius: '8px'}}>
                            <i className="feather-printer me-1"></i> Yazdır
                        </button>
                        <Link href={`/proposal/edit/${id}`} className="btn btn-sm text-white px-4 py-2 fw-bold" style={{backgroundColor: '#E92B63', borderRadius: '8px'}}>
                            Düzenle
                        </Link>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-xl-8">
                        <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '16px'}}>
                            <div className="card-header bg-white py-4 px-4 border-bottom-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="fw-bold mb-1 text-dark">{proposal.title}</h4>
                                        <p className="text-muted small mb-0">Teklif No: {proposal.code}</p>
                                    </div>
                                    <span className={`badge border px-3 py-2 rounded-pill ${status.class}`} style={{fontSize: '13px'}}>{status.label}</span>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead className="bg-light text-muted small fw-bold">
                                            <tr>
                                                <th className="ps-4 py-3">Ürün / Hizmet</th>
                                                <th className="text-center">Miktar</th>
                                                <th className="text-end">Birim Fiyat</th>
                                                <th className="text-center">KDV</th>
                                                <th className="text-end pe-4">Toplam</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {proposal.items?.map((item, idx) => (
                                                <tr key={idx} className="border-bottom border-light">
                                                    <td className="ps-4 py-3 fw-semibold text-dark">{item.description}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">{formatMoney(item.unitPrice, proposal.currency)}</td>
                                                    <td className="text-center">%{item.taxRate}</td>
                                                    <td className="text-end pe-4 fw-bold">{formatMoney(item.quantity * item.unitPrice, proposal.currency)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '16px', backgroundColor: '#F9FAFB'}}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary small">Ara Toplam</span>
                                    <span className="fw-semibold text-dark">{formatMoney(finance.subTotal, proposal.currency)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-secondary small">Vergi Tutarı</span>
                                    <span className="fw-semibold text-danger">{formatMoney(finance.taxTotal, proposal.currency)}</span>
                                </div>
                                <div className="p-3 bg-white rounded border border-light shadow-sm text-center">
                                    <span className="small text-uppercase text-muted fw-bold">Ödenecek Toplam Tutar</span>
                                    <h2 className="fw-bold mt-1 mb-0" style={{color: '#E92B63'}}>{formatMoney(proposal.totalAmount, proposal.currency)}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. PROFESYONEL BASKI ŞABLONU (SADECE YAZDIRIRKEN GÖRÜNÜR) --- */}
            <div className="print-template d-none d-print-block">
                <header className="print-header">
                    <div className="header-left">
                        <div className="logo-box">ABC</div>
                        <div className="company-info">
                            <strong>ABC ŞİRKETİ A.Ş.</strong>
                            <span>Teknoloji Vadisi No:1, İstanbul</span>
                            <span>www.abc-sirketi.com</span>
                        </div>
                    </div>
                    <div className="header-right text-end">
                        <h1 className="print-doc-title">SATIŞ TEKLİFİ</h1>
                        <p><strong>No:</strong> {proposal.code || "T-2026-001"}</p>
                        <p><strong>Tarih:</strong> {formatDateTR(proposal.createdAt)}</p>
                    </div>
                </header>

                <hr className="print-divider" />

                <div className="print-body">
                    <div className="customer-info-section">
                        <h3 className="section-header">MÜŞTERİ BİLGİLERİ</h3>
                        <div className="customer-details">
                            <p className="cust-name"><strong>{proposal.customer?.fullName}</strong></p>
                            <p>{proposal.customer?.companyName}</p>
                            <p>{proposal.customer?.address}</p>
                            <p>{proposal.customer?.phone} | {proposal.customer?.email}</p>
                        </div>
                    </div>

                    <table className="print-data-table">
                        <thead>
                            <tr>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '50%'}}>Açıklama</th>
                                <th className="text-center">Miktar</th>
                                <th className="text-end">Birim Fiyat</th>
                                <th className="text-end">KDV</th>
                                <th className="text-end">Toplam</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposal.items?.map((item, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.description}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">{formatMoney(item.unitPrice, proposal.currency)}</td>
                                    <td className="text-end">%{item.taxRate}</td>
                                    <td className="text-end">{formatMoney(item.quantity * item.unitPrice, proposal.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="print-summary-area">
                        <div className="summary-row">
                            <span>Ara Toplam:</span>
                            <span>{formatMoney(finance.subTotal, proposal.currency)}</span>
                        </div>
                        <div className="summary-row">
                            <span>KDV Toplamı:</span>
                            <span>{formatMoney(finance.taxTotal, proposal.currency)}</span>
                        </div>
                        <div className="summary-row grand-total-line">
                            <span>GENEL TOPLAM:</span>
                            <span>{formatMoney(proposal.totalAmount, proposal.currency)}</span>
                        </div>
                    </div>
                </div>

                <footer className="print-footer-area">
                    <div className="signature-section">
                        <div className="sig-column">
                            <span className="sig-label">Teklifi Hazırlayan</span>
                            <div className="sig-line"></div>
                            <strong>{proposal.createdBy?.fullName || "Yetkili İsim"}</strong>
                        </div>
                        <div className="sig-column">
                            <span className="sig-label">Müşteri Onayı</span>
                            <div className="sig-line"></div>
                            <strong>{proposal.customer?.fullName}</strong>
                        </div>
                    </div>
                    <div className="print-notes">
                        <p>Bu teklif {formatDateTR(proposal.validUntil)} tarihine kadar geçerlidir. Ödeme vadesi 7 gündür.</p>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                /* EKRAN STİLLERİ */
                .proposal-view-main { background: #f8f9fa; min-height: 100vh; }

                /* YAZDIRMA KRİTİK AYARLARI */
                @media print {
                    @page {
                        size: A4;
                        margin: 0 !important; /* TARAYICI ÜST BİLGİLERİNİ (TARİH/BAŞLIK) SİLER */
                    }

                    :global(body) {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                    }

                    /* Ekrandaki her şeyi (butonlar, kartlar) kesin olarak gizle */
                    .d-print-none { 
                        display: none !important; 
                        height: 0 !important;
                        margin: 0 !important;
                    }
                    
                    /* Baskı Şablonunu Görünür Yap ve Kenar Boşluğu Ekle */
                    .print-template {
                        display: block !important;
                        padding: 20mm !important; /* Belge kenar boşluğu */
                        font-family: 'Inter', sans-serif;
                        color: #000;
                    }

                    .print-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 20px;
                    }

                    .logo-box {
                        background: #000;
                        color: #fff;
                        width: 60px;
                        height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 800;
                        font-size: 18px;
                        border-radius: 6px;
                        margin-bottom: 8px;
                    }

                    .company-info {
                        display: flex;
                        flex-direction: column;
                        font-size: 9pt;
                        line-height: 1.4;
                    }

                    .print-doc-title {
                        font-size: 24pt;
                        font-weight: 900;
                        margin: 0 0 5px 0;
                        letter-spacing: -1px;
                    }

                    .print-divider {
                        border: 0;
                        border-top: 2px solid #000;
                        margin: 15px 0 25px 0;
                    }

                    .section-header {
                        font-size: 10pt;
                        font-weight: bold;
                        color: #666;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                        margin-bottom: 10px;
                    }

                    .customer-details p { margin: 0; font-size: 11pt; }
                    .cust-name { font-size: 12pt !important; margin-bottom: 4px !important; }

                    .print-data-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 30px 0;
                    }

                    .print-data-table th {
                        background-color: #f2f2f2 !important;
                        border: 1px solid #000;
                        padding: 8px;
                        font-size: 9pt;
                        text-align: left;
                        -webkit-print-color-adjust: exact;
                    }

                    .print-data-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        font-size: 10pt;
                    }

                    .print-summary-area {
                        width: 250px;
                        margin-left: auto;
                    }

                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 4px 0;
                        font-size: 10pt;
                    }

                    .grand-total-line {
                        border-top: 2px solid #000;
                        margin-top: 8px;
                        padding-top: 8px;
                        font-weight: bold;
                        font-size: 13pt;
                    }

                    .signature-section {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 60px;
                    }

                    .sig-column {
                        width: 40%;
                        text-align: center;
                    }

                    .sig-label {
                        font-size: 9pt;
                        color: #666;
                        display: block;
                        margin-bottom: 40px;
                    }

                    .sig-line {
                        border-top: 1px solid #000;
                        margin-bottom: 8px;
                    }

                    .print-notes {
                        margin-top: 40px;
                        font-size: 8pt;
                        color: #777;
                        font-style: italic;
                        border-top: 1px solid #eee;
                        padding-top: 10px;
                    }
                }
            `}</style>
        </div>
    );
}