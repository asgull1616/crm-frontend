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

  // Kalemler üzerinden finansal detayları hesapla
  const finance = useMemo(() => {
    if (!proposal?.items || !Array.isArray(proposal.items)) return { subTotal: 0, taxTotal: 0 };
    
    return proposal.items.reduce((acc, item) => {
      // Backend ve frontend arasındaki mülk ismi farklarını (unitPrice/price, quantity/qty) normalize et
      const price = Number(item.unitPrice || item.price || 0);
      const qty = Number(item.quantity || item.qty || 0);
      const taxRate = Number(item.taxRate || item.tax || 0);

      const lineTotal = qty * price;
      const taxAmount = lineTotal * (taxRate / 100);
      
      return {
        subTotal: acc.subTotal + lineTotal,
        taxTotal: acc.taxTotal + taxAmount
      };
    }, { subTotal: 0, taxTotal: 0 });
  }, [proposal]);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!proposal) return <div className="alert alert-danger m-4">Teklif kaydı bulunamadı veya erişim yetkiniz yok.</div>;

  const status = STATUS_MAP[proposal.status] || { label: proposal.status, class: "bg-light" };

  return (
    <div className="proposal-view-wrapper p-4">
      {/* ÜST AKSİYON BARI */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href="/proposal/list" className="btn btn-sm btn-outline-secondary border-2 fw-bold">
           <i className="feather-arrow-left me-1"></i> Geri Dön
        </Link>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-dark px-3"><i className="feather-printer me-1"></i> Yazdır</button>
          <Link href={`/proposal/edit/${id}`} className="btn btn-sm btn-primary px-3">Düzenle</Link>
        </div>
      </div>

      <div className="row g-4">
        {/* SOL KOLON: TEKLİF VE KALEMLER */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark">Teklif İçeriği</h5>
                <span className={`badge border px-3 py-2 ${status.class}`}>{status.label}</span>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted small fw-bold">
                    <tr>
                      <th className="ps-4 py-3">AÇIKLAMA / ÜRÜN</th>
                      <th className="text-center">ADET</th>
                      <th className="text-end">BİRİM FİYAT</th>
                      <th className="text-center">KDV</th>
                      <th className="text-end pe-4">TOPLAM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.items && proposal.items.length > 0 ? (
                      proposal.items.map((item, idx) => {
                        const price = Number(item.unitPrice || item.price || 0);
                        const qty = Number(item.quantity || item.qty || 0);
                        return (
                          <tr key={idx}>
                            <td className="ps-4 fw-semibold text-dark">
                              {/* Backend'den description veya product gelebilir */}
                              {item.description || item.product || "-"}
                            </td>
                            <td className="text-center">{qty}</td>
                            <td className="text-end">{formatMoney(price, proposal.currency)}</td>
                            <td className="text-center text-muted">%{item.taxRate || item.tax || 0}</td>
                            <td className="text-end pe-4 fw-bold">
                              {formatMoney(qty * price, proposal.currency)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted small">
                          Bu teklife ait ürün veya hizmet kalemi bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* MÜŞTERİ BİLGİ KARTI */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted text-uppercase mb-3 fs-11" style={{letterSpacing: '1px'}}>Müşteri Bilgileri</h6>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="fw-bold text-dark mb-1">{proposal.customer?.fullName || "-"}</h5>
                  <p className="text-muted mb-0">{proposal.customer?.companyName || "Bireysel Müşteri"}</p>
                </div>
                <div className="col-md-6 border-start text-md-end">
                  <div className="small text-dark mb-1"><i className="feather-mail me-2"></i>{proposal.customer?.email || "-"}</div>
                  <div className="small text-dark"><i className="feather-phone me-2"></i>{proposal.customer?.phone || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: FİNANSAL ÖZET */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm bg-dark text-white mb-4" style={{borderRadius: '12px'}}>
            <div className="card-body p-4 text-center text-md-start">
              <h6 className="text-uppercase fw-bold mb-4 opacity-50 fs-11" style={{letterSpacing: '1.5px'}}>Finansal Özet</h6>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="opacity-75">Ara Toplam</span>
                <span className="fw-semibold">{formatMoney(finance.subTotal, proposal.currency)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="opacity-75">Vergi Tutarı</span>
                <span className="fw-semibold">{formatMoney(finance.taxTotal, proposal.currency)}</span>
              </div>
              
              <hr className="opacity-25" />
              
              <div className="mt-3">
                <span className="small text-uppercase opacity-50 fw-bold">Genel Toplam</span>
                <h2 className="display-6 fw-bold mt-1 mb-0 text-info">
                   {formatMoney(proposal.totalAmount, proposal.currency)}
                </h2>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="fw-bold text-dark mb-3">Zaman Çizelgesi</h6>
              <div className="border-start border-2 ps-3">
                <div className="mb-3">
                  <small className="text-muted d-block">Oluşturulma Tarihi</small>
                  <span className="fw-bold">{formatDateTR(proposal.createdAt)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Son Geçerlilik</small>
                  <span className="fw-bold text-danger">{formatDateTR(proposal.validUntil)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-soft-warning { background-color: #fff9e6; color: #856404 !important; }
        .bg-soft-success { background-color: #e6f7ef; color: #0d6832 !important; }
        .bg-soft-primary { background-color: #eef2ff; color: #3b4ed0 !important; }
        .bg-soft-danger { background-color: #feeef1; color: #dc3545 !important; }
        .fs-11 { font-size: 11px; }
      `}</style>
    </div>
  );
}