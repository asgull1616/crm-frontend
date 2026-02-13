"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";
import {
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiTag,
  FiCreditCard,
  FiHash,
  FiFileText,
  FiUser,
  FiFile,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiInfo,
  FiPieChart,
  FiAlertCircle
} from "react-icons/fi";
import {
  TransactionTypeConfig,
  PaymentMethodLabels,
} from "../../lib/services/enums/transaction.enums";

const formatMoney = (amount, currency = "TRY") => {
  const n = Number(String(amount ?? "0").replace(",", "."));
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe) + " " + (currency === "TRY" ? "₺" : currency);
};

export default function IncomeExpenseViewContent({ id }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getById(id);
      setData(res.data);
    } catch (e) {
      setErrMsg(e?.response?.data?.message || "Kayıt detayı alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const info = useMemo(() => {
    if (!data) return null;
    const total = Number(data.amount) || 0;
    const paid = Number(data.paidAmount) || 0;
    const remaining = total - paid;
    const payPercentage = total > 0 ? Math.min((paid / total) * 100, 100) : 0;

    return {
      ...data,
      payPercentage,
      total,
      paid,
      remaining,
      dateText: data.date ? new Date(data.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "-",
      dueDateText: data.dueDate ? new Date(data.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Vade Belirtilmemiş",
      paymentMethod: PaymentMethodLabels[data.paymentMethod] || data.paymentMethod || "-",
    };
  }, [data]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "600px" }}>
      <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status"></div>
    </div>
  );

  if (errMsg || !info) return <div className="container py-5"><div className="alert alert-danger shadow-sm">{errMsg || "Kayıt bulunamadı"}</div></div>;

  const typeConfig = TransactionTypeConfig[info.type] || {};

  return (
    <div className="container-fluid py-4 px-md-5">
      
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
        <div>
          <button 
            className="btn btn-link text-decoration-none text-muted p-0 mb-2 d-flex align-items-center gap-2 small fw-bold"
            onClick={() => router.push("/income-expense/list")}
          >
            <FiArrowLeft /> LİSTEYE GERİ DÖN
          </button>
          <div className="d-flex align-items-center gap-3">
            <h2 className="fw-bold text-dark mb-0" style={{fontSize: '2rem'}}>İşlem Detayı</h2>
            <span className={`badge rounded-pill px-4 py-2 fs-6 ${typeConfig.class} shadow-sm`}>
              {typeConfig.label || info.type}
            </span>
          </div>
        </div>
        <button 
          className="btn btn-lg px-5 py-3 d-flex align-items-center gap-2 fw-bold shadow-sm text-white"
          style={{ borderRadius: "12px", backgroundColor: "#E92B63", border: "none" }}
          onClick={() => router.push(`/income-expense/edit/${info.id}`)}
        >
          <FiEdit2 /> Düzenle
        </button>
      </div>

      <div className="row g-4">
        
        {/* LEFT COLUMN */}
        <div className="col-lg-8">
          
          <div className="card border-0 shadow-sm mb-4 rounded-4 bg-white">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <FiActivity className="text-primary" /> Ödeme Analizi
                </h5>
                <span className={`badge px-3 py-2 rounded-pill ${info.remaining <= 0 ? 'bg-success' : 'bg-primary'}`}>
                  %{info.payPercentage.toFixed(0)} Tamamlandı
                </span>
              </div>
              
              <div className="progress mb-5" style={{ height: "16px", borderRadius: "20px", backgroundColor: "#f0f2f5" }}>
                <div 
                  className={`progress-bar progress-bar-striped progress-bar-animated ${info.remaining <= 0 ? 'bg-success' : 'bg-primary'}`} 
                  role="progressbar" 
                  style={{ width: `${info.payPercentage}%`, borderRadius: "20px" }}
                ></div>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-4 rounded-4 shadow-sm border-start border-5 border-primary h-100" style={{ backgroundColor: "#f8fbff" }}>
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-primary fw-bold text-uppercase">Toplam</small>
                      <FiPieChart className="text-primary opacity-50" size={20} />
                    </div>
                    <h3 className="fw-bold mb-0 text-dark">{formatMoney(info.total)}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 rounded-4 shadow-sm border-start border-5 border-success h-100" style={{ backgroundColor: "#f2faf3" }}>
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-success fw-bold text-uppercase">Ödenen</small>
                      <FiCheckCircle className="text-success opacity-50" size={20} />
                    </div>
                    <h3 className="fw-bold mb-0 text-success">{formatMoney(info.paid)}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`p-4 rounded-4 shadow-sm border-start border-5 h-100 ${info.remaining > 0 ? 'border-danger' : 'border-secondary'}`} style={{ backgroundColor: info.remaining > 0 ? "#fff5f5" : "#f8f9fa" }}>
                    <div className="d-flex justify-content-between mb-2">
                      <small className={`${info.remaining > 0 ? 'text-danger' : 'text-muted'} fw-bold text-uppercase`}>Kalan</small>
                      {info.remaining > 0 ? <FiAlertCircle className="text-danger opacity-50" size={20} /> : <FiCheckCircle className="text-muted opacity-50" size={20} />}
                    </div>
                    <h3 className={`fw-bold mb-0 ${info.remaining > 0 ? 'text-danger' : 'text-muted'}`}>{formatMoney(info.remaining)}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white py-4 px-4 border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-dark">
                <FiInfo className="text-primary" /> İşlem Detayları
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <tbody className="fs-6">
                    <tr>
                      <td className="ps-5 py-4 text-muted fw-medium" style={{ width: "35%" }}>İşlem Tarihi</td>
                      <td className="py-4 fw-bold text-dark">{info.dateText}</td>
                    </tr>
                    <tr>
                      <td className="ps-5 py-4 text-muted fw-medium">Vade (Son Ödeme)</td>
                      <td className="py-4 fw-bold text-danger">{info.dueDateText}</td>
                    </tr>
                    <tr>
                      <td className="ps-5 py-4 text-muted fw-medium">Kategori</td>
                      <td className="py-4"><span className="badge bg-light text-dark border px-4 py-2 fs-6">{info.category}</span></td>
                    </tr>
                    <tr>
                      <td className="ps-5 py-4 text-muted fw-medium">Ödeme Yöntemi</td>
                      <td className="py-4 fw-bold text-dark">{info.paymentMethod}</td>
                    </tr>
                    <tr>
                      <td className="ps-5 py-4 text-muted fw-medium">Referans No</td>
                      <td className="py-4"><code className="bg-light px-3 py-1 rounded text-primary fw-bold fs-6">{info.referenceNo || "-"}</code></td>
                    </tr>
                    <tr>
                      <td className="ps-5 py-4 text-muted fw-medium border-0">Açıklama</td>
                      <td className="py-4 text-dark pe-5 border-0" style={{lineHeight: '1.6'}}>{info.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4 rounded-4 p-3 text-center">
            <div className="card-body">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                <FiUser size={40} />
              </div>
              <h4 className="fw-bold text-dark mb-1">{info.customer?.fullName || "Bireysel İşlem"}</h4>
              <p className="text-muted mb-4">{info.customer?.companyName || "Şirket Bilgisi Yok"}</p>
              {info.customer?.id && (
                <button className="btn btn-outline-primary w-100 py-2 fw-bold rounded-3" onClick={() => router.push(`/customers/view/${info.customer.id}`)}>
                  Müşteri Profiline Git
                </button>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-3 text-uppercase small">İLGİLİ TEKLİF</h6>
              {info.proposal ? (
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border border-dashed">
                  <FiFileText size={30} className="text-success" />
                  <div className="overflow-hidden">
                    <h6 className="fw-bold mb-1 text-truncate">{info.proposal.title}</h6>
                    <span className="badge bg-success-subtle text-success small">Aktif Teklif</span>

                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-muted fst-italic">İlişkili teklif bulunamadı.</div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-4 shadow-sm border text-center">
            <p className="text-muted small mb-0">
              Bu kayıt <span className="text-dark fw-bold">{info.createdByUser?.username || "Sistem"}</span> tarafından oluşturulmuştur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}