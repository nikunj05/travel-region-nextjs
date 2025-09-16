import React from 'react';
import styles from './HomePage.module.scss';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Home Page</h1>
      <p className={styles.description}>This is a basic home page created with Next.js and SCSS.</p>
    </div>
  );
};

export default HomePage;
