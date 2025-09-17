'use client';

import { usePathname, useRouter } from '@/i18/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18/routing';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <select 
        value={locale} 
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          fontSize: '14px'
        }}
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale === 'en' ? '🇺🇸 English' : '🇸🇦 العربية'}
          </option>
        ))}
      </select>
    </div>
  );
}
