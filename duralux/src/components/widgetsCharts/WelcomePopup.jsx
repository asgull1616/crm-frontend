'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/services/auth.service';

const DEFAULT_AVATAR = '/images/default-avatar.png';

const WelcomePopup = () => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
    }, 300); // animasyon süresi
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.me();
        setUsername(res.data.username);
        setProfileImage(res.data.profileImage);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();

    const timer = setTimeout(() => {
      closePopup();
    }, 3000);

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };

    window.addEventListener('keydown', escHandler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', escHandler);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`welcome-overlay ${closing ? 'fade-out' : 'fade-in'}`}>
      <div className="welcome-box position-relative">

        <button
          className="welcome-close"
          onClick={closePopup}
        >
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
