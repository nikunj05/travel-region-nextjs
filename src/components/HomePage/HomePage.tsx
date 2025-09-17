import React from 'react';
import styles from './HomePage.module.scss';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { Link } from '@/i18/navigation';

const HomePage = () => {
  const t = useTranslations('Home');
  const nav = useTranslations('Navigation');

  return (
    <div className={styles.container}>
      <LanguageSwitcher />
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.description}>{t('description')}</p>
      
      <nav style={{ marginTop: '2rem' }}>
        <Link href="/login" style={{ marginRight: '1rem', color: '#0070f3' }}>
          {nav('login')}
        </Link>
        <Link href="/register" style={{ marginRight: '1rem', color: '#0070f3' }}>
          {nav('register')}
        </Link>
        <Link href="/profile" style={{ color: '#0070f3' }}>
          {nav('profile')}
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;
