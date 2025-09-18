import React from 'react';
import styles from './HomePage.module.scss';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from '../Header/Header';
import Banner from '../LandingPage/Banner';
import Travelers from '../LandingPage/Travelers';
import Popular from '../LandingPage/PopularSection';
import Inspire from '../LandingPage/Inspire';
import Contact from '../LandingPage/Contact';
import Footer from '../Footer/Footer';

const HomePage = () => {
  const t = useTranslations('Home');
  const nav = useTranslations('Navigation');

  return (
    <>
      <Header />
      <Banner />
      <Popular />
      <Travelers />
      <Inspire />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;
