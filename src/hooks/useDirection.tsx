"use client";
import { useLocale } from 'next-intl';

export const useDirection = () => {
  const locale = useLocale();
  
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  return {
    locale,
    isRTL,
    direction,
    textAlign: isRTL ? 'right' : 'left',
    flexDirection: isRTL ? 'row-reverse' : 'row',
  };
};
