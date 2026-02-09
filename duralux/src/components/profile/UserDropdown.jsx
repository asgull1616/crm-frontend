'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const styles = {
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '15px',
      cursor: 'pointer'
    },
    triggerButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      transition: 'color 0.2s',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '55px', 
      right: '0',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1)',
      minWidth: '220px',
      zIndex: 100,
      overflow: 'hidden',
    },
    header: {
      padding: '16px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: '#f8fafc'
    },
    headerIcon: {
        fontSize: '32px',
        color: '#cbd5e1'
    },
    userName: {
      margin: 0,
      fontWeight: '700',
      color: '#1e293b',
      fontSize: '14px',
    },
    menuLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      textDecoration: 'none',
      color: '#475569',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left'
    },
    icon: {
      marginRight: '12px',
      fontSize: '16px',
      color: '#64748b',
    },
    signOutLink: {
        borderTop: '1px solid #f1f5f9',
        color: '#ef4444',
    },
    signOutIcon: {
        color: '#ef4444',
        marginRight: '12px',
        fontSize: '16px',
    }
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      
      <button 
        onClick={toggleMenu} 
        style={{...styles.triggerButton, color: isOpen ? '#E8527F' : '#9ca3af'}}
      >
         <FaUserCircle size={40} />
      </button>

      {isOpen && (
        <div style={styles.dropdownMenu}>
          
          <div style={styles.header}>
            <FaUserCircle style={styles.headerIcon} />
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={styles.userName}>Esmanur Erden</span>
              <span style={{fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase'}}>Admin</span>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', padding: '4px'}}>
            
            {/* Sadece Profilim Linki Kalsın */}
            <Link href="/profile" 
               style={styles.menuLink}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
               onClick={() => setIsOpen(false)}
            >
              <FaUser style={styles.icon} />
              Profilim
            </Link>

            <Link href="/authentication/login/minimal" 
               style={{...styles.menuLink, ...styles.signOutLink}}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
               onClick={() => setIsOpen(false)}
            >
              <FaSignOutAlt style={styles.signOutIcon} />
              Güvenli Çıkış
            </Link>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;