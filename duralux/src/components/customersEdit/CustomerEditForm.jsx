"use client";
import { useState, useEffect } from "react";
import { customerService } from "@/lib/services/customer.service";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişim Kuruldu" },
  { value: "OFFER_SENT", label: "Teklif Gönderildi" },
  { value: "WAITING_APPROVAL", label: "Onay Bekliyor" },
  { value: "APPROVED", label: "Onaylandı" },
  { value: "WON", label: "Kazanıldı" },
  { value: "LOST", label: "Kaybedildi" },
];

const CustomerEditForm = ({ customerId, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    vatNumber: "",
    taxOffice: "",
    bankName: "",
    iban: "",
    website: "",
    address: "",
    designation: "",
    description: "",
    status: "NEW",
  });

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    const res = await customerService.getById(customerId);
    setForm(res.data);
    setLoading(false);
  };

  const updateField = (key, value) => {
    let finalValue = value;

    if (key === "phone") {
      if (!value.startsWith("+90")) finalValue = "+90";
      finalValue = finalValue.replace(/[^\d+]/g, "").substring(0, 13);
    }

    if (key === "vatNumber") {
      finalValue = value.replace(/[^\d]/g, "").substring(0, 11);
    }

    if (key === "iban") {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 26);
    }

    setForm((prev) => ({ ...prev, [key]: finalValue }));
  };

  const submit = async () => {
    await customerService.update(customerId, form);
    onSuccess();
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Ad Soyad</label>
            <input
              className="form-control"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Ünvan</label>
            <input
              className="form-control"
              value={form.designation || ""}
              onChange={(e) => updateField("designation", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">E-posta</label>
            <input
              className="form-control"
              value={form.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Telefon</label>
            <input
              className="form-control"
              value={form.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Firma</label>
            <input
              className="form-control"
              value={form.companyName || ""}
              onChange={(e) => updateField("companyName", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Vergi Dairesi</label>
            <input
              className="form-control"
              value={form.taxOffice || ""}
              onChange={(e) => updateField("taxOffice", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Vergi No</label>
            <input
              className="form-control"
              value={form.vatNumber || ""}
              onChange={(e) => updateField("vatNumber", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Banka Adı</label>
            <input
              className="form-control"
              value={form.bankName || ""}
              onChange={(e) => updateField("bankName", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">IBAN</label>
            <input
              className="form-control"
              value={form.iban || ""}
              onChange={(e) => updateField("iban", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Website</label>
            <input
              className="form-control"
              value={form.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Durum</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Adres</label>
            <input
              className="form-control"
              value={form.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Açıklama</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="col-12 text-end mt-3">
            <button
              className="btn text-white"
              style={{ backgroundColor: "#E92B63" }}
              onClick={submit}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEditForm;
