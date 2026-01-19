"use client";
import React from "react";
import CardHeader from "@/components/shared/CardHeader";
import useCardTitleActions from "@/hooks/useCardTitleActions";

const CoFounderShowcaseCard = () => {
  const {
    refreshKey,
    isRemoved,
    isExpanded,
    handleRefresh,
    handleExpand,
    handleDelete,
  } = useCardTitleActions();

  if (isRemoved) return null;

  return (
    <div className="col-xxl-6 col-xl-6">
      {" "}
      {/* BURAYI 6 YAPTIK Kİ YARI YARIYA OLSUN */}
      <div
        className={`card stretch stretch-full border-0 shadow-sm ${
          isExpanded ? "card-expand" : ""
        }`}
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Arka plan dekoratif kare (Ömer Bey'de daire vardı, burada fark olsun diye karemsi yapı) */}
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "180px",
            height: "180px",
            background: "rgba(0,0,0,0.02)",
            transform: "rotate(45deg)",
            zIndex: 0,
          }}
        />

        <CardHeader
          title={"Yönetim & Stratejik Büyüme"}
          refresh={handleRefresh}
          remove={handleDelete}
          expanded={handleExpand}
        />

        <div className="card-body p-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            {/* SOL TARAF: PROFİL FOTOĞRAFI & İSİM */}
            <div className="col-lg-5 text-center text-lg-start mb-4 mb-lg-0 border-end-lg pe-lg-4">
              <div className="position-relative d-inline-block mb-3">
                {/* BURAYA MİRZA BEY'İN FOTOĞRAFI */}
                <img
                  src="https://ui-avatars.com/api/?name=Mirza+Pektaş&background=25b865&color=fff&size=128"
                  alt="Mirza Muhittin Pektaş"
                  className="rounded-circle shadow-lg p-1 bg-white"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                {/* Mavi yerine Yeşil tık (Operasyon/Başarı rengi) */}
                <div
                  className="position-absolute bottom-0 end-0 bg-primary border border-white rounded-circle p-2"
                  title="Yönetici"
                ></div>
              </div>

              <h3 className="fw-bold mb-1 text-dark fs-4">Mirza M. Pektaş</h3>
              <p
                className="text-muted small mb-3 text-uppercase fw-semibold tracking-wide"
                style={{ fontSize: "0.70rem", letterSpacing: "0.5px" }}
              >
                Kurucu Ortak &<br />
                Yönetim Kurulu Üyesi
              </p>

              {/* Islak İmza Efekti */}
              <div
                className="opacity-50 text-primary"
                style={{ fontFamily: "cursive", fontSize: "1.1rem" }}
              >
                Mirza Pektaş
              </div>
            </div>

            {/* SAĞ TARAF: STRATEJİ VE HEDEFLER */}
            <div className="col-lg-7 ps-lg-4">
              {/* ALINTI KISMI */}
              <div className="mb-4 position-relative">
                {/* Tırnak İşareti İkonu */}
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-muted opacity-25 position-absolute"
                  style={{ top: "-20px", left: "-15px" }}
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                </svg>

                <p
                  className="fs-6 text-dark lh-base mb-0 ps-3"
                  style={{ fontWeight: "500" }}
                >
                  Başarı tesadüf değildir;{" "}
                  <span className="text-success fw-bold">
                    sürdürülebilir büyüme
                  </span>{" "}
                  ve doğru operasyonel süreçlerin sonucudur. Hedefimiz, CODYOL
                  standartlarını global pazara taşımaktır.
                </p>
              </div>

              {/* YETKİNLİK ROZETLERİ (Yeşil/Mavi tonlar) */}
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Operasyonel Mükemmellik",
                    "Finansal Strateji",
                    "Global İş Geliştirme",
                    "Yatırımcı İlişkileri",
                  ].map((item, index) => (
                    <span
                      key={index}
                      className="badge rounded-pill border py-1 px-2 fw-normal"
                      style={{
                        background: "#e6f8f0", // Hafif yeşil arka plan
                        color: "#0ca678", // Koyu yeşil yazı
                        border: "1px solid #c3fae8",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* ALT BİLGİ */}
              <div className="pt-3 border-top mt-auto">
                <div className="d-flex align-items-center gap-2 text-muted fs-12">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Yönetim Kurulu Aktif Üyesi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoFounderShowcaseCard;
