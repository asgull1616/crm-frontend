"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EmployeeCardView from "@/components/teams/employee/EmployeeCardView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setEmployee(data);
      
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div className="employee-loading">Yükleniyor...</div>;
  }

  return <EmployeeCardView employee={employee} />;
}
