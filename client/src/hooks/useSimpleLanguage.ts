import { useState } from 'react';

export type Language = 'ar' | 'en';

// Simple language hook with setLanguage function
export function useSimpleLanguage() {
  const [language, setLanguage] = useState<Language>('ar');
  
  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  return { language, setLanguage, t, dir };
}