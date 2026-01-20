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
  0
  );
}
