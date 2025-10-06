'use client';

import Image from 'next/image';
import React from 'react';
import styles from './Support.module.scss';

import UaeFlag from '@/assets/images/american-card-icon.svg';

export default function Support() {
  return (
    <div className={styles.supportContainer}>
      <h1 className={styles.pageTitle}>Support & Help Center</h1>
      <p className={styles.pageSubtitle}>Get help and support here.</p>

      <div className={styles.cardsGrid}>
        {/* Call Us Card */}
        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.iconWrap} aria-hidden>
              {/* phone icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.14a2 2 0 0 1 2.11-.45c.83.26 1.7.45 2.6.57A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Call Us</div>
              <div className={styles.numberRow}>
                <Image src={UaeFlag} alt="UAE flag" className={styles.flagImg} />
                <a href="tel:+971456789" className={styles.numberLink}>+971 456 789</a>
              </div>
            </div>
          </div>
          <div className={styles.chevron} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.iconWrap} aria-hidden>
              {/* whatsapp icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.52 3.48A11.8 11.8 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.1 1.6 5.9L0 24l6.25-1.6A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 21.33c-1.94 0-3.83-.52-5.48-1.5l-.39-.23-3.7.95.99-3.59-.25-.41A9.32 9.32 0 0 1 2.67 12C2.67 7 7 2.67 12 2.67S21.33 7 21.33 12 17 21.33 12 21.33zm5.19-6.07c-.28-.14-1.65-.82-1.9-.91-.25-.09-.43-.14-.61.14-.18.28-.7.91-.86 1.09-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.36-.82-.73-1.37-1.62-1.53-1.9-.16-.28-.02-.43.12-.57.12-.12.28-.32.43-.48.14-.16.18-.28.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2-.22-.52-.45-.45-.61-.45-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.28-.96.93-.96 2.27 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.65.21 1.23.18 1.69.11.52-.08 1.65-.67 1.88-1.32.23-.66.23-1.22.16-1.34-.07-.12-.25-.18-.52-.32z" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>WhatsApp</div>
              <a href="https://wa.me/971123456" target="_blank" rel="noreferrer" className={styles.numberLink}>
                +971 123 456
              </a>
              <div className={styles.hintText}>Or click here to open in WhatsApp web.</div>
            </div>
          </div>
          <div className={styles.chevron} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}


