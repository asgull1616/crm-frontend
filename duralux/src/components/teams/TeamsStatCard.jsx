'use client'
import React from "react";

const TeamsStatCard = ({ title, value, subtitle, color, icon }) => {
  return (
    <div
      className="card teams-stat-card border-0 text-white h-100"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        borderRadius: 16,
      }}
    >
      <div className="card-body d-flex flex-column p-3">


        {/* ÜST */}
        <div className="d-flex justify-content-between align-items-start">
          <span className="fs-24 fw-semibold">{title}</span>

          <div className="stat-icon">
            {icon}
          </div>
        </div>

        {/* ALT */}
        <div>
          <h2 className="fw-bold mb-1 text-white fs-1">
            {value}
          </h2>
          <small className="opacity-75 fs-18">
            {subtitle}
          </small>
        </div>

      </div>
    </div>
  );
};

export default TeamsStatCard;
