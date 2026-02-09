'use client';

import React, { useEffect, useState } from 'react';
import { teamService } from '@/lib/services/team.service';
import {
  FiUsers,
  FiBriefcase,
  FiTrendingUp,
} from 'react-icons/fi';

const TeamsOverview = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    teamService.list().then((res) => {
      setTeams(res.data.data || []);
    });
  }, []);

  /* ---------- HESAPLAMALAR ---------- */


// Toplam ekip sayısı
const totalTeams = teams.length;

// Toplam üye sayısı
const totalMembers = teams.reduce(
  (acc, team) => acc + (team.members?.length || 0),
  0
);

// En yüksek üye sayısı
const maxMemberCount = Math.max(
  ...teams.map((t) => t.members?.length || 0),
  0
);

// En kalabalık ekipler (eşitlik varsa hepsi)
const biggestTeams = teams.filter(
  (t) => (t.members?.length || 0) === maxMemberCount
);



  /* ---------- UI ---------- */

  return (
    <div className="teams-overview-grid">

      {/* Toplam Ekip */}
      <div className="overview-card">
        <div className="overview-icon">
          <FiUsers size={22} />
        </div>
        <div>
          <div className="overview-label">Toplam Ekip</div>
          <div className="overview-value">{totalTeams}</div>
        </div>
      </div>

      {/* Toplam Üye */}
      <div className="overview-card">
        <div className="overview-icon">
          <FiBriefcase size={22} />
        </div>
        <div>
          <div className="overview-label">Toplam Üye</div>
          <div className="overview-value">{totalMembers}</div>
        </div>
      </div>

{/* En Kalabalık Ekip */}
<div className="overview-card overview-card-wide">
  <div className="overview-icon">
    <FiTrendingUp size={22} />
  </div>

  <div className="w-100">
    <div className="overview-label">En Kalabalık Ekip</div>

    <div className="overview-value">
      {biggestTeams.length > 0
        ? biggestTeams.map((t) => t.name).join(', ')
        : '-'}
    </div>

    {maxMemberCount > 0 && (
      <>
        <div className="overview-subvalue">
          {maxMemberCount} Üye
        </div>

        <div className="overview-progress">
          <span
            style={{
              width: `${Math.min(maxMemberCount * 10, 100)}%`,
            }}
          />
        </div>
      </>
    )}
  </div>
</div>


    </div>
  );
};

export default TeamsOverview;
