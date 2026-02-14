"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* ---------- SECTION COMPONENT ---------- */
function Section({ title, children }) {
  return (
    <div className="employee-section">
      <h3>{title}</h3>
      <div className="section-grid">{children}</div>
    </div>
  );
}

/* ---------- INFO CARD ---------- */
function Info({ label, value }) {
  return (
    <div className="employee-card">
      <span className="label">{label}</span>
      <span className="value">{value || "-"}</span>
    </div>
  );
}

/* ---------- MAIN PAGE ---------- */
export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error("Employee fetch error:", err);
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div className="employee-loading">Yükleniyor...</div>;
  }

  const profile = employee.profile;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("tr-TR") : "-";

  return (
    <div className="employee-detail">

      {/* HEADER */}
      <div className="employee-header">

        {/* AVATAR */}
        <div className="employee-avatar-wrapper">
          {profile?.avatarUrl ? (
            <img
              src={
                profile.avatarUrl.startsWith("data:image")
                  ? profile.avatarUrl
                  : `data:image/png;base64,${profile.avatarUrl}`
              }
              className="employee-avatar-img"
              alt="avatar"
            />
          ) : (
            <div className="employee-avatar">
              {profile?.firstName?.[0]}
              {profile?.lastName?.[0]}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="employee-header-info">
          <h1>
            {profile?.firstName} {profile?.lastName}
          </h1>

          <div className="employee-badges">
            <span className="badge position">
              {profile?.position || "Pozisyon Yok"}
            </span>

            <span className="badge department">
              {employee.teamMemberships?.[0]?.team?.name || "Departman Yok"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="employee-sections">

        {/* ÇALIŞMA */}
        <Section title="Çalışma Bilgileri">
          <Info label="Personel ID:" value={profile?.userId} />
          <Info label="İşe Başlama:" value={formatDate(profile?.startDate)} />
          <Info label="Pozisyon:" value={profile?.position} />
          <Info label="Departman:" value={employee.teamMemberships?.[0]?.team?.name} />
        </Section>

        {/* KİŞİSEL */}
        <Section title="Kişisel Bilgiler">
          <Info label="Doğum Tarihi:" value={formatDate(profile?.birthDate)} />
          <Info label="Kan Grubu:" value={profile?.bloodGroup} />
          <Info label="Telefon:" value={profile?.phone} />
          <Info label="Şehir:" value={profile?.location} />
          <Info label="Adres:" value={profile?.address} />
        </Section>

        {/* FİNANS */}
        <Section title="Finans & Acil Durum">
          <Info label="Banka:" value={profile?.bankName} />
          <Info label="IBAN:" value={profile?.iban} />
          <Info label="Acil Kişi:" value={profile?.emergencyPerson} />
          <Info label="Acil Telefon:" value={profile?.emergencyPhone} />
        </Section>

      </div>

    </div>
  );
}
