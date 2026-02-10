"use client";
import React from "react";
import {
  FiMail,
  FiActivity,
  FiBriefcase,
  FiHash,
  FiMapPin,
  FiUser,
  FiGlobe,
} from "react-icons/fi";

const CustomerInfoSection = ({ customer }) => {
  const cardStyle = { borderRadius: "25px", background: "#ffffff" };
  const itemStyle = { backgroundColor: "#F9FAFB" };

  // Veri yoksa "-" gösteren basit bir helper
  const val = (v) => v || "-";

  return (
    <>
      {/* Profil Detayları Kartı */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={cardStyle}>
        <h6
          className="fw-bold mb-4 d-flex align-items-center gap-2"
          style={{ color: "#374151" }}
        >
          <FiUser className="text-muted" /> Profil Detayları
        </h6>
        <div className="vstack gap-3">
          {[
            { label: "E-posta", value: val(customer.email), icon: <FiMail /> },
            {
              label: "Telefon",
              value: val(customer.phone),
              icon: <FiActivity />,
            },
            {
              label: "Şirket",
              value: val(customer.companyName),
              icon: <FiBriefcase />,
            },
            {
              label: "Açıklama",
              value: val(customer.description),
              icon: <FiHash />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="d-flex align-items-center justify-content-between p-3 rounded-4 border-0"
              style={itemStyle}
            >
              <div className="d-flex align-items-center gap-3 text-muted">
                {item.icon}
                <span className="small fw-medium">{item.label}</span>
              </div>
              <span
                className="small fw-bold text-dark text-end"
                style={{ maxWidth: "60%" }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Adres / Diğer Bilgiler Kartı */}
      <div className="card border-0 shadow-sm p-4" style={cardStyle}>
        <h6
          className="fw-bold mb-4 d-flex align-items-center gap-2"
          style={{ color: "#374151" }}
        >
          <FiMapPin className="text-muted" /> İletişim & Konum
        </h6>
        <div className="vstack gap-3">
          <div className="p-3 rounded-4" style={itemStyle}>
            <span className="d-block text-muted small mb-1">
              <FiGlobe className="me-1" /> Website
            </span>
            <span className="small fw-bold text-primary">
              {customer.website || "www.website-yok.com"}
            </span>
          </div>
          <div className="p-3 rounded-4" style={itemStyle}>
            <span className="d-block text-muted small mb-1">Adres Bilgisi</span>
            <span className="small fw-bold">
              {customer.address || "Adres bilgisi girilmemiş."}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerInfoSection;
