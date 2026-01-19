"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SelectDropdown from "@/components/shared/SelectDropdown";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { proposalService } from "@/lib/services/proposal.service";
import {
  propsalRelatedOptions,
  propsalDiscountOptions,
  propsalStatusOptions,
} from "@/utils/options";
import { useEffect } from "react";
import { customerService } from "@/lib/services/customer.service";

const previtems = [
  {
    id: 1,
    product: "",
    qty: 0,
    price: 0,
  },
];

const ProposalCreateContent = () => {
  const [customers, setCustomers] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    customerService.list().then((res) => {
      const list = res?.data?.items || res?.data?.data || res?.data || [];

      setCustomers(list);
    });
  }, []);

  const router = useRouter();
  const { startDate, setStartDate, renderFooter } = useDatePicker();

  const [loading, setLoading] = useState(false);

  // ✅ BACKEND'E GİDEN TEK ALANLAR
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  // ✅ FORM HATALARI (UI)
  const [errors, setErrors] = useState({});

  const validateForm = () => {
  const newErrors = {};

  if (!title.trim()) {
    newErrors.title = "Teklif başlığı zorunludur.";
  }

  if (!customerId) {
    newErrors.customerId = "Müşteri seçilmelidir.";
  }

  if (!startDate) {
    newErrors.validUntil = "Geçerlilik tarihi zorunludur.";
  }

  if (!totalAmount || Number(totalAmount) <= 0) {
    newErrors.totalAmount = "Teklif tutarı zorunludur.";
  }
  if (!status) {
  newErrors.status = "Durum seçilmelidir.";
}


  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const handleCreateProposal = async (send = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await proposalService.create({
        title,
        customerId,
        validUntil: startDate.toISOString(),
        status: send ? "SENT" : status.toUpperCase(),
        totalAmount: totalAmount ? totalAmount : undefined,
      });

      router.push("/proposal/list");
    } catch (e) {
      console.error("BACKEND ERROR:", e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="col-xl-6">
        <div className="card stretch stretch-full">
          <div className="card-body">
            {/* 🔹 Teklif Başlığı */}
            <div className="mb-4">
              <label className="form-label">
                Teklif Başlığı <span className="text-danger">*</span>
              </label>
              <input
  type="text"
  className={`form-control ${errors.title ? "is-invalid" : ""}`}
  placeholder="Konu"
  value={title}
  onChange={(e) => {
    setTitle(e.target.value);
    setErrors({ ...errors, title: null });
  }}
/>

{errors.title && (
  <div className="text-danger mt-1">{errors.title}</div>
)}

            </div>

            <div className="mb-4">
  <label className="form-label">
    Müşteri <span className="text-danger">*</span>
  </label>

  <select
    className={`form-control ${errors.customerId ? "is-invalid" : ""}`}
    value={customerId || ""}
    onChange={(e) => {
      setCustomerId(e.target.value);
      setErrors({ ...errors, customerId: null });
    }}
  >
    <option value="">Seçiniz</option>
    {customers.map((c) => (
      <option key={c.id} value={c.id}>
        {c.fullName}
      </option>
    ))}
  </select>

  {/* ✅ HATA MESAJI SELECT DIŞINDA */}
  {errors.customerId && (
    <div className="text-danger mt-1">{errors.customerId}</div>
  )}
</div>

            {/* 🔹 Miktar */}
<div className="mb-4">
  <label className="form-label">
    Miktar <span className="text-danger">*</span>
  </label>

  <input
    type="number"
    className={`form-control no-spinner ${errors.totalAmount ? "is-invalid" : ""}`}
    placeholder="Örn: 1500"
    step="0.01"
    min="0"
    value={totalAmount}
    onChange={(e) => {
      setTotalAmount(e.target.value);
      setErrors({ ...errors, totalAmount: null });
    }}
  />

  {errors.totalAmount && (
    <div className="text-danger mt-1">{errors.totalAmount}</div>
  )}
</div>



            <div className="row">
              {/* 🔹 Geçerlilik Tarihi */}
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Geçerlilik Tarihi <span className="text-danger">*</span>
                </label>
                <div className="input-group date">
                  <DatePicker
  placeholderText="Geçerlilik Tarihi Seçin"
  selected={startDate}
  showPopperArrow={false}
  onChange={(date) => {
    setStartDate(date);
    setErrors({ ...errors, validUntil: null });
  }}
  className={`form-control ${errors.validUntil ? "is-invalid" : ""}`}
  wrapperClassName="w-100"
  popperPlacement="bottom-start"
  calendarContainer={({ children }) => (
    <div className="bg-white react-datepicker">
      {children}
      {renderFooter("start")}
    </div>
  )}
/>

                </div>
              </div>

              {/* 🔹 Durum */}
<div className="col-lg-6 mb-4">
  <label className="form-label">
    Durum <span className="text-danger">*</span>
  </label>

  {/* ⬇️ DatePicker gibi davranan wrapper */}
  <div
    className={`form-control p-0 ${
      errors.status ? "is-invalid" : ""
    }`}
  >
    <SelectDropdown
      options={propsalStatusOptions}
      defaultSelect="Durum Seçin"
      onSelectOption={(option) => {
        setStatus(option?.value?.toUpperCase() ?? null);
        setErrors({ ...errors, status: null });
      }}
    />
  </div>

  {errors.status && (
    <div className="text-danger mt-1">{errors.status}</div>
  )}
</div>





            </div>
          </div>
        </div>
      </div>

      {/* 🔽 Teklif Kalemleri (UI ONLY – BACKEND'E GİTMİYOR) */}
      <AddProposal previtems={previtems} />

      {/* 🔘 AKSİYON BUTONLARI */}
      <div className="mt-4 d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => handleCreateProposal(false)}
          disabled={loading}
        >
          KAYDET
        </button>

        <button
          className="btn btn-primary"
          onClick={() => handleCreateProposal(true)}
          disabled={loading}
        >
          KAYDET & GÖNDER
        </button>
      </div>
    </>
  );
};

export default ProposalCreateContent;