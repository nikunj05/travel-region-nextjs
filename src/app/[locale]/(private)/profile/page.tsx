'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18/navigation';

export default function ProfilePage() {
  const { logout, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const t = useTranslations('Profile');
  const nav = useTranslations('Navigation');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="padding-top-100">
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {t('title')}
      </h1>
      
      <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem' }}>
        {t('welcome')}
      </p>
      
      {user && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#495057' }}>User Information</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Country Code:</strong> {user.country_code}</p>
            {user.address && <p><strong>Address:</strong> {user.address}</p>}
            {user.date_of_birth && <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>}
            {user.gender && <p><strong>Gender:</strong> {user.gender}</p>}
            {user.nationality && <p><strong>Nationality:</strong> {user.nationality}</p>}
            {user.passport_number && <p><strong>Passport Number:</strong> {user.passport_number}</p>}
          </div>
        </div>
      )}
      
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
    </main>
  );
};


