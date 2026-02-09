'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding,
  FaPen, FaKey, FaDesktop, FaArrowLeft, FaCalendarAlt
} from 'react-icons/fa';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('info');

  const colors = {
    primary: '#E8527F',
    primarySoft: '#E8527F15',
    textMain: '#1e293b',
    textLight: '#64748b',
    bg: '#f8fafc',
    cardBg: '#ffffff',
    inputBg: '#f1f5f9',
    success: '#10b981',
    danger: '#ef4444'
  };

  const styles = {
    container: { backgroundColor: colors.bg, minHeight: '100vh', padding: '40px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: colors.textMain },
    wrapper: { display: 'flex', gap: '40px', maxWidth: '1600px', margin: '0 auto', alignItems: 'flex-start' },
    backButton: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 0', marginBottom: '10px', color: colors.textLight, textDecoration: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    card: { backgroundColor: colors.cardBg, borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.5)', overflow: 'hidden' },
    leftColumn: { flex: '1', minWidth: '340px', maxWidth: '420px' },
    profileHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 30px 30px 30px', textAlign: 'center' },
    avatar: { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: colors.primarySoft, color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', marginBottom: '20px' },
    name: { fontSize: '26px', fontWeight: '700', margin: '10px 0 5px 0' },
    role: { fontSize: '15px', fontWeight: '500', color: colors.textLight, backgroundColor: '#f1f5f9', padding: '6px 16px', borderRadius: '20px' },
    bioBox: { margin: '0 30px 30px 30px', padding: '25px', backgroundColor: colors.primarySoft, borderRadius: '16px' },
    bioText: { fontSize: '15px', lineHeight: '1.6', fontStyle: 'italic', textAlign: 'center' },
    contactList: { padding: '0 30px 40px 30px', display: 'flex', flexDirection: 'column', gap: '15px' },
    contactItem: { display: 'flex', alignItems: 'center', fontSize: '14px', color: colors.textLight },
    contactIcon: { marginRight: '15px', color: colors.primary },
    rightColumn: { flex: '3', display: 'flex', flexDirection: 'column', gap: '30px' },
    tabContainer: { display: 'inline-flex', backgroundColor: '#e2e8f0', borderRadius: '16px', padding: '6px', alignSelf: 'flex-start' },
    tabButton: (isActive) => ({ padding: '12px 30px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', backgroundColor: isActive ? colors.cardBg : 'transparent', color: isActive ? colors.primary : colors.textLight }),
    contentCard: { padding: '50px', minHeight: '600px' },
    sectionTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: '600', color: '#94a3b8' },
    input: { width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid transparent', backgroundColor: colors.inputBg, fontSize: '15px', color: colors.textMain, outline: 'none' },
    primaryButton: { padding: '16px 40px', backgroundColor: colors.primary, color: '#fff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    securitySection: { marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #f1f5f9' },
    sessionList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    sessionItem: { display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff' },
    sessionIconBox: { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: colors.textLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '15px' },
    sessionInfo: { flex: 1 },
    sessionTitleText: { fontWeight: '600', fontSize: '15px', marginBottom: '2px' },
    sessionMeta: { fontSize: '13px', color: colors.textLight },
    activeBadge: { fontSize: '12px', fontWeight: '700', color: colors.success, backgroundColor: '#d1fae5', padding: '4px 10px', borderRadius: '20px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* SOL KOLON */}
        <div style={styles.leftColumn}>
          <Link href="/" style={styles.backButton}>
            <FaArrowLeft size={14} /> Ana Sayfaya Dön
          </Link>

          <div style={styles.card}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}> <FaUser /> </div>
              <h2 style={styles.name}>Esmanur Erden</h2>
              <span style={styles.role}>Admin & Backend Developer</span>
            </div>
            <div style={styles.bioBox}>
              <p style={styles.bioText}>Codyol projesinde backend mimarisini ve CRM entegrasyonlarını geliştiriyorum.</p>
            </div>
            <div style={styles.contactList}>
              <div style={styles.contactItem}><FaEnvelope style={styles.contactIcon} /> esmanur@codyol.com</div>
              <div style={styles.contactItem}><FaPhone style={styles.contactIcon} /> +90 555 123 45 67</div>
              {/* SOL TARAF: Doğum Tarihi Eklendi */}
              <div style={styles.contactItem}><FaCalendarAlt style={styles.contactIcon} /> 1 Ocak 2000</div>
              <div style={styles.contactItem}><FaBuilding style={styles.contactIcon} /> Codyol Digital Agency</div>
              <div style={styles.contactItem}><FaMapMarkerAlt style={styles.contactIcon} /> İstanbul, Türkiye</div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div style={styles.rightColumn}>
          <div style={styles.tabContainer}>
            <button style={styles.tabButton(activeTab === 'info')} onClick={() => setActiveTab('info')}>Profil Düzenle</button>
            <button style={styles.tabButton(activeTab === 'security')} onClick={() => setActiveTab('security')}>Güvenlik</button>
          </div>

          <div style={{ ...styles.card, ...styles.contentCard }}>
            {/* PROFİL SEKMESİ */}
            {activeTab === 'info' && (
              <>
                <h3 style={styles.sectionTitle}><FaPen style={{color: colors.primary}} size={18}/> Bilgileri Güncelle</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div style={styles.formGroup}><label style={styles.label}>AD</label><input type="text" style={styles.input} /></div>
                  <div style={styles.formGroup}><label style={styles.label}>SOYAD</label><input type="text" style={styles.input} /></div>
                </div>

                {/* SAĞ TARAF: Telefon ve Doğum Tarihi Form Alanları */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div style={styles.formGroup}><label style={styles.label}>TELEFON</label><input type="tel" style={styles.input} placeholder="+90 5XX XXX XX XX" /></div>
                  <div style={styles.formGroup}><label style={styles.label}>DOĞUM TARİHİ</label><input type="date" style={styles.input} /></div>
                </div>

                <div style={styles.formGroup}><label style={styles.label}>E-POSTA</label><input type="email" style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>ÜNVAN</label><input type="text" style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>BİYOGRAFİ</label><textarea rows="4" style={{...styles.input, resize: 'none'}} /></div>
                <div style={{textAlign: 'right'}}><button style={styles.primaryButton}>Değişiklikleri Kaydet</button></div>
              </>
            )}

            {/* GÜVENLİK SEKMESİ */}
            {activeTab === 'security' && (
              <>
                <div style={styles.securitySection}>
                  <h3 style={styles.sectionTitle}><FaKey style={{color: colors.primary}} size={18}/> Şifre Değiştir</h3>
                  <div style={styles.formGroup}><label style={styles.label}>Mevcut Şifre</label><input type="password" style={styles.input} /></div>
                  <div style={{display: 'flex', gap: '20px'}}>
                    <div style={{...styles.formGroup, flex: 1}}><label style={styles.label}>Yeni Şifre</label><input type="password" style={styles.input} /></div>
                    <div style={{...styles.formGroup, flex: 1}}><label style={styles.label}>Yeni Şifre (Tekrar)</label><input type="password" style={styles.input} /></div>
                  </div>
                  <div style={{textAlign: 'right'}}><button style={{...styles.primaryButton, backgroundColor: colors.danger}}>Şifreyi Güncelle</button></div>
                </div>

                <div>
                  <h3 style={styles.sectionTitle}><FaDesktop style={{color: colors.primary}} size={18}/> Aktif Oturumlar</h3>
                  <div style={styles.sessionList}>
                    <div style={styles.sessionItem}>
                      <div style={styles.sessionIconBox}><FaDesktop /></div>
                      <div style={styles.sessionInfo}>
                        <div style={styles.sessionTitleText}>Windows PC - Chrome</div>
                        <div style={styles.sessionMeta}>İstanbul, TR • 192.168.1.1</div>
                      </div>
                      <span style={styles.activeBadge}>Şu An Aktif</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;