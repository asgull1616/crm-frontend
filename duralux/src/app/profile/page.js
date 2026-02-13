import React from 'react';
import UserProfile from '@/components/profile/UserProfile';

export const metadata = {
  title: 'Profil | Codyol CRM',
};

export default function ProfilePage() {
  return (
    <main>
        <UserProfile />
    </main>
  );
}