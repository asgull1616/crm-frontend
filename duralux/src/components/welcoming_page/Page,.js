"use client";

import { useRouter } from "next/navigation";

export default function WelcomingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#ff4d6d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          C
        </div>

        {/* Title */}
        <h2 style={{ marginBottom: "10px", fontWeight: "600" }}>
          Codyol CRM’e Hoş Geldiniz
        </h2>

        <p style={{ color: "#6c757d", marginBottom: "30px" }}>
          Tekliflerinizi, ekiplerinizi ve süreçlerinizi tek panelden yönetin.
        </p>

        {/* Buttons */}
        <button
          onClick={() => router.push("/authentication/login")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ff4d6d",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "600",
            marginBottom: "15px",
            cursor: "pointer",
          }}
        >
          Giriş Yap
        </button>

        <button
          onClick={() => router.push("/authentication/register")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#f1f3f5",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}
