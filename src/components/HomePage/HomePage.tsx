import React from 'react';
// import { useTranslations } from 'next-intl';
import Banner from '../LandingPage/Banner';
import Travelers from '../LandingPage/Travelers';
import Popular from '../LandingPage/PopularSection';
import DashboardBlogs from '../LandingPage/DashboardBlogs';
import Contact from '../LandingPage/Contact';

const HomePage = () => {
  // const t = useTranslations('Home');
  // const nav = useTranslations('Navigation');

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
