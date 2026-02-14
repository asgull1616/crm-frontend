'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
// Kendi dosya yollarına göre kontrol et
import { profileService } from '../../lib/services/profile.service'; 
import api from '../../lib/axios'; 

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({ fullName: 'Yükleniyor...', role: 'Kullanıcı' });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // profileService.getMe() zaten "profile/me" adresine GET isteği atar
        const res = await profileService.getMe();
        
        if (res.data) {
          // Backend ProfileResponseDto'dan gelen firstName ve lastName alanlarını birleştiriyoruz
          const { firstName, lastName, position } = res.data;
          setUserData({
            fullName: firstName ? `${firstName} ${lastName || ''}` : 'Kullanıcı',
            role: position || 'USER' // ProfileResponseDto'daki position alanını kullanıyoruz
          });
        }
      } catch (err) { 
        console.error("Dropdown veri çekme hatası:", err);
        setUserData({ fullName: 'Misafir', role: 'USER' });
      }
    };
    fetchUserData();
  }, []);

  // Dropdown dışına tıklandığında kapatma mantığı
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Çıkış işlemi: localStorage temizliği ve yönlendirme
  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
      >
        <FaUserCircle size={40} color={isOpen ? '#E8527F' : '#9ca3af'} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '55px', right: '0', backgroundColor: '#fff', 
          borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          minWidth: '220px', zIndex: 100, overflow: 'hidden'
        }}>
          {/* Kullanıcı Bilgi Özeti */}
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserCircle size={30} color="#cbd5e1" />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {userData.fullName}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {userData.role}
              </div>
            </div>
          </div>

          {/* Menü Linkleri */}
          <div style={{ padding: '8px' }}>
            <Link 
              href="/profile" 
              style={{ display: 'flex', alignItems: 'center', padding: '10px', textDecoration: 'none', color: '#475569', fontSize: '14px', borderRadius: '8px' }} 
              onClick={() => setIsOpen(false)}
            >
              <FaUser style={{ marginRight: '10px', color: '#E8527F' }} /> Profilim
            </Link>

            <button 
              onClick={handleLogoutClick}
              style={{ 
                display: 'flex', alignItems: 'center', width: '100%', padding: '10px', 
                color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', 
                borderTop: '1px solid #f1f5f9', marginTop: '5px', fontSize: '14px', textAlign: 'left'
              }}
            >
              <FaSignOutAlt style={{ marginRight: '10px' }} /> Güvenli Çıkış
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;