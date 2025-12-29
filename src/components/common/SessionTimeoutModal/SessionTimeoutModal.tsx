"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './SessionTimeoutModal.module.scss';
import Image from 'next/image';

// You might not need a close icon for this specific modal since forcing refresh is the goal,
// but if you want it to look EXACTLY like LoginModal, we can add it or just omit it.
// Given strict "session timeout" nature, usually we don't allow closing without refreshing.

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onRefresh?: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, onRefresh }) => {
  const t = useTranslations('SessionTimeout');

  if (!isOpen) return null;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={styles['session-timeout-overlay']}>
      <div className={styles['session-timeout-modal']}>
        <div className={styles['session-timeout-header']}>
          <h2 className={styles['session-timeout-title']}>{t('title')}</h2>
        </div>
        
        <div className={styles['session-timeout-body']}>
          <p className={styles.message}>{t('message')}</p>
          <button 
            className="button-primary w-100"
            onClick={handleRefresh}
          >
            {t('refreshButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
