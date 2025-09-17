import React from 'react';
import styles from './HomePage.module.scss';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const HomePage = () => {
  const t = useTranslations('Home');

  return (
    <div className={styles.container}>
      <LanguageSwitcher />
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.description}>{t('description')}</p>
    </div>
  );
};

export default HomePage;
