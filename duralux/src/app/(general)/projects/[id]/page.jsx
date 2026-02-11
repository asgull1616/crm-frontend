"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const PRIMARY = "#E92B63";

export default function ProjectDetailPage() {
  const { id } = useParams();

  // Şimdilik demo data (backend bağlayınca API'den çekeceğiz)
  const [project] = useState({
    id,
    project: "CRM V2",
    customer: "Dadaylılar",
    type: "Yazılım",
    price: 45000,
    deposit: 5000,
    remaining: 40000,
    deliveryDate: "2026-02-10",
    flowStatus: "Geliştirme",
    stage: "Kodlama",
    team: "Sude",
    paidStatus: "Bekliyor",
    paymentDates: ["2026-02-01", "2026-03-10"],
  });

  return (
    <div style={{ padding: 24 }}>
      {/* ÜST KART */}
      <div style={topCard}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: PRIMARY }}>
            Proje Kartı
          </div>

          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>
            {project.project}
          </div>

          <div style={{ marginTop: 6, fontWeight: 600, color: "#667085" }}>
            {project.customer}
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          style={btnGhost}
        >
          ← Geri
        </button>
      </div>

      {/* DETAY GRID */}
      <div style={grid}>

        <Card title="Genel Bilgi">
          <Info label="Tür" value={project.type} />
          <Info label="Sorumlu" value={project.team} />
          <Info label="Teslim Tarihi" value={project.deliveryDate} />
        </Card>

        <Card title="Durum">
          <Info label="Durum" value={project.flowStatus} />
          <Info label="Aşama" value={project.stage} />
        </Card>

        <Card title="Finans">
          <Info label="Toplam Fiyat" value={`${project.price} TL`} />
          <Info label="Peşinat" value={`${project.deposit} TL`} />
          <Info label="Kalan" value={`${project.remaining} TL`} />
          <Info label="Ödeme Durumu" value={project.paidStatus} />
        </Card>

        <Card title="Ödeme Tarihleri">
          {project.paymentDates.map((d, i) => (
            <div key={i} style={{ fontWeight: 600, marginBottom: 6 }}>
              {new Date(d).toLocaleDateString("tr-TR")}
            </div>
          ))}
        </Card>

      </div>
    </div>
  );
}

/* small components */

function Card({ title, children }) {
  return (
    <div style={card}>
      <div style={{ fontWeight: 900, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 12, color: "#667085" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

/* styles */

const topCard = {
  background: "#fff",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const grid = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
