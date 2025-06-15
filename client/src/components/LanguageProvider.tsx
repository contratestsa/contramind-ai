import { useState, useCallback, useEffect, useMemo, createContext } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ar');
  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback((ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.documentElement.classList.add('rtl-transition');
    
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('rtl-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [language, dir]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    dir
  }), [language, t, dir]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
