'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country_code: '91',
    mobile: '',
    password: '',
    password_confirmation: '',
  });
  const { register } = useAuth();
  const router = useRouter();
  const t = useTranslations('Auth.register');
  const nav = useTranslations('Navigation');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      router.push('/login');
    } catch (error) {
      console.error(t('failed'), error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem'
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
        <input 
          type="text" 
          name="first_name" 
          placeholder={t('firstName')} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input 
          type="text" 
          name="last_name" 
          placeholder={t('lastName')} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder={t('email')} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input 
          type="text" 
          name="country_code" 
          placeholder={t('countryCode')} 
          value={formData.country_code} 
          onChange={handleChange}
          style={inputStyle}
        />
        
        <input 
          type="text" 
          name="mobile" 
          placeholder={t('mobile')} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder={t('password')} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input 
          type="password" 
          name="password_confirmation" 
          placeholder={t('confirmPassword')} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
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
        <Link href="/login" style={{ color: '#0070f3' }}>
          {nav('login')}
        </Link>
        {' | '}
        <Link href="/" style={{ color: '#0070f3' }}>
          {nav('home')}
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
