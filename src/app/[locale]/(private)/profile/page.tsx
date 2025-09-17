'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';

const ProfilePage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const t = useTranslations('Profile');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('welcome')}</p>
      <button onClick={handleLogout}>{t('logout')}</button>
    </div>
  );
};

export default ProfilePage;
