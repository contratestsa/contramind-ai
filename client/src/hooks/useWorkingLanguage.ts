import { useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ar';
  
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ar') ? 'ar' : 'en';
};

export function useWorkingLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    
    const stored = localStorage.getItem('contraMind-language');
    if (stored === 'ar' || stored === 'en') return stored;
    
    return detectBrowserLanguage();
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('data-language', language);
      localStorage.setItem('contraMind-language', language);
    }
  }, [language]);

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;
  const getDir = () => language === 'ar' ? 'rtl' as const : 'ltr' as const;

  return {
    language,
    setLanguage,
    t,
    getDir
  };
}