"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { customerService } from "@/lib/services/customer.service";
import { FiUser, FiEdit2, FiCreditCard, FiActivity } from "react-icons/fi";
import Link from "next/link";

// Alt Bileşenler
import CustomerInfoSection from "./CustomerInfoSection";
import CustomerPaymentSummary from "./CustomerPaymentSummary";
import CustomerPaymentTable from "./CustomerPaymentTable";
import CustomerActivitySection from "./CustomerActivitySection";
import CustomerProjectsSection from "./CustomerProjectsSection";

const CustomerContent = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Görünüm Modları: "ACTIVITY" (Aktiviteler) veya "PAYMENTS" (Ödemeler)
  const [viewMode, setViewMode] = useState("ACTIVITY");
  
  // Yenileme Anahtarı: Tablo verilerini tazelemek için kullanılır
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (id) loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const res = await customerService.getById(id);
      // Backend'den gelen saf veriyi doğrudan set ediyoruz
      setCustomer(res.data); 
    } catch (error) {
      console.error("Müşteri detayları yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center text-muted">Yükleniyor...</div>;
  if (!customer) return <div className="p-5 text-center text-danger">Müşteri bulunamadı.</div>;

  const containerStyle = { backgroundColor: "#F9FAFB", minHeight: "100vh", padding: "20px" };
  const cardStyle = { borderRadius: "30px", padding: "35px", background: "#ffffff" };
  const avatarStyle = { width: "100px", height: "100px", color: "#D95F80", backgroundColor: "#f8f9fa" };

  return (
    <div style={containerStyle} className="font-inter">
      {/* 1. ÜST PANEL (HEADER) */}
      <div className="card border-0 shadow-sm mb-4" style={cardStyle}>
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0" style={avatarStyle}>
            <FiUser size={45} />
          </div>

          <div className="flex-grow-1">
            <h2 className="fw-bold mb-0" style={{ color: "#1F2937" }}>{customer.fullName}</h2>
            <p className="text-muted mb-0">{customer.companyName || "Bireysel Müşteri"}</p>
          </div>

          <div className="d-flex gap-2">
            <button
              className={`btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm transition-all ${viewMode === "ACTIVITY" ? 'btn-primary text-white' : 'btn-light text-muted'}`}
              onClick={() => setViewMode("ACTIVITY")}
            >
              <FiActivity /> AKTİVİTELER
            </button>
            
            <button
              className={`btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm transition-all ${viewMode === "PAYMENTS" ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode("PAYMENTS")}
            >
              <FiCreditCard /> ÖDEMELER
            </button>

            <Link 
              href={`/customers/edit/${customer.id}`}
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
              style={{ width: "45px", height: "45px" }}
            >
              <FiEdit2 size={18} className="text-muted" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. İÇERİK ALANI */}
      {viewMode === "PAYMENTS" ? (
        <>
          {/* Ödemeler Modu */}
          <CustomerPaymentSummary customerId={customer.id} key={`summary-${refreshKey}`} />
          <div className="row g-4 mt-2">
            <div className="col-lg-4">
              <CustomerInfoSection customer={customer} />
            </div>
            <div className="col-lg-8">
              <CustomerPaymentTable customerId={customer.id} key={`table-${refreshKey}`} />
            </div>
          </div>
        </>
      ) : (
        /* Aktivite & Durum Modu */
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="vstack gap-4">
              <CustomerInfoSection customer={customer} />
              <CustomerProjectsSection customerId={customer.id} />
            </div>
          </div>
          <div className="col-lg-6">
            <CustomerActivitySection 
              customerId={customer.id} 
              customerStatus={customer.status} // 🟢 Durum bilgisini buraya bağladık
              onUpdate={loadCustomer} // 🔄 Durum değişince sayfayı yenile
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default CustomerContent;