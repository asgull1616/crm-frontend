"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import WelcomingPage from "@/components/welcoming_page/Page";

const Page = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await authService.me();
        
        // Giriş başarılıysa yönlendir
        if (res.data.role === "ADMIN") {
          router.replace("/dashboards/analytics/admin");
        } else {
          router.replace("/dashboards/analytics/user");
        }
      } catch (error) {
        // Loglardaki 401 buraya düşer. 
        // Yönlendirme yapmıyoruz, sadece WelcomingPage'i açıyoruz.
        console.log("Oturum yok, Karşılama Sayfası yükleniyor...");
        setIsReady(true);
      }
    };

    checkUser();
  }, [router]);

  // Kontrol tamamlanana kadar (401 dönene kadar) boş ekran veya logo
  if (!isReady) {
    return (
      <div style={{ 
        height: "100vh", 
        backgroundColor: "#f4f6f9", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          border: "3px solid #ccc", 
          borderTopColor: "#ff4d6d", 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite" 
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <WelcomingPage />;
};

export default Page;