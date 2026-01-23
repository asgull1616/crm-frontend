import React from "react";
import TeamsDashboardCards from "@/components/teams/TeamsDashboardCards";
import TodayOnLeave from "@/components/teams/TodayOnLeave";
import TodayActiveEmployees from "@/components/teams/TodayActiveEmployees";

export default function TeamsPage() {
  return (
    <div className="container-fluid py-4">
      <TeamsDashboardCards />

      <div className="row g-3 mt-3">
        <div className="col-lg-6 col-12">
          <TodayOnLeave />
        </div>

        <div className="col-lg-6 col-12">
          <TodayActiveEmployees />
        </div>
      </div>
    </div>
  );
}
