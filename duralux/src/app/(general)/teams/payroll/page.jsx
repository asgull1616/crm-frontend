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
          router.replace('/teams/payroll/admin');
        } else {
          router.replace('/teams/payroll/user');
        }
      })
      .catch(() => {
        router.replace('/auth/login');
      });
  }, [router]);

  return null;
};

export default TeamsLeavesPage;
