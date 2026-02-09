'use client'
import React from "react";
import TeamsStatCard from "./TeamsStatCard";
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiActivity,
  FiDollarSign,
  FiCalendar
} from "react-icons/fi";

const TeamsDashboardCards = ({ role = "admin" }) => {
  const isAdmin = role === "admin";

  const adminStats = [
    {
      title: "Toplam Çalışan",
      value: "84",
      subtitle: "Bu Ay",
      color: "#4CAF50",
      icon: <FiUsers size={24} />,
    },
    {
      title: "Aktif Çalışan",
      value: "76",
      subtitle: "Bugün",
      color: "#35159C",
      icon: <FiUserCheck size={24} />,
    },
    {
      title: "İzinli",
      value: "8",
      subtitle: "Bugün",
      color: "#EF5350",
      icon: <FiClock size={24} />,
    },
    {
      title: "Bekleyen İzin",
      value: "3",
      subtitle: "Onay Bekliyor",
      color: "#FFA726",
      icon: <FiActivity size={24} />,
    },
    {
      title: "Bu Ay Bordro",
      value: "₺1.240.000",
      subtitle: "Toplam",
      color: "#AB47BC",
      icon: <FiDollarSign size={24} />,
    },
  ];

  const userStats = [
    {
      title: "Bu Ayki Maaşım",
      value: "200.00 ₺",
      subtitle: "Şubat",
      color: "#4CAF50",
      icon: <FiDollarSign size={24} />,
    },
    {
      title: "İzin Durumum",
      value: "Onaylı",
      subtitle: "Bugün",
      color: "#35159C",
      icon: <FiClock size={24} />,
    },
    {
      title: "Kalan İzin",
      value: "6 Gün",
      subtitle: "Yıllık",
      color: "#EF5350",
      icon: <FiCalendar size={24} />,
    },
  ];

  if (!isAdmin) {
    return (
      <div className="row g-3 justify-content-center">
        {userStats.map((item, index) => (
          <div key={index} className="col-lg-3 col-md-6 col-12">
            <TeamsStatCard {...item} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* ÜST SATIR – 3 KART */}
<div className="row g-3 justify-content-center">
  {adminStats.slice(0, 3).map((item, index) => (
    <div key={index} className="col-lg-3 col-md-6 col-12">
      <TeamsStatCard {...item} />
    </div>
  ))}
</div>

{/* ALT SATIR – 2 KART (GERÇEK ORTA) */}
<div className="row g-3 mt-1">
  <div className="col-lg-3 col-md-6 col-12 offset-lg-3">
    <TeamsStatCard {...adminStats[3]} />
  </div>

  <div className="col-lg-3 col-md-6 col-12">
    <TeamsStatCard {...adminStats[4]} />
  </div>
</div>

</>
  );
};

export default TeamsDashboardCards;
