import * as React from 'react';

export type Language = 'ar' | 'en';

// Simple language hook with setLanguage function
export function useSimpleLanguage() {
  const [language, setLanguage] = React.useState<Language>('ar');
  
  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  return { language, setLanguage, t, dir };
}