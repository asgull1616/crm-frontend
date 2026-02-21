'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { authService } from '@/lib/services/auth.service';

const TeamsHeader = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authService
      .me()
      .then((res) => {
        setIsAdmin(res.data.role === 'ADMIN' || res.data.role === 'SUPER_ADMIN');
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, []);

  // ADMIN değilse HİÇ render etme
  if (!isAdmin) return null;

  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <Link
        href="/teams/create"
        className="btn text-white"
        style={{
          backgroundColor: '#E92B63',
          borderColor: '#E92B63',
        }}
      >
        <FiPlus size={16} className="me-2" />
        <span>Ekip Oluştur</span>
      </Link>
    </div>
  );
};

export default TeamsHeader;
