'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    authService
      .me()
      .then((res) => {
        if (res.data.role === 'ADMIN') {
          router.push('/dashboards/analytics/admin');
        } else {
          router.push('/dashboards/analytics/user');
        }
      })
      .catch(() => {
        router.push('/auth/login');
      });
  }, []);

  return null;
};

export default Page;
