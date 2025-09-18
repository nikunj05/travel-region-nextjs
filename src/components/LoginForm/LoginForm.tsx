'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18/navigation';
import { Form } from '@/components/core/Form/Form';
import { Input } from '@/components/core/Input/Input';
import { loginSchema, LoginFormData } from '@/schemas/loginSchema';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useLogin } from '@/hooks/useLogin';

const LoginForm: React.FC = () => {
  const t = useTranslations('Auth.login');
  const nav = useTranslations('Navigation');
  const { handleSubmit, isLoading, error } = useLogin();

  const defaultValues: LoginFormData = {
    email: '',
    password: '',
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
      
      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <Form
        defaultValues={defaultValues}
        schema={loginSchema}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <Input
            name="email"
            type="email"
            placeholder={t('email')}
            required
          />
        </div>
        
        <div>
          <Input
            name="password"
            type="password"
            placeholder={t('password')}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isLoading ? '#94a3b8' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? t('loading') : t('submit')}
        </button>
      </Form>
      
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

export default LoginForm;
