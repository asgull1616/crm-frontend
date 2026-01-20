"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelectDropdown from "@/components/shared/SelectDropdown";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { proposalService } from "@/lib/services/proposal.service";
import { propsalStatusOptions } from "@/utils/options";
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
  const router = useRouter();
  const { startDate, setStartDate, renderFooter } = useDatePicker();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Backend’e giden alanlar
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const [totalAmount, setTotalAmount] = useState("");

  // ✅ UI validation
  const [errors, setErrors] = useState({});

  // -----------------------
  // FETCH CUSTOMERS
  // -----------------------
  useEffect(() => {
    customerService.list().then((res) => {
      const list = res?.data?.items || res?.data?.data || res?.data || [];
      setCustomers(list);
    });
  }, []);

  // -----------------------
  // VALIDATION
  // -----------------------
  const validateForm = () => {
    const e = {};

    if (!title.trim()) e.title = "Teklif başlığı zorunludur.";
    if (!customerId) e.customerId = "Müşteri seçilmelidir.";
    if (!startDate) e.validUntil = "Geçerlilik tarihi zorunludur.";
    if (!status) e.status = "Durum seçilmelidir.";

    if (!totalAmount || Number(totalAmount) <= 0) {
      e.totalAmount = "Teklif tutarı zorunludur.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // -----------------------
  // SUBMIT
  // -----------------------
  const handleCreateProposal = async (send = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🔒 Decimal string (Prisma safe)
      const normalizedAmount = totalAmount.toString().trim().replace(",", ".");

      // 🔒 Date (timezone safe)
      const isoDate = `${startDate.toISOString().slice(0, 10)}T00:00:00.000Z`;

      await proposalService.create({
        title: title.trim(),
        customerId,
        validUntil: isoDate,
        status: send ? "SENT" : status,
        totalAmount: normalizedAmount,
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
            {/* TITLE */}
            <div className="mb-4">
              <label className="form-label">
                Teklif Başlığı <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
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

            {/* CUSTOMER */}
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
              {errors.customerId && (
                <div className="text-danger mt-1">{errors.customerId}</div>
              )}
            </div>

            {/* AMOUNT */}
            <div className="mb-4">
              <label className="form-label">
                Miktar <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-control no-spinner ${
                  errors.totalAmount ? "is-invalid" : ""
                }`}
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
              {/* DATE */}
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Geçerlilik Tarihi <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(d) => {
                    setStartDate(d);
                    setErrors({ ...errors, validUntil: null });
                  }}
                  className={`form-control ${
                    errors.validUntil ? "is-invalid" : ""
                  }`}
                  calendarContainer={({ children }) => (
                    <div className="bg-white react-datepicker">
                      {children}
                      {renderFooter("start")}
                    </div>
                  )}
                />
                {errors.validUntil && (
                  <div className="text-danger mt-1">{errors.validUntil}</div>
                )}
              </div>

              {/* STATUS */}
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Durum <span className="text-danger">*</span>
                </label>
                <div
                  className={`form-control p-0 ${
                    errors.status ? "is-invalid" : ""
                  }`}
                >
                  <SelectDropdown
                    options={propsalStatusOptions}
                    defaultSelect="Durum Seçin"
                    onSelectOption={(opt) => {
                      setStatus(opt?.value?.toUpperCase());
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

      {/* UI ONLY */}
      <AddProposal previtems={previtems} />

      {/* ACTIONS */}
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
