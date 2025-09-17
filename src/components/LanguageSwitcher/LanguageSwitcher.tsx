'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // For hidden locale routing, we change the locale 
      // but keep the same pathname
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000 
    }}>
      <select 
        value={locale} 
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isPending}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          fontSize: '14px',
          cursor: isPending ? 'wait' : 'pointer',
          opacity: isPending ? 0.7 : 1
        }}
        aria-label={t('selectLanguage')}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
