'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

const ProfilePage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const t = useTranslations('Profile');
  const nav = useTranslations('Navigation');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <LanguageSwitcher />
      
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {t('title')}
      </h1>
      
      <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem' }}>
        {t('welcome')}
      </p>
      
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          {t('logout')}
        </button>
        
        <Link href="/" style={{ color: '#0070f3' }}>
          {nav('home')}
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
