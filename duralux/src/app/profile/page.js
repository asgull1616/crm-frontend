import React from 'react';
// Az önce oluşturduğumuz bileşeni çağırıyoruz
import UserProfile from '@/components/profile/UserProfile';

const ProfilePage = () => {
  return (
    <div>
        {/* Buraya Header veya Navbar'ı da ekleyebilirsin eğer otomatik gelmiyorsa */}
        <UserProfile />
    </div>
  );
};

export default ProfilePage;