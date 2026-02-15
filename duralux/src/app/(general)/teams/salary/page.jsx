"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

const TeamsLeavesPage = () => {
  const router = useRouter();

  useEffect(() => {
    authService
      .me()
      .then((res) => {
        if (res.data.role === "ADMIN") {
          router.replace("/teams/salary/admin");
        } else {
          router.replace("/teams/salary/user");
        }
      })
      .catch(() => {
        router.replace("/authentication/login/cover");
      });
  }, [router]);

  return null;
};

export default TeamsLeavesPage;
