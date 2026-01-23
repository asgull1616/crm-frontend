'use client'
import React from "react";

const TeamsStatCard = ({ title, value, subtitle, color, icon }) => {
  return (
    <div
      className="card border-0 h-90 text-white"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        borderRadius: "16px",
      }}
    >
      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="fs-24 fw-semibold">{title}</span>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 60,
              height: 60,
              backgroundColor: "rgba(255,255,255,0.25)",
              transition: "transform .2s ease, box-shadow .2s ease",
            }}
          >
            {icon}
          </div>
        </div>

        <div>
         <h2 className="fw-bold mb-1 text-white fs-1">{value}</h2>
         <small className="opacity-75 fs-18">{subtitle}</small>
        </div>
      </div>
    </div>
  );
};



export default TeamsStatCard;
