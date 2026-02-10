"use client";
import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMoreHorizontal,
} from "react-icons/fi";
import { activityService } from "@/lib/services/activity.service";

// Mevcut form ve modal bileşenlerini çağırıyoruz
import ActivityCreateForm from "./ActivityCreateForm";
import ActivityDetailModal from "./ActivityDetailModal";

const CustomerActivitySection = ({ customerId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(3);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  useEffect(() => {
    if (customerId) loadActivities();
  }, [customerId]);

  const loadActivities = async () => {
    try {
      const res = await activityService.list({ customerId });
      setActivities(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const cardStyle = { borderRadius: "25px", background: "#ffffff" };

  return (
    <>
      {/* 1. KART: Müşteri Yolculuğu */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={cardStyle}>
        <h6
          className="fw-bold mb-4 d-flex align-items-center gap-2"
          style={{ color: "#374151" }}
        >
          <FiActivity className="text-muted" /> Müşteri Durumu
        </h6>

        {/* Stepper Görseli */}
        <div className="position-relative py-4">
          <div
            className="position-absolute w-100 bg-light"
            style={{
              height: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 0,
            }}
          ></div>
          <div
            className="position-absolute bg-success opacity-25"
            style={{
              height: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40%",
              zIndex: 1,
            }}
          ></div>

          <div
            className="d-flex justify-content-between position-relative"
            style={{ zIndex: 2 }}
          >
            {["Lead", "Görüşüldü", "Teklif", "Sözleşme", "Kazanıldı"].map(
              (step, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: idx <= 1 ? "#9FB8A0" : "#fff",
                      border: idx > 1 ? "2px solid #E5E7EB" : "none",
                    }}
                  >
                    {idx <= 1 ? (
                      <FiCheckCircle color="white" size={16} />
                    ) : (
                      <div
                        className="rounded-circle bg-light"
                        style={{ width: "8px", height: "8px" }}
                      ></div>
                    )}
                  </div>
                  <span
                    className="text-muted"
                    style={{ fontSize: "10px", fontWeight: "500" }}
                  >
                    {step}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* 2. KART: HIZLI AKTİVİTE EKLEME */}
      <div className="card border-0 shadow-sm p-3 mb-4" style={cardStyle}>
        <ActivityCreateForm
          customerId={customerId}
          onCreated={loadActivities}
        />
      </div>

      {/* 3. KART: SON İŞLEMLER (LOGLAR) */}
      <div className="card border-0 shadow-sm p-4" style={cardStyle}>
        <h6
          className="fw-bold mb-4 d-flex align-items-center gap-2"
          style={{ color: "#374151" }}
        >
          <FiClock className="text-muted" /> Son İşlemler
        </h6>

        {loading ? (
          <p className="text-muted small">Yükleniyor...</p>
        ) : (
          <div className="vstack gap-3">
            {activities.length === 0 && (
              <span className="text-muted small">Kayıt yok.</span>
            )}

            {activities.slice(0, limit).map((act, i) => (
              <div
                key={act.id}
                className="d-flex align-items-center justify-content-between pb-3 border-bottom cursor-pointer"
                onClick={() => setSelectedActivityId(act.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded-3 text-muted">
                    <FiMail size={14} />
                  </div>
                  <div>
                    <span className="small fw-bold d-block text-dark">
                      {act.title}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>
                      {act.type}
                    </span>
                  </div>
                </div>
                <span
                  className="text-muted text-end"
                  style={{ fontSize: "11px" }}
                >
                  {formatDate(act.createdAt)}
                </span>
              </div>
            ))}

            {activities.length > limit && (
              <button
                className="btn btn-link text-muted p-0 text-decoration-none small"
                onClick={() => setLimit((l) => l + 5)}
              >
                <FiMoreHorizontal /> Daha fazla göster
              </button>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedActivityId && (
        <ActivityDetailModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
          onDeleted={loadActivities}
          onUpdated={loadActivities}
        />
      )}
    </>
  );
};

export default CustomerActivitySection;
