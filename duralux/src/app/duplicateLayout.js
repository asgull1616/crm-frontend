"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/shared/header/Header";
import NavigationManu from "@/components/shared/navigationMenu/NavigationMenu";
import SupportDetails from "@/components/supportDetails";
import useBootstrapUtils from "@/hooks/useBootstrapUtils";
import { authService } from "@/lib/services/auth.service";

export default function DuplicateLayout({ children }) {
  const pathName = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useBootstrapUtils(pathName);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.me(); // 🔥 gerçek auth kontrolü
        setLoading(false);
      } catch {
        router.replace("/authentication/login/minimal");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <>
      <Header />
      <NavigationManu />
      <main className="nxl-container">
        <div className="nxl-content">{children}</div>
      </main>
      <SupportDetails />
    </>
  );
}
