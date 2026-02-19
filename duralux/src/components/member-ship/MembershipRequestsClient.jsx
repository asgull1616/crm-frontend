"use client";

import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { membershipService } from "@/lib/services/membership.request.service";
import { toast } from "react-hot-toast";

const PRIMARY = "#E92B63";

export default function MembershipRequestsClient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await membershipService.getPendingUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Yükleme hatası:", err);
      toast.error("İstekler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") {
        await membershipService.approveUser(id);
        toast.success("Kullanıcı başarıyla onaylandı!");
      } else {
        await membershipService.rejectUser(id);
        toast.error("Üyelik isteği reddedildi.");
      }
      // Listeyi güncelle (onaylanan/reddedilen kişiyi listeden çıkar)
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      toast.error("İşlem gerçekleştirilemedi.");
    }
  };

  return (
    <>
      <PageHeader title="Üyelik İstekleri" />
      <div style={{ padding: 25 }}>
        {/* İSTATİSTİK KARTI */}
        <div style={topCard}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY, letterSpacing: 1 }}>YÖNETİM PANELİ</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 5, color: "#1D2939" }}>Bekleyen Onaylar</div>
          </div>
          <div style={statBox}>
            <div style={{ fontSize: 12, color: "#667085" }}>Toplam Bekleyen</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#101828" }}>{users.length}</div>
          </div>
        </div>

        {/* TABLO KONTEYNER */}
        <div style={tableCard}>
          <div style={{ padding: "20px 0", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={loadRequests} style={btnRefresh} disabled={loading}>
              {loading ? "Güncelleniyor..." : "🔄 Listeyi Yenile"}
            </button>
          </div>

          <table style={table}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={th}>KULLANICI BİLGİLERİ</th>
                <th style={th}>E-POSTA</th>
                <th style={{ ...th, textAlign: "right" }}>AKSİYONLAR</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={tr}>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={avatar}>{user.username?.charAt(0).toUpperCase()}</div>
                      <span style={{ fontWeight: 600, color: "#344054" }}>{user.username}</span>
                    </div>
                  </td>
                  <td style={td}>{user.email}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button onClick={() => handleAction(user.id, "approve")} style={btnApprove}>ONAYLA</button>
                      <button onClick={() => handleAction(user.id, "reject")} style={btnReject}>REDDET</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} style={{ padding: 50, textAlign: "center", color: "#667085" }}>
                    Şu an bekleyen herhangi bir üyelik isteği bulunmuyor. 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// STİLLER (Proje Temasına Uygun)
const topCard = { background: "#fff", borderRadius: 20, padding: 30, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #EAECF0" };
const statBox = { background: "#FDF2F8", padding: "15px 25px", borderRadius: 15, textAlign: "center", border: "1px solid #FCE7F3" };
const tableCard = { marginTop: 25, background: "#fff", borderRadius: 20, padding: 25, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #EAECF0" };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { padding: "12px 20px", fontSize: 11, color: "#667085", textAlign: "left", borderBottom: "1px solid #EAECF0", letterSpacing: 1 };
const td = { padding: "20px", fontSize: 14, borderBottom: "1px solid #F2F4F7" };
const tr = { transition: "0.2s" };
const avatar = { width: 35, height: 35, borderRadius: "50%", background: "#FCE7F3", color: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 };
const btnApprove = { padding: "8px 18px", borderRadius: 10, border: "none", background: PRIMARY, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 12px rgba(233,43,99,0.2)" };
const btnReject = { padding: "8px 18px", borderRadius: 10, border: "1px solid #FDA29B", background: "#fff", color: "#B42318", fontWeight: 600, fontSize: 12, cursor: "pointer" };
const btnRefresh = { background: "none", border: "none", color: "#667085", fontSize: 13, cursor: "pointer", fontWeight: 500 };