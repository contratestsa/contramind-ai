import * as React from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

export const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
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

  const contextValue = React.useMemo(() => ({
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
