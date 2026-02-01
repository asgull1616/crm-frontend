'use client'

import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* ================= ADMIN DATA ================= */
const adminLeaveList = [
  {
    name: "Koray Kaya",
    type: "Yıllık İzin",
    avatar: "https://i.pravatar.cc/300?img=11",
    color: "success",
  },
  {
    name: "Ayşegül Özcan",
    type: "Raporlu",
    avatar: "https://i.pravatar.cc/300?img=32",
    color: "danger",
  },
  {
    name: "Yunus Emre Arslan",
    type: "Yıllık İzin",
    avatar: "https://i.pravatar.cc/300?img=12",
    color: "success",
  },
];

/* ================= USER DATA ================= */
const userLeave = {
  type: "Yıllık İzin",
  avatar: "https://i.pravatar.cc/300?img=11",
  color: "success",
};

const CARD_WIDTH = 200;

const TodayOnLeave = ({ role = "admin" }) => {
  const isAdmin = role === "admin";
  const [index, setIndex] = useState(0);

  const maxIndex = adminLeaveList.length - 3;

  const next = () => setIndex((p) => Math.min(p + 1, maxIndex));
  const prev = () => setIndex((p) => Math.max(p - 1, 0));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <FiCalendar size={22} />
            <h6 className="fs-5 mb-0">
              {isAdmin ? "Bugün İzinli Olanlar" : "Bugünkü İzin Durumun"}
            </h6>
          </div>

          {isAdmin && (
            <a href="/teams/leaves/admin" className="small text-muted">
              Tümünü Gör
            </a>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        {isAdmin ? (
          /* ---------- ADMIN SLIDER ---------- */
          <div className="position-relative overflow-hidden">

            {index > 0 && (
              <button onClick={prev} style={arrowStyle("left")}>
                <FiChevronLeft size={20} />
              </button>
            )}

            {index < maxIndex && (
              <button onClick={next} style={arrowStyle("right")}>
                <FiChevronRight size={20} />
              </button>
            )}

            <div
              className="d-flex gap-3"
              style={{
                transform: `translateX(-${index * (CARD_WIDTH + 12)}px)`,
                transition: "transform .3s ease",
              }}
            >
              {adminLeaveList.map((item, i) => (
                <AdminLeaveCard key={i} item={item} />
              ))}
            </div>
          </div>
        ) : (
          /* ---------- USER COMPACT VIEW ---------- */
          <div className="d-flex align-items-center gap-3">
            <img
              src={userLeave.avatar}
              alt=""
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div>
              <div className="fw-semibold fs-6">
                Bugün izindesin
              </div>
              <div className={`text-${userLeave.color} small`}>
                {userLeave.type}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* ================= ADMIN CARD ================= */
const AdminLeaveCard = ({ item }) => (
  <div style={{ minWidth: CARD_WIDTH }}>
    <div
      style={{
        height: 110,
        borderRadius: 10,
        backgroundImage: `url(${item.avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div className="mt-2">
      <div className="fw-semibold fs-6">{item.name}</div>
      <div className="d-flex align-items-center gap-1">
        <FiCalendar size={13} className={`text-${item.color}`} />
        <span className={`text-${item.color} small`}>
          {item.type}
        </span>
      </div>
    </div>
  </div>
);

/* ================= ARROWS ================= */
const arrowStyle = (side) => ({
  position: "absolute",
  top: "35%",
  [side]: 0,
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  backgroundColor: "rgba(0,0,0,0.45)",
  color: "#fff",
  cursor: "pointer",
  zIndex: 10,
});

export default TodayOnLeave;
