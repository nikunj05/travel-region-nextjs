'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations('Auth.login');

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
    <div>
      <h1>{t('title')}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder={t('email')} 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder={t('password')} 
          onChange={handleChange} 
        />
        <button type="submit">{t('submit')}</button>
      </form>
    </div>
  );
};

export default LoginPage;
