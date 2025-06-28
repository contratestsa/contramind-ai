import React, { useState, useEffect, useMemo, useCallback } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const detectBrowserLanguage = (): Language => {
      if (typeof window === 'undefined') return 'ar';
      
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        return savedLanguage as Language;
      }
      
      const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
      
      if (browserLanguage.startsWith('ar')) {
        return 'ar';
      }
      
      return 'en';
    };

    setLanguage(detectBrowserLanguage());
  }, []);

  const setLanguageWithPersistence = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  }, []);

  const t = useCallback((ar: string, en: string): string => {
    return language === 'ar' ? ar : en;
  }, [language]);

  const dir: 'rtl' | 'ltr' = useMemo(() => {
    return language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  const contextValue = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage: setLanguageWithPersistence,
    t,
    dir
  }), [language, setLanguageWithPersistence, t, dir]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };