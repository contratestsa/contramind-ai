import { useState } from 'react';

export type Language = 'ar' | 'en';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ar');
  
  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };
  
  return {
    language,
    setLanguage,
    t,
    dir: language === 'ar' ? 'rtl' : 'ltr'
  };
}