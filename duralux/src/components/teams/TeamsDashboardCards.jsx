'use client'
import React from "react";
import TeamsStatCard from "./TeamsStatCard";
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";


const TeamsDashboardCards = () => {
   const stats = [
  {
    title: "Toplam Çalışan",
    value: "84",
    subtitle: "Bu Ay",
    color: "#4CAF50",
    icon: <FiUsers size={24}/>,
  },
  {
    title: "Aktif Çalışan",
    value: "76",
    subtitle: "Bugün Çalışan",
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
    title: "Toplam Mesai",
    value: "360",
    subtitle: "Bu Ay",
    color: "#FFA726",
    icon: <FiActivity size={24} />,
  },
  {
    title: "Ortalama Performans",
    value: "%82",
    subtitle: "Son 30 gün",
    color: "#AB47BC",
    icon: <FiTrendingUp size={24} />,
  },
];

  return (
    <>
      {/* ÜSTTEKİ 3 KART */}
      <div className="row g-2 mb-2">
        {stats.slice(0, 3).map((item, index) => (
          <div key={index} className="col-lg-3 col-md-6 col-12">
            <TeamsStatCard {...item} />
          </div>
        ))}
      </div>

      {/* ALTTAKİ 2 KART – ORTALI */}
      <div className="row g-2 justify-content-center">
        {stats.slice(3).map((item, index) => (
          <div key={index} className="col-lg-3 col-md-6 col-12">
            <TeamsStatCard {...item} />
          </div>
        ))}
      </div>
    </>
  );
};
export default TeamsDashboardCards;