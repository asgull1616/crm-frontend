"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from 'next/image';

const carouselImages = [
  "/images/codyol2.jpg",
  "/images/serifsel.jpg",
  "/images/yemek.jpg",
  "/images/ofisbir.jpg",
  "/images/ofisiki.jpg",
  "/images/eqip.jpg"
];

export default function WelcomingPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hover durumlarını takip etmek için state
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: "#111"
    }}>

      {/* Arka Plan Döngüsü */}
      {carouselImages.map((src, index) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 2s ease-in-out",
            filter: "blur(10px)",
            transform: "scale(1.1)",
            zIndex: 0,
          }}
        />
      ))}

      {/* Karartma Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        zIndex: 1
      }} />

      {/* Cam Efektli Kart */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "400px",
        padding: "50px 40px",
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.82)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        borderRadius: "32px",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.4)"
      }}>
        {/* Logo */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "24px",
            margin: "0 auto 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px"
          }}
        >
          <Image
            src="/images/codyol.png"
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "160%",
              height: "160%",
              objectFit: "contain"
            }}
          />
        </div>

        <h2 style={{ color: "#0f172a", marginBottom: "12px", fontWeight: "800", fontSize: "26px" }}>
          Codyol CRM’e Hoş Geldiniz
        </h2>
        <p style={{ color: "#475569", marginBottom: "35px", fontSize: "15px", lineHeight: "1.6" }}>
          Süreçlerinizi tek panelden <br /> <strong>profesyonelce</strong> yönetin.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Giriş Yap Butonu */}
          <button
            onMouseEnter={() => setHoveredBtn('login')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => router.push("/authentication/login/minimal")}
            style={{
              padding: "14px",
              background: "#ff4d6d",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: hoveredBtn === 'login' ? "translateY(-3px)" : "translateY(0)",
              boxShadow: hoveredBtn === 'login' ? "0 10px 20px rgba(255, 77, 109, 0.4)" : "none"
            }}
          >
            Giriş Yap
          </button>

          {/* Kayıt Ol Butonu */}
          <button
            onMouseEnter={() => setHoveredBtn('register')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => router.push("/authentication/register/minimal")}
            style={{
              padding: "14px",
              background: hoveredBtn === 'register' ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.5)",
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: "14px",
              color: "#1e293b",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: hoveredBtn === 'register' ? "translateY(-3px)" : "translateY(0)"
            }}
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
}