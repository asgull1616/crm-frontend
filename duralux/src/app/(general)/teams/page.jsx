'use client'

import TeamsDashboardCards from "@/components/teams/TeamsDashboardCards";
import TodayOnLeave from "@/components/teams/TodayOnLeave";
import TodayActiveEmployees from "@/components/teams/TodayActiveEmployees";

export default function TeamsPage() {
  const role = "admin"; 

  return (
    <div className="container-fluid py-4">
      <TeamsDashboardCards role={role} />

     <div className="row g-3 mt-4 align-items-stretch">
  <div className="col-lg-6 col-12">
    <TodayOnLeave role={role} />
  </div>
  <div className="col-lg-6 col-12">
    <TodayActiveEmployees role={role} />
  </div>
</div>

    </div>
  );
}
