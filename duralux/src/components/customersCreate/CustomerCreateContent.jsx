"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiBriefcase,
  FiHash,
  FiFileText,
  FiCheckCircle,
  FiPlusCircle,
  FiPieChart,
  FiSave,
  FiX,
  FiCreditCard,
} from "react-icons/fi";
import { customerService } from "@/lib/services/customer.service";
import { validateCustomerForm } from "./validateCustomerForm";

// ---------------------------------------------------------------------------
// 1. ÖNEMLİ DÜZELTME: Alt bileşenler ana bileşenin DIŞINA alındı.
// Bu sayede her render işleminde input focus kaybı yaşanmaz.
// ---------------------------------------------------------------------------

const FormInput = ({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  error,
  placeholder,
  onChange,
  rows,
}) => {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-1 justify-content-between">
        <label
          className="fw-semibold text-dark small"
          style={{ fontSize: "13px" }}
        >
          {label}
        </label>
        {error && (
          <span
            className="text-danger small fw-bold fade-in"
            style={{ fontSize: "11px" }}
          >
            {error}
          </span>
        )}
      </div>
      <div
        className="input-group shadow-sm transition-all"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: error ? "1px solid #dc3545" : "1px solid #eee",
        }}
      >
        <span className="input-group-text border-0 bg-light px-3 text-muted">
          {Icon && <Icon size={18} />}
        </span>

        {type === "textarea" ? (
          <textarea
            className="form-control border-0 py-3 bg-white"
            rows={rows || 3}
            style={{ resize: "none", fontSize: "14px", fontWeight: "500" }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : (
          <input
            type={type}
            className="form-control border-0 py-3 bg-white"
            style={{ fontSize: "14px", fontWeight: "500" }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ANA BİLEŞEN
// ---------------------------------------------------------------------------

const CustomerCreateContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "+90",
    companyName: "",
    designation: "",
    website: "",
    vatNumber: "",
    taxOffice: "",
    bankName: "",
    iban: "",
    address: "",
    description: "",
    status: "NEW",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- helpers ---------------- */

  const handleChange = (field, value) => {
    let finalValue = value;

    // 📱 Telefon Kısıtlaması: +90 ile başlasın, max 13 karakter, sadece rakam
    if (field === "phone") {
      // +90'ın silinmesini engelle
      if (!value.startsWith("+90")) finalValue = "+90";
      // Sadece rakamları ve + işaretini koru, max 13 hane (+90 ve 10 hane)
      const digits = value.replace(/[^\d+]/g, "");
      finalValue = digits.substring(0, 13);
    }

    // 📝 Vergi No / TCKN Kısıtlaması: Sadece rakam, max 11 hane
    if (field === "vatNumber") {
      finalValue = value.replace(/[^\d]/g, "").substring(0, 11);
    }

    // 🏦 IBAN Kısıtlaması (Opsiyonel): TR ile başlasın, max 26 hane
    if (field === "iban") {
      const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      finalValue = upper.substring(0, 26);
    }

    setForm((prev) => ({ ...prev, [field]: finalValue }));
    
    // Hata varsa temizle
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const progress = useMemo(() => {
    const fieldsToCheck = [
      "fullName",
      "email",
      "phone",
      "companyName",
      "website",
      "address",
    ];
    const filled = fieldsToCheck.filter(
      (k) => form[k] && form[k] !== "" && form[k] !== "+90",
    );
    return Math.round((filled.length / fieldsToCheck.length) * 100);
  }, [form]);

  /* ---------------- submit ---------------- */

  const onSubmit = async () => {
    const validationErrors = validateCustomerForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Sayfayı en üste kaydırarak hatayı göster (UX)
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== "" && v !== null),
    );

    try {
      setLoading(true);
      await customerService.create(cleanedForm);
      router.push("/customers/list");
    } catch (err) {
      console.error(err);
      alert("Müşteri oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="main-content"
      style={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER: Sadece Başlık */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 shadow-sm"
        style={{ borderRadius: "20px" }}
      >
        <div>
          <h4 className="fw-bold text-dark mb-1">Yeni Müşteri Kaydı</h4>
          <p className="text-muted small mb-0">
            Sisteme yeni bir müşteri profili tanımlıyorsunuz.
          </p>
        </div>
        {/* Header'daki buton kaldırıldı, aşağıya taşındı */}
      </div>

      <div className="row g-4">
        {/* SOL: FORM ALANI */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "30px", overflow: "hidden" }}
          >
            {/* Pembe Başlık Çizgisi */}
            <div
              className="text-center py-3 border-bottom"
              style={{ backgroundColor: "#fdf2f6" }}
            >
              <span className="fw-bold" style={{ color: "#D95F80" }}>
                <FiUser className="me-2" /> Müşteri Profili
              </span>
            </div>

            <div className="card-body p-5">
              <h6 className="fw-bold mb-4 text-dark">Müşteri Bilgileri:</h6>

              {/* Form Inputları - Artık Props ile yönetiliyor */}
              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="İsim Soyisim:"
                    name="fullName"
                    value={form.fullName}
                    error={errors.fullName}
                    icon={FiUser}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Email:"
                    name="email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    icon={FiMail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Telefon:"
                    name="phone"
                    value={form.phone}
                    error={errors.phone}
                    icon={FiPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Şirket:"
                    name="companyName"
                    value={form.companyName}
                    icon={FiBriefcase}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Unvan / Pozisyon:"
                    name="designation"
                    value={form.designation}
                    icon={FiHash}
                    placeholder="Örn: Pazarlama Müdürü"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Website:"
                    name="website"
                    value={form.website}
                    error={errors.website}
                    icon={FiGlobe}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Vergi Dairesi:"
                    name="taxOffice"
                    value={form.taxOffice}
                    icon={FiHash}
                    placeholder="Örn: Büyük Mükellefler"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Vergi No (VAT):"
                    name="vatNumber"
                    value={form.vatNumber}
                    error={errors.vatNumber}
                    icon={FiHash}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Banka Adı:"
                    name="bankName"
                    value={form.bankName}
                    icon={FiBriefcase}
                    placeholder="Örn: Garanti BBVA"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="IBAN:"
                    name="iban"
                    value={form.iban}
                    icon={FiCreditCard}
                    placeholder="TR00..."
                    onChange={handleChange}
                  />
                </div>
              </div>

              <FormInput
                label="Adres:"
                name="address"
                type="textarea"
                rows={3}
                value={form.address}
                icon={FiMapPin}
                onChange={handleChange}
              />

              <FormInput
                label="Tanım / Notlar:"
                name="description"
                type="textarea"
                rows={3}
                value={form.description}
                icon={FiFileText}
                onChange={handleChange}
              />

              {/* BUTONLAR - EN ALTTA */}
              <hr className="my-4 text-muted opacity-25" />

              <div className="d-flex justify-content-end align-items-center gap-3">
                <button
                  className="btn btn-light rounded-pill px-4 py-2 fw-bold text-muted border"
                  onClick={() => router.back()}
                >
                  <FiX className="me-2" /> VAZGEÇ
                </button>

                <button
                  className="btn text-white px-5 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2 hover-scale"
                  onClick={onSubmit}
                  disabled={loading}
                  style={{
                    backgroundColor: "#D95F80",
                    border: "none",
                    minWidth: "200px",
                    justifyContent: "center",
                  }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <FiSave size={20} />
                  )}
                  {loading ? " KAYDEDİLİYOR..." : " MÜŞTERİ OLUŞTUR"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: TAKİP PANELİ */}
        <div className="col-lg-4">
          {/* 1. İŞLEM TAKİP PANELİ (DOLULUK) */}
          <div
            className="card border-0 shadow-sm mb-4 sticky-top"
            style={{
              borderRadius: "30px",
              padding: "30px",
              top: "20px",
              zIndex: 10,
            }}
          >
            <h6
              className="fw-bold mb-4"
              style={{ color: "#D95F80", fontSize: "14px" }}
            >
              <FiPieChart className="me-2" /> İşlem Takip Paneli
            </h6>

            <div className="d-flex flex-column align-items-center justify-content-center py-4 position-relative">
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: `conic-gradient(#D95F80 ${progress}%, #f3f4f6 0)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: "115px",
                    height: "115px",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h2
                    className="fw-bold mb-0"
                    style={{ color: "#333", fontSize: "2rem" }}
                  >
                    %{progress}
                  </h2>
                  <span
                    className="text-muted"
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                    }}
                  >
                    DOLULUK
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-light p-3 rounded-4 d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted small fw-bold">Veri Kalitesi</span>
              <span
                className={`badge shadow-sm px-3 py-2 ${progress >= 80 ? "bg-success text-white" : "bg-white text-dark"}`}
                style={{ borderRadius: "10px", transition: "all 0.3s" }}
              >
                {progress < 50 ? "Düşük" : progress < 80 ? "Orta" : "Mükemmel"}
              </span>
            </div>

            <div className="mt-4 pt-4 border-top">
              <h6 className="fw-bold mb-3 small text-muted">SÜREÇ TAKİBİ</h6>
              <div className="vstack gap-2">
                <div className="p-3 rounded-3 d-flex align-items-center gap-3 bg-white border">
                  <FiCheckCircle className="text-success" size={18} />
                  <span className="text-dark fw-bold small">
                    Protokol Oluşturuldu
                  </span>
                </div>
                <div className="p-3 rounded-3 d-flex align-items-center gap-3 bg-white border opacity-50">
                  <FiPlusCircle className="text-muted" size={18} />
                  <span className="text-muted fw-bold small">
                    Onay Bekleniyor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale {
          transition: transform 0.2s ease-in-out;
        }
        .hover-scale:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }
        .hover-scale:active {
          transform: translateY(0);
        }

        .form-control:focus {
          box-shadow: none;
          background-color: #fff;
        }
        .input-group:focus-within {
          border-color: #d95f80 !important;
          box-shadow: 0 0 0 4px rgba(217, 95, 128, 0.1) !important;
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerCreateContent;
