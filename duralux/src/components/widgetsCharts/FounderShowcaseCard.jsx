"use client";
import React from "react";
import CardHeader from "@/components/shared/CardHeader";
import useCardTitleActions from "@/hooks/useCardTitleActions";

const FounderShowcaseCard = () => {
  const { isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  if (isRemoved) return null;

  return (
    <div className="col-xxl-6 col-xl-6">
      <div
        className={`card founder-card stretch stretch-full border-0 shadow-sm bg-body-tertiary ${
          isExpanded ? "card-expand" : ""
        }`}
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dekoratif arka plan */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "150px",
            height: "150px",
            background: "rgba(0,0,0,0.03)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <CardHeader
          title="CODYOL Digital Agency • Kurucu Vizyonu"
          refresh={handleRefresh}
          remove={handleDelete}
          expanded={handleExpand}
        />

        <div className="card-body p-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            {/* SOL */}
            <div className="col-lg-4 text-center text-lg-start mb-4 mb-lg-0 pe-lg-5 border-end-lg">
              <div className="position-relative d-inline-block mb-3">
                <img
                  src="https://ui-avatars.com/api/?name=Ömer+Kaya&background=0D0D0D&color=fff&size=128"
                  alt="Ömer Kaya"
                  className="rounded-circle shadow-lg p-1 bg-white"
                  width={100}
                  height={100}
                />
                <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2" />
              </div>

              {/* ✅ Dark/Light uyumlu isim */}
              <h3 className="fw-bold mb-1 fs-4 text-body-emphasis">Ömer Kaya</h3>

              {/* ✅ Dark/Light uyumlu ünvan */}
              <p className="small mb-3 text-uppercase fw-semibold text-body-secondary">
                Kurucu & CEO
              </p>

              {/* ✅ İmza da kaybolmasın */}
              <div
                className="opacity-50 text-body-secondary"
                style={{ fontFamily: "cursive", fontSize: "1.2rem" }}
              >
                Ömer Kaya
              </div>
            </div>

            {/* SAĞ */}
            <div className="col-lg-8 ps-lg-5">
              <div className="mb-4 position-relative">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-25 position-absolute"
                  style={{
                    top: "-25px",
                    left: "-20px",
                    transform: "scale(1.5)",
                  }}
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                </svg>

                <p className="fs-5 fst-italic lh-lg mb-0 ps-3">
                  Dijital dünyada fark yaratmak; sadece yazılım üretmek değil,
                  markaların kimliğini doğru stratejiyle büyütmektir.{" "}
                  <a
                    href="https://codyol.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-bold text-primary text-decoration-none"
                  >
                    CODYOL
                  </a>
                  , bu bakış açısıyla dijital projeleri uçtan uca ele alır.
                </p>
              </div>

              <div className="mb-4">
                <p className="text-uppercase fw-bold fs-11 mb-2 text-body-secondary">
                  Uzmanlık Alanları
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Web & Yazılım Geliştirme",
                    "UI/UX Tasarım",
                    "Dijital Marka Yönetimi",
                    "Growth Hacking",
                    "Stratejik Danışmanlık",
                  ].map((item, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill border px-3 py-2 text-body"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-4">
                <div>
                  <span className="fw-bold d-block text-body-emphasis">
                    CODYOL Vizyonu
                  </span>
                  <span className="small text-body-secondary">
                    Dijitali kodlayan, markaları büyüten ekip
                  </span>
                </div>

                <a
                  href="https://omerkaya.com.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark btn-sm px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                >
                  Portföyü İncele
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderShowcaseCard;
