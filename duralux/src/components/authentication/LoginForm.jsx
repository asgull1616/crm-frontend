"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiFacebook, FiGithub, FiTwitter } from "react-icons/fi";
import { authService } from "@/lib/services/auth.service";

const LoginForm = ({ registerPath, resetPath }) => {
  const router = useRouter();

  // 🔹 SADECE STATE EKLENDİ (UI DEĞİŞMEDİ)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ GERÇEK LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1️⃣ SUBMIT ÇALIŞTI");

    setLoading(true);

    try {
      console.log("2️⃣ BACKEND İSTEĞİ ATILIYOR");

      const res = await authService.authenticate({
        username: email,
        password,
      });

      console.log("3️⃣ BACKEND RESPONSE:", res.data);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      console.log(
        "4️⃣ STORAGE KONTROL:",
        localStorage.getItem("accessToken"),
        localStorage.getItem("refreshToken"),
      );

      console.log("5️⃣ DASHBOARD YÖNLENDİRME");
      router.replace("/");
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Giriş Yap</h2>
      <h4 className="fs-13 fw-bold mb-2">Hesaba Giriş Yapın</h4>
      <p className="fs-12 fw-medium text-muted"></p>

      <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Kullanıcı adı veya E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rememberMe"
              />
              <label
                className="custom-control-label c-pointer"
                htmlFor="rememberMe"
              >
                Beni Hatırla
              </label>
            </div>
          </div>
          <div>
            <Link
              href={resetPath}
              className="fs-11"
              style={{ color: "#E93B62" }}
            >
              Şifremi Unuttum
            </Link>

          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="btn btn-lg w-100"
            style={{
              backgroundColor: "#E93B62",
              borderColor: "#E93B62",
              color: "#fff"
            }}
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>

        </div>
      </form>

      <div className="mt-5 text-muted">
        <span> Hesabın Yoksa </span>
        <Link href={registerPath} className="fw-bold">
          {"  "}
          Kayıt Ol{" "}
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
