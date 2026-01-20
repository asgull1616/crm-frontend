"use client";
import React from "react";
import CardHeader from "@/components/shared/CardHeader";
import useCardTitleActions from "@/hooks/useCardTitleActions";

const CoFounderShowcaseCard = () => {
  const { isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  if (isRemoved) return null;

  return (
    <div className="col-xxl-6 col-xl-6">
      <div
        className={`card cofounder-card stretch stretch-full border-0 shadow-sm ${
          isExpanded ? "card-expand" : ""
        }`}
        style={{
          // ✅ Dark/Light uyumlu gradient
          background:
            "linear-gradient(145deg, var(--bs-body-bg) 0%, var(--bs-tertiary-bg) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dekoratif arka plan */}
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "180px",
            height: "180px",
            background: "rgba(0,0,0,0.03)",
            transform: "rotate(45deg)",
            zIndex: 0,
          }}
        />

        <CardHeader
          title="Yönetim & Stratejik Büyüme"
          refresh={handleRefresh}
          remove={handleDelete}
          expanded={handleExpand}
        />

        <div className="card-body p-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            {/* SOL */}
            <div className="col-lg-5 text-center text-lg-start mb-4 mb-lg-0 pe-lg-4 border-end-lg">
              <div className="position-relative d-inline-block mb-3">
                <img
                  src="https://ui-avatars.com/api/?name=Mirza+Pektaş&background=25b865&color=fff&size=128"
                  alt="Mirza Muhittin Pektaş"
                  className="rounded-circle shadow-lg p-1 bg-white"
                  width={100}
                  height={100}
                />
                <div className="position-absolute bottom-0 end-0 bg-primary border border-white rounded-circle p-2" />
              </div>

              {/* ✅ Dark/Light uyumlu isim */}
              <h3 className="fw-bold mb-1 fs-4 text-body-emphasis">
                Mirza Muhittin Pektaş
              </h3>

              {/* ✅ Dark/Light uyumlu ünvan */}
              <p className="small mb-3 text-uppercase fw-semibold text-body-secondary">
                Kurucu Ortak <br /> Yönetim Kurulu Üyesi
              </p>

              {/* ✅ İmza da kaybolmasın */}
              <div
                className="opacity-50 text-body-secondary"
                style={{ fontFamily: "cursive", fontSize: "1.1rem" }}
              >
                Muhittin Pektaş
              </div>
            </div>

            {/* SAĞ */}
            <div className="col-lg-7 ps-lg-4">
              <div className="mb-4 position-relative">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-25 position-absolute"
                  style={{ top: "-20px", left: "-15px" }}
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                </svg>

                <p className="fs-5 fst-italic lh-lg mb-0 ps-3">
                  Başarı tesadüf değildir;{" "}
                  <strong className="text-success">sürdürülebilir büyüme</strong>{" "}
                  ve doğru operasyonel süreçlerin sonucudur. Hedefimiz, CODYOL
                  standartlarını global pazara taşımaktır.
                </p>
              </div>

              <div className="mb-4 d-flex flex-wrap gap-2">
                {[
                  "Operasyonel Mükemmellik",
                  "Finansal Strateji",
                  "Global İş Geliştirme",
                  "Yatırımcı İlişkileri",
                ].map((item, i) => (
                  <span
                    key={i}
                    className="badge rounded-pill border px-3 py-1 text-body"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* ✅ Alt satır da dark mode’da görünür */}
              <div className="pt-3 border-top text-body-secondary small d-flex align-items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Yönetim Kurulu Aktif Üyesi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoFounderShowcaseCard;
