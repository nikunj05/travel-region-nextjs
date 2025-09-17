'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';

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

  return (
    <div>
      <h1>{t('title')}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="first_name" 
          placeholder={t('firstName')} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="last_name" 
          placeholder={t('lastName')} 
          onChange={handleChange} 
        />
        <input 
          type="email" 
          name="email" 
          placeholder={t('email')} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="country_code" 
          placeholder={t('countryCode')} 
          value={formData.country_code} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="mobile" 
          placeholder={t('mobile')} 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder={t('password')} 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          name="password_confirmation" 
          placeholder={t('confirmPassword')} 
          onChange={handleChange} 
        />
        <button type="submit">{t('submit')}</button>
      </form>
    </div>
  );
};

export default RegisterPage;
