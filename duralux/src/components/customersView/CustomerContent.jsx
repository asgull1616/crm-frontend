"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { customerService } from "@/lib/services/customer.service";
import { FiUser, FiPlus, FiEdit2 } from "react-icons/fi";

// Alt bileşenleri içeri alıyoruz (.jsx oldukları için import ederken uzantı yazmana gerek yok)
import CustomerInfoSection from "./CustomerInfoSection";
import CustomerActivitySection from "./CustomerActivitySection";

const CustomerContent = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      const res = await customerService.getById(id);
      setCustomer(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center text-muted">
        Müşteri verileri yükleniyor...
      </div>
    );
  if (!customer)
    return (
      <div className="p-5 text-center text-danger">Müşteri bulunamadı.</div>
    );

  // --- TASARIM STİLLERİ ---
  const containerStyle = {
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
    padding: "20px",
  };
  const cardStyle = {
    borderRadius: "30px",
    padding: "35px",
    background: "#ffffff",
  };
  const avatarStyle = {
    width: "100px",
    height: "100px",
    color: "#D95F80",
    backgroundColor: "#f8f9fa",
  };
  const badgeStyle = {
    backgroundColor: "#F0FDF4",
    color: "#16A34A",
    fontSize: "11px",
    letterSpacing: "0.5px",
  };

  return (
    <div style={containerStyle} className="font-inter">
      {/* 1. ÜST PROFİL KARTI (HEADER) */}
      <div className="card border-0 shadow-sm mb-4" style={cardStyle}>
        <div className="d-flex align-items-center gap-4 flex-wrap">
          {/* Profil Avatarı */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
            style={avatarStyle}
          >
            <FiUser size={45} />
          </div>

          {/* İsim ve Üyelik Bilgisi */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h2 className="fw-bold mb-0" style={{ color: "#1F2937" }}>
                {customer.fullName}
              </h2>
              <span className="badge rounded-pill px-3 py-2" style={badgeStyle}>
                {customer.status || "AKTİF"}
              </span>
              <span className="text-muted small ms-2">ID: #{customer.id}</span>
            </div>
            <p className="text-muted mb-0">
              {customer.companyName || "Şirket Belirtilmemiş"} |{" "}
              {customer.city || "Konum Yok"}
            </p>
            <span className="text-muted" style={{ fontSize: "12px" }}>
              Oluşturulma:{" "}
              {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
            </span>
          </div>

          {/* Aksiyon Butonları */}
          <div className="d-flex gap-2">
            <button
              className="btn rounded-pill px-4 py-2 text-white fw-bold d-flex align-items-center gap-2 shadow-sm"
              style={{
                backgroundColor: "#D95F80",
                border: "none",
                fontSize: "13px",
              }}
              onClick={() => alert("Görev ekleme modalı açılacak")}
            >
              <FiPlus /> GÖREV EKLE
            </button>
            <button
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "45px", height: "45px" }}
            >
              <FiEdit2 size={18} className="text-muted" />
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* 2. SOL KOLON: PROFİL DETAYLARI */}
        <div className="col-lg-6">
          <CustomerInfoSection customer={customer} />
        </div>

        {/* 3. SAĞ KOLON: AKTİVİTE VE YOLCULUK */}
        <div className="col-lg-6">
          <CustomerActivitySection customerId={customer.id} />
        </div>
      </div>

      <style jsx global>{`
        .font-inter {
          font-family: "Inter", sans-serif;
        }
        .card {
          transition: transform 0.2s;
        }
        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default CustomerContent;
