"use client";
import React from "react";
import { 
  FiUser, FiPhone, FiMail, FiFileText, FiCreditCard, FiMapPin, FiBriefcase 
} from "react-icons/fi";

const CustomerInfoSection = ({ customer }) => {
  if (!customer) return null;

  const cardStyle = { borderRadius: "25px", background: "#ffffff" };
  const itemStyle = { backgroundColor: "#F9FAFB", borderRadius: "15px" };
  const labelStyle = { fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px', color: '#9CA3AF' };

  return (
    <div className="customer-profile-sidebar">
      {/* ANA KİMLİK KARTI */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={cardStyle}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="rounded-4 d-flex align-items-center justify-content-center shadow-sm" 
               style={{ width: "64px", height: "64px", backgroundColor: "#E92B63" }}>
            <span className="text-white fw-bold fs-3">{customer.fullName?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h5 className="fw-bold mb-0 text-dark">{customer.companyName || customer.fullName}</h5>
            <small className="text-muted fw-medium">Müşteri Kimlik Kartı</small>
          </div>
        </div>

        <div className="vstack gap-3">
          {/* YETKİLİ KİŞİ */}
          <div className="p-3" style={itemStyle}>
            <small className="text-uppercase d-block mb-1" style={labelStyle}>Yetkili Kişi</small>
            <div className="d-flex align-items-center gap-2">
              <FiUser className="text-muted" size={14}/>
              <span className="fw-bold text-dark small">{customer.fullName || "-"}</span>
            </div>
          </div>

          {/* İLETİŞİM GRUBU */}
          <div className="row g-2">
            <div className="col-6">
              <div className="p-3 h-100" style={itemStyle}>
                <small className="text-uppercase d-block mb-1" style={labelStyle}>Telefon</small>
                <span className="small text-dark fw-bold">{customer.phone || "-"}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 h-100" style={itemStyle}>
                <small className="text-uppercase d-block mb-1" style={labelStyle}>E-posta</small>
                <span className="small text-dark fw-bold text-truncate d-block">{customer.email || "-"}</span>
              </div>
            </div>
          </div>

          {/* VERGİ BİLGİSİ */}
          <div className="p-3" style={itemStyle}>
            <small className="text-uppercase d-block mb-1" style={labelStyle}>Vergi Dairesi / No</small>
            <div className="d-flex align-items-center gap-2">
              <FiFileText className="text-muted" size={14}/>
              <span className="fw-bold text-dark small">
                {customer.taxOffice || "-"} / {customer.vatNumber || "-"}
              </span>
            </div>
          </div>

          {/* BANKA BİLGİSİ */}
          <div className="p-3" style={itemStyle}>
            <small className="text-uppercase d-block mb-1" style={labelStyle}>Banka / IBAN</small>
            <div className="d-flex align-items-center gap-2">
              <FiCreditCard className="text-muted" size={14}/>
              <span className="fw-bold small" style={{ color: "#E92B63", wordBreak: 'break-all' }}>
                {customer.bankName || "Belirtilmemiş"} - {customer.iban || "IBAN Girilmemiş"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ADRES */}
      <div className="card border-0 shadow-sm p-4" style={cardStyle}>
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-muted small">
          <FiMapPin /> KONUM & ADRES
        </h6>
        <div className="p-3" style={itemStyle}>
          <span className="small text-secondary fw-medium" style={{ lineHeight: '1.5' }}>
            {customer.address || "Adres bilgisi mevcut değil."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoSection;