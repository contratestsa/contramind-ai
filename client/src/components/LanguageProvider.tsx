import { createContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ar');

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
    setLanguage,
    t,
    dir
  }), [language, setLanguage, t, dir]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };