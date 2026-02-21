'use client'
import React, { useState, useEffect } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, 
  FaUserEdit, FaSave, FaTimes, FaCreditCard, FaBriefcase, 
  FaIdCard, FaLock, FaKey
} from 'react-icons/fa';
import { profileService } from '../../lib/services/profile.service'; 

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const [userData, setUserData] = useState({
    firstName: "", lastName: "", birthDate: "", bloodGroup: "",
    avatarUrl: "", bio: "", phone: "", address: "",
    location: "", position: "", department: "", startDate: "",
    employeeId: "", iban: "", bankName: "", emergencyPerson: "",
    emergencyPhone: "", email: "" 
  });

  // Şifre değişimi için ayrı bir state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const colors = {
    primary: '#E8527F',
    primarySoft: '#E8527F15',
    textMain: '#1e293b',
    textLight: '#64748b',
    bg: '#f8fafc',
    cardBg: '#ffffff',
    inputBg: '#f1f5f9'
  };

  const styles = {
    container: { backgroundColor: colors.bg, minHeight: '100vh', padding: '40px', color: colors.textMain },
    wrapper: { display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' },
    card: { backgroundColor: colors.cardBg, borderRadius: '20px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: colors.primary },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '11px', fontWeight: 'bold', color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: colors.inputBg, outline: 'none', fontSize: '14px' },
    displayValue: { fontSize: '15px', fontWeight: '600', padding: '5px 0', color: colors.textMain },
    passwordBtn: { width: '100%', marginTop: '15px', padding: '12px', borderRadius: '12px', border: `1.5px solid ${colors.primary}`, backgroundColor: 'transparent', color: colors.primary, fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.3s' }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.getMe();
        if (res && res.data) {
          setUserData(res.data);
        }
      } catch (error) {
        console.error("❌ Profil çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const { email, id, userId, createdAt, updatedAt, ...updateData } = userData;
      const res = await profileService.updateMe(updateData);
      if (res.data) {
        setUserData(res.data);
        setIsEditing(false);
        alert("Profil başarıyla güncellendi!");
      }
    } catch (error) {
      alert("Hata: " + (error.response?.data?.message || "İşlem başarısız"));
    }
  };

  // Şifre Güncelleme Fonksiyonu
  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Yeni şifreler birbiriyle uyuşmuyor!");
    }
    try {
      // Backend'de profileService.updatePassword gibi bir metodun olduğunu varsayıyoruz
      // Yoksa bile birazdan backend kısmında bunu ekleyeceğiz
      await profileService.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      alert("Şifreniz başarıyla güncellendi!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordFields(false);
    } catch (error) {
      alert("Şifre güncellenemedi: " + (error.response?.data?.message || "Hata oluştu"));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : "";

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Veriler yükleniyor...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* SOL KOLON */}
        <div style={{ flex: '1', minWidth: '320px' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <img 
                src={userData.avatarUrl || 'https://via.placeholder.com/150'} 
                style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${colors.primarySoft}` }} 
                alt="Avatar"
              />
              <h2 style={{ margin: '20px 0 5px', fontSize: '24px' }}>{userData.firstName} {userData.lastName}</h2>
              <p style={{ color: colors.textLight, fontWeight: '500' }}>{userData.position || 'Pozisyon Belirtilmedi'}</p>
           
            </div>
            
            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}><FaEnvelope color={colors.primary}/> {userData.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}><FaBriefcase color={colors.primary}/> {userData.department || 'Departman Yok'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}><FaMapMarkerAlt color={colors.primary}/> {userData.location || 'Konum Yok'}</div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)} 
              style={{ width: '100%', marginTop: '30px', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: isEditing ? '#64748b' : colors.primary, color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isEditing ? <><FaTimes /> İptal Et</> : <><FaUserEdit /> Profili Düzenle</>}
            </button>

            {/* ŞİFRE DEĞİŞTİRME BÖLÜMÜ */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <button 
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                style={styles.passwordBtn}
              >
                <FaLock size={14} /> {showPasswordFields ? "Kapat" : "Şifreyi Güncelle"}
              </button>

              {showPasswordFields && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fdf2f5', padding: '15px', borderRadius: '15px' }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Mevcut Şifre</label>
                    <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} style={{...styles.input, backgroundColor: '#fff'}} placeholder="••••••" />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Yeni Şifre</label>
                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} style={{...styles.input, backgroundColor: '#fff'}} placeholder="••••••" />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Yeni Şifre (Tekrar)</label>
                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} style={{...styles.input, backgroundColor: '#fff'}} placeholder="••••••" />
                  </div>
                  <button 
                    onClick={handlePasswordUpdate}
                    style={{ ...styles.passwordBtn, backgroundColor: colors.primary, color: 'white', border: 'none' }}
                  >
                    <FaKey size={14} /> Şifreyi Onayla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SAĞ KOLON (Değişmedi, aynı kalıyor) */}
        <div style={{ flex: '2.5' }}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}><FaIdCard /> Kurumsal Bilgiler</div>
            <div style={styles.grid}>
              <InputOrDisplay label="Ad" name="firstName" value={userData.firstName} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Soyad" name="lastName" value={userData.lastName} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Pozisyon" name="position" value={userData.position} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Departman" name="department" value={userData.department} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Personel ID" name="employeeId" value={userData.employeeId} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="İşe Başlama" name="startDate" value={formatDate(userData.startDate)} type="date" isEditing={isEditing} onChange={handleChange} styles={styles} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}><FaCalendarAlt /> Kişisel & İletişim Bilgileri</div>
            <div style={styles.grid}>
              <InputOrDisplay label="Doğum Tarihi" name="birthDate" value={formatDate(userData.birthDate)} type="date" isEditing={isEditing} onChange={handleChange} styles={styles} />
              <div style={styles.inputGroup}>
                <label style={styles.label}>Kan Grubu</label>
                {isEditing ? (
                  <select name="bloodGroup" value={userData.bloodGroup || ""} onChange={handleChange} style={styles.input}>
                    <option value="">Seçiniz</option>
                    {["A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "0 Rh+", "0 Rh-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                ) : <div style={styles.displayValue}>{userData.bloodGroup || "-"}</div>}
              </div>
              <InputOrDisplay label="Telefon" name="phone" value={userData.phone} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Şehir / Ülke" name="location" value={userData.location} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <div style={{ gridColumn: 'span 2', ...styles.inputGroup }}>
                <InputOrDisplay label="Tam Adres" name="address" value={userData.address} isEditing={isEditing} onChange={handleChange} styles={styles} />
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}><FaCreditCard /> Finansal & Acil Durum</div>
            <div style={styles.grid}>
              <InputOrDisplay label="Banka Adı" name="bankName" value={userData.bankName} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="IBAN" name="iban" value={userData.iban} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Acil Durum Kişisi" name="emergencyPerson" value={userData.emergencyPerson} isEditing={isEditing} onChange={handleChange} styles={styles} />
              <InputOrDisplay label="Acil Durum Telefon" name="emergencyPhone" value={userData.emergencyPhone} isEditing={isEditing} onChange={handleChange} styles={styles} />
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
              <button onClick={handleSave} style={{ padding: '16px 50px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                <FaSave /> DEĞİŞİKLİKLERİ KAYDET
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputOrDisplay = ({ label, name, value, isEditing, onChange, styles, type = "text" }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    {isEditing ? (
      <input type={type} name={name} value={value || ""} onChange={onChange} style={styles.input} />
    ) : (
      <div style={styles.displayValue}>{value || "-"}</div>
    )}
  </div>
);

export default UserProfile;