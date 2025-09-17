'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations('Auth.login');
  const nav = useTranslations('Navigation');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      router.push('/profile');
    } catch (error) {
      console.error(t('failed'), error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '2rem auto', 
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <LanguageSwitcher />
      
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {t('title')}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input 
            type="email" 
            name="email" 
            placeholder={t('email')} 
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="password" 
            name="password" 
            placeholder={t('password')} 
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            required
          />
        </div>
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {t('submit')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link href="/register" style={{ color: '#0070f3' }}>
          {nav('register')}
        </Link>
        {' | '}
        <Link href="/" style={{ color: '#0070f3' }}>
          {nav('home')}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
