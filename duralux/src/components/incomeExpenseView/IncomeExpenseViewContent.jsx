"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";

const badgeType = (type) => (type === "INCOME" ? "bg-success" : "bg-danger");
const typeText = (type) => (type === "INCOME" ? "Gelir" : "Gider");

const pmText = (pm) => {
  switch (pm) {
    case "BANK_TRANSFER":
      return "Banka Havalesi";
    case "CASH":
      return "Nakit";
    case "CREDIT_CARD":
      return "Kredi Kartı";
    case "OTHER":
      return "Diğer";
    default:
      return pm || "-";
  }
};

const formatMoney = (amount, currency = "TRY") => {
  // backend Decimal string gelebilir (örn: "12500.00")
  const n = Number(String(amount ?? "0").replace(",", "."));
  const safe = Number.isFinite(n) ? n : 0;
  const suffix = currency === "TRY" ? "₺" : currency;
  return `${safe.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${suffix}`;
};

export default function IncomeExpenseViewContent({ id }) {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchDetail = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await transactionService.getById(id);
      setData(res.data);
    } catch (e) {
      console.error(e);
      setErrMsg(e?.response?.data?.message || "Kayıt detayı alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const info = useMemo(() => {
    if (!data) return null;

    const dateText = data?.date
      ? new Date(data.date).toLocaleDateString("tr-TR")
      : "-";

    return {
      id: data.id,
      type: data.type,
      dateText,
      category: data.category ?? "-",
      description: data.description ?? "-",
      amountText: formatMoney(data.amount, data.currency),
      currency: data.currency ?? "TRY",
      paymentMethod: pmText(data.paymentMethod),
      referenceNo: data.referenceNo ?? "-",

      customer: data.customer ?? null,
      proposal: data.proposal ?? null,
      createdByUser: data.createdByUser ?? null,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="text-muted">Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="col-12">
        <div className="card border-danger">
          <div className="card-body">
            <div className="fw-semibold text-danger">Hata</div>
            <div className="text-muted">{errMsg}</div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => router.push("/income-expense/list")}
              >
                Listeye Dön
              </button>
              <button className="btn btn-outline-primary" onClick={fetchDetail}>
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="col-12">
      {/* TOP BAR */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0">Gelir / Gider Detay</h5>
            <span className={`badge ${badgeType(info.type)}`}>
              {typeText(info.type)}
            </span>
          </div>
          <div className="text-muted fs-12">Kayıt ID: {info.id}</div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/income-expense/list")}
          >
            Listeye Dön
          </button>

          <button
            className="btn text-white"
            style={{ backgroundColor: "#E92B63", borderColor: "#E92B63" }}
            onClick={() => router.push(`/income-expense/edit/${info.id}`)}
          >
            Düzenle
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="row g-3">
        {/* TRANSACTION CARD */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header fw-semibold">İşlem Bilgileri</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="text-muted fs-12">Tarih</div>
                  <div className="fw-semibold">{info.dateText}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted fs-12">Kategori</div>
                  <div className="fw-semibold">{info.category}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted fs-12">Tutar</div>
                  <div className="fw-bold">{info.amountText}</div>
                </div>

                <div className="col-md-6">
                  <div className="text-muted fs-12">Ödeme Yöntemi</div>
                  <div className="fw-semibold">{info.paymentMethod}</div>
                </div>

                <div className="col-md-6">
                  <div className="text-muted fs-12">Referans No</div>
                  <div className="fw-semibold">{info.referenceNo}</div>
                </div>

                <div className="col-12">
                  <div className="text-muted fs-12">Açıklama</div>
                  <div className="fw-semibold">{info.description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDE CARDS */}
        <div className="col-lg-4">
          {/* CUSTOMER */}
          <div className="card mb-3">
            <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
              <span>Müşteri</span>
              {info.customer?.id ? (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    router.push(`/customers/view/${info.customer.id}`)
                  }
                >
                  Gör
                </button>
              ) : null}
            </div>
            <div className="card-body">
              {info.customer ? (
                <>
                  <div className="text-muted fs-12">Ad Soyad</div>
                  <div className="fw-semibold">{info.customer.fullName}</div>

                  <div className="text-muted fs-12 mt-2">Firma</div>
                  <div className="fw-semibold">
                    {info.customer.companyName || "-"}
                  </div>
                </>
              ) : (
                <div className="text-muted">
                  Bu işlem bir müşteriye bağlı değil.
                </div>
              )}
            </div>
          </div>

          {/* PROPOSAL */}
          <div className="card mb-3">
            <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
              <span>Teklif</span>
              {info.proposal?.id ? (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    router.push(`/proposal/view/${info.proposal.id}`)
                  }
                >
                  Gör
                </button>
              ) : null}
            </div>
            <div className="card-body">
              {info.proposal ? (
                <>
                  <div className="text-muted fs-12">Başlık</div>
                  <div className="fw-semibold">{info.proposal.title}</div>

                  <div className="text-muted fs-12 mt-2">Durum</div>
                  <div className="fw-semibold">{info.proposal.status}</div>
                </>
              ) : (
                <div className="text-muted">
                  Bu işlem bir teklife bağlı değil.
                </div>
              )}
            </div>
          </div>

          {/* CREATED BY */}
          <div className="card">
            <div className="card-header fw-semibold">Oluşturan Kullanıcı</div>
            <div className="card-body">
              {info.createdByUser ? (
                <>
                  <div className="text-muted fs-12">Username</div>
                  <div className="fw-semibold">
                    {info.createdByUser.username}
                  </div>

                  <div className="text-muted fs-12 mt-2">Email</div>
                  <div className="fw-semibold">
                    {info.createdByUser.email || "-"}
                  </div>
                </>
              ) : (
                <div className="text-muted">Kullanıcı bilgisi yok.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
