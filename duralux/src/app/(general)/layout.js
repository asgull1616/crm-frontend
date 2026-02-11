"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/shared/header/Header";
import NavigationManu from "@/components/shared/navigationMenu/NavigationMenu";
import SupportDetails from "@/components/supportDetails";
import useBootstrapUtils from "@/hooks/useBootstrapUtils";

const layout = ({ children }) => {
  const pathName = usePathname();
  useBootstrapUtils(pathName);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(233,43,99,0.12) 0%, rgba(233,43,99,0) 60%), #f8f9fb",
      }}
    >
      <Header />
      <NavigationManu />

      <main className="nxl-container">
        <div className="nxl-content">{children}</div>
      </main>

      <SupportDetails />
    </div>
  );
};

export default layout;
