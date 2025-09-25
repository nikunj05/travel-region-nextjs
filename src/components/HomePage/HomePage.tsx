import React from 'react';
import styles from './HomePage.module.scss';
import { useTranslations } from 'next-intl';
import Header from '../Header/Header';
import Banner from '../LandingPage/Banner';
import Travelers from '../LandingPage/Travelers';
import Popular from '../LandingPage/PopularSection';
import DashboardBlogs from '../LandingPage/DashboardBlogs';
import Contact from '../LandingPage/Contact';
import Footer from '../Footer/Footer';

const HomePage = () => {
  const t = useTranslations('Home');
  const nav = useTranslations('Navigation');

  return (
    <>
      <Banner />
      <Popular />
      <Travelers />
      <DashboardBlogs />
      <Contact />
    </>
  );
};

export default HomePage;
