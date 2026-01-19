"use client";

import React, { useEffect, useMemo, useState } from "react";
import { proposalService } from "@/lib/services/proposal.service";

function formatDateTR(date) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return "-";
  }
}

function formatMoney(amount, currency) {
  if (amount === null || amount === undefined || amount === "") return "-";
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);

  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency || "TRY",
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${num} ${currency || ""}`.trim();
  }
}

function statusLabel(status) {
  const map = {
    DRAFT: "Taslak",
    SENT: "Gönderildi",
    APPROVED: "Kabul Edildi",
    REJECTED: "Reddedildi",
    EXPIRED: "Süresi Doldu",
  };
  return map[status] || status || "-";
}

function statusClass(status) {
  // Bootstrap varianti gibi düşün
  switch (status) {
    case "APPROVED":
      return "badge bg-success";
    case "REJECTED":
      return "badge bg-danger";
    case "SENT":
      return "badge bg-primary";
    case "EXPIRED":
      return "badge bg-secondary";
    default:
      return "badge bg-warning text-dark"; // DRAFT
  }
}

export default function ProposalViewContent({ id }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // axios cancel için signal her projede aynı olmayabiliyor.
        // Çalışmazsa signal satırını kaldırabilirsin.
        const res = await proposalService.getById(id, {
          signal: controller.signal,
        });

        setProposal(res.data);
      } catch (err) {
        // axios hata formatı
        const msg =
          err?.response?.data?.message || err?.message || "Teklif yüklenemedi";
        setErrorMsg(msg);
        setProposal(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  const customer = proposal?.customer || null;

  const headerInfo = useMemo(() => {
    return {
      title: proposal?.title || "-",
      status: proposal?.status || "DRAFT",
      validUntil: proposal?.validUntil,
      createdAt: proposal?.createdAt,
      totalAmount: proposal?.totalAmount,
      currency: proposal?.currency || "TRY",
    };
  }, [proposal]);

  if (loading) return <div className="p-3">Yükleniyor...</div>;

  if (!proposal) {
    return (
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h5 className="mb-2">Teklif bulunamadı</h5>
            <div className="text-muted">
              {errorMsg
                ? `Detay: ${errorMsg}`
                : "Kayıt silinmiş veya erişimin yok."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div>
              <h4 className="mb-2">{headerInfo.title}</h4>
              <div className="text-muted fs-12">
                Oluşturulma: {formatDateTR(headerInfo.createdAt)}
              </div>
            </div>

            <span className={statusClass(headerInfo.status)}>
              {statusLabel(headerInfo.status)}
            </span>
          </div>

          <hr />

          {/* Main Info */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="text-muted fs-12 mb-1">Geçerlilik Tarihi</div>
              <div className="fw-semibold">
                {formatDateTR(headerInfo.validUntil)}
              </div>
            </div>

            <div className="col-md-6">
              <div className="text-muted fs-12 mb-1">Toplam Tutar</div>
              <div className="fw-semibold">
                {formatMoney(headerInfo.totalAmount, headerInfo.currency)}
              </div>
            </div>
          </div>

          <hr />

          {/* Customer Card */}
          <div>
            <h5 className="mb-3">Müşteri Bilgileri</h5>

            {customer ? (
              <div className="border rounded p-3">
                <div className="d-flex align-items-start justify-content-between gap-3">
                  <div>
                    <div className="fw-bold">{customer.fullName || "-"}</div>
                    <div className="text-muted">
                      {customer.companyName || "Şirket bilgisi yok"}
                    </div>
                  </div>

                  {/* istersen buraya müşteri detay linki koyarsın */}
                  {/* <Link href={`/customers/view/${customer.id}`} className="btn btn-sm btn-light">
                    Müşteri Detay
                  </Link> */}
                </div>

                <div className="row mt-3 g-3">
                  <div className="col-md-6">
                    <div className="text-muted fs-12 mb-1">Email</div>
                    <div>{customer.email || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-muted fs-12 mb-1">Telefon</div>
                    <div>{customer.phone || "-"}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted">
                Müşteri bilgisi gelmedi. (Backend `findById` içinde
                include/select gerekli.)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
