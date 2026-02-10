"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiMapPin,
  FiSave,
  FiChevronDown,
  FiGlobe,
  FiHash,
  FiPieChart,
  FiCheckCircle,
  FiActivity,
  FiClock,
  FiPlusCircle,
} from "react-icons/fi";
import { customerService } from "@/lib/services/customer.service";

const CustomerCreateContent = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+90",
    flag: "TR",
    name: "TURKEY",
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "+90",
    companyName: "",
    designation: "",
    website: "",
    vatNumber: "",
    address: "",
    status: "NEW",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- helpers ---------------- */

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const progress = useMemo(() => {
    const values = Object.values(form).filter(
      (v) => v && v !== "" && v !== "+90",
    );
    return Math.round((values.length / Object.keys(form).length) * 100);
  }, [form]);

  /* ---------------- submit ---------------- */

  const onSubmit = async () => {
    const newErrors = {};

    if (!form.fullName?.trim()) {
      newErrors.fullName = "İsim soyisim zorunlu";
    }

    if (!form.email?.trim()) {
      newErrors.email = "Email zorunlu";
    }

    const phoneDigits = form.phone?.replace(/\D/g, "") || "";
    if (phoneDigits.length < 10) {
      newErrors.phone = "Telefon numarası geçersiz";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== "" && v !== null),
    );

    try {
      setLoading(true);
      await customerService.create(cleanedForm);
      router.push("/customers/list");
    } catch (e) {
      console.error(e);
      alert("Müşteri oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- dropdown close ---------------- */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div
      className="main-content"
      style={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div className="row g-4 align-items-start">
        {/* SOL FORM */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "40px", padding: "50px" }}
          >
            <div className="row g-4">
              {/* FULL NAME */}
              <div className="col-md-6">
                <label className="form-label small text-muted fw-medium">
                  İsim Soyisim
                </label>
                <input
                  className="form-control"
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                />
                {errors.fullName && (
                  <small className="text-danger">{errors.fullName}</small>
                )}
              </div>

              {/* EMAIL */}
              <div className="col-md-6">
                <label className="form-label small text-muted fw-medium">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              {/* PHONE */}
              <div className="col-md-6" ref={dropdownRef}>
                <label className="form-label small text-muted fw-medium">
                  Telefon
                </label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone}</small>
                )}
              </div>

              {/* COMPANY */}
              <div className="col-md-6">
                <label className="form-label small text-muted fw-medium">
                  Şirket
                </label>
                <input
                  className="form-control"
                  value={form.companyName}
                  onChange={(e) => onChange("companyName", e.target.value)}
                />
              </div>

              {/* WEBSITE */}
              <div className="col-md-6">
                <label className="form-label small text-muted fw-medium">
                  Website
                </label>
                <input
                  className="form-control"
                  value={form.website}
                  onChange={(e) => onChange("website", e.target.value)}
                />
              </div>

              {/* VAT */}
              <div className="col-md-6">
                <label className="form-label small text-muted fw-medium">
                  Vergi No
                </label>
                <input
                  className="form-control"
                  value={form.vatNumber}
                  onChange={(e) => onChange("vatNumber", e.target.value)}
                />
              </div>

              {/* ADDRESS */}
              <div className="col-12">
                <label className="form-label small text-muted fw-medium">
                  Adres
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4 gap-2">
              <button className="btn btn-light" onClick={() => router.back()}>
                İptal
              </button>
              <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? "Kaydediliyor..." : "Yeni Müşteri Oluştur"}
              </button>
            </div>
          </div>
        </div>

        {/* SAĞ PANEL */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3">
              <FiPieChart /> İşlem Takibi
            </h6>

            <div className="text-center">
              <h2>%{progress}</h2>
              <small className="text-muted">Doluluk</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateContent;
