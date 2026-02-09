'use client'
import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const leaveList = [
  { name: "Koray Kaya", type: "Yıllık İzin", avatar: "https://i.pravatar.cc/300?img=11", color: "success" },
  { name: "Ayşegül Özcan", type: "Raporlu", avatar: "https://i.pravatar.cc/300?img=32", color: "danger" },
  { name: "Yunus Emre Arslan", type: "Yıllık İzin", avatar: "https://i.pravatar.cc/300?img=12", color: "success" },
  { name: "Mehmet Kaya", type: "Saatlik İzin", avatar: "https://i.pravatar.cc/300?img=45", color: "warning" },
  { name: "Zeynep Yılmaz", type: "Yıllık İzin", avatar: "https://i.pravatar.cc/300?img=5", color: "success" },
];

const CARD_WIDTH = 200;

const TodayOnLeave = () => {
  const [index, setIndex] = useState(0);

  const maxIndex = leaveList.length - 3; 

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="card border-0 shadow-sm" style={{ paddingBottom: 24 }}>
      <div className="card-body">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <FiCalendar size={22} />
            <h6 className="fs-5 mb-0">Bugün Aktif Olanlar</h6>
          </div>
        </div>

        {/* SLIDER */}
        <div className="position-relative overflow-hidden">

          {/* SOL OK */}
          {index > 0 && (
            <button
              onClick={prev}
              style={arrowStyle("left")}
            >
              <FiChevronLeft size={20} />
            </button>
          )}

          {/* SAĞ OK */}
          {index < maxIndex && (
            <button
              onClick={next}
              style={arrowStyle("right")}
            >
              <FiChevronRight size={20} />
            </button>
          )}

          {/* TRACK */}
          <div
            className="d-flex gap-3"
            style={{
              transform: `translateX(-${index * (CARD_WIDTH + 12)}px)`,
              transition: "transform .3s ease",
            }}
          >
            {leaveList.map((item, i) => (
              <div key={i} style={{ minWidth: CARD_WIDTH }}>
                {/* IMAGE */}
                <div
                  style={{
                    height: 110,
                    borderRadius: 10,
                    backgroundImage: `url(${item.avatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* INFO */}
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
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

const arrowStyle = (side) => ({
  position: "absolute",
  top: "35%",
  [side]: 0,
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  backgroundColor: "rgba(0,0,0,0.45)",
  color: "#fff",
  cursor: "pointer",
  zIndex: 10,
});

export default TodayOnLeave;
