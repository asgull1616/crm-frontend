'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';

const TeamsLeavesPage = () => {
  const router = useRouter();

  useEffect(() => {
    authService
      .me()
      .then((res) => {
        if (res.data.role === 'ADMIN') {
          router.replace('/teams/leaves/admin');
        } else {
          router.replace('/teams/leaves/user');
        }
      })
      .catch(() => {
        router.replace('/auth/login');
      });
  }, [router]);

  return null;
};

export default TeamsLeavesPage;
