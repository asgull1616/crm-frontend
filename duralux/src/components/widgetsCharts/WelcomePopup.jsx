'use client';

import { useEffect, useRef, useState } from 'react';
import { authService } from '@/lib/services/auth.service';

const DEFAULT_AVATAR = '/images/default-avatar.png';
const FLAG_KEY = 'show_welcome_popup';

const WelcomePopup = () => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const timerRef = useRef(null);

  const closePopup = () => {
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 300);
  };

  //sadece login sonrası 1 kere aç
  useEffect(() => {
    const shouldShow = sessionStorage.getItem(FLAG_KEY) === '1';
    if (!shouldShow) return;

    sessionStorage.removeItem(FLAG_KEY);

    (async () => {
      try {
        const res = await authService.me();
        setUsername(res?.data?.username || '');
        setProfileImage(res?.data?.profileImage || null);
      } catch (err) {
        console.log(err);
      } finally {
        setClosing(false);
        setVisible(true);
      }
    })();
  }, []);

  //visible açılınca: 3sn timer + ESC listener burada
  useEffect(() => {
    if (!visible) return;

    //3 sn sonra kapat
    timerRef.current = window.setTimeout(() => {
      closePopup();
    }, 3000);

    //ESC ile kapat
    const escHandler = (e) => {
      if (e.key === 'Escape') closePopup();
    };

    window.addEventListener('keydown', escHandler);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('keydown', escHandler);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`welcome-overlay ${closing ? 'fade-out' : 'fade-in'}`}
      onClick={closePopup}
    >
      <div className="welcome-box position-relative" onClick={(e) => e.stopPropagation()}>
        <button className="welcome-close" onClick={closePopup}>
          ×
        </button>

        <img
          src={profileImage || DEFAULT_AVATAR}
          alt="Profile"
          className="rounded-circle mb-3"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />

        <h4 className="fw-bold">Hoşgeldin {username} 👋</h4>
      </div>
    </div>
  );
};

export default WelcomePopup;