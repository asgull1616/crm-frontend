import React from 'react';
import UserProfile from '@/components/profile/UserProfile';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
export const metadata = {
  title: 'Profil | Codyol CRM',
};

export default function ProfilePage() {
  return (
    <main>
      <PageHeader />
      <UserProfile />
    </main>
  );
}
