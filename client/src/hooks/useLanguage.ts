import * as React from 'react';

export type Language = 'ar' | 'en';

// Create a simple hook that works without context for now
export function useLanguage() {
  const [language, setLanguage] = React.useState<Language>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = React.useCallback((ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  }, [language]);

  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.documentElement.classList.add('rtl-transition');
    
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('rtl-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [language, dir]);

  return { language, setLanguage, t, dir };
}
