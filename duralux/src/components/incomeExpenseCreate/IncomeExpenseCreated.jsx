"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function IncomeExpenseCreated() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sadece create sayfasında çalışsın
    if (pathname === "/income-expense/create") {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 2000 }}>
      <div className="alert alert-success shadow d-flex align-items-center gap-2">
        <span className="fw-semibold">✔ Kayıt başarıyla oluşturuldu</span>
      </div>
    </div>
  );
}
