import React from 'react';

export type Language = 'ar' | 'en';

interface SimpleLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

export const SimpleLanguageContext = React.createContext<SimpleLanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (ar: string, en: string) => ar,
  dir: 'rtl'
});

interface SimpleLanguageProviderProps {
  children: React.ReactNode;
}

export function SimpleLanguageProvider({ children }: SimpleLanguageProviderProps) {
  const [language, setLanguageState] = React.useState<Language>('ar');

  React.useEffect(() => {
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

    setLanguageState(detectBrowserLanguage());
  }, []);

  React.useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = React.useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  }, []);

  const t = React.useCallback((ar: string, en: string): string => {
    return language === 'ar' ? ar : en;
  }, [language]);

  const contextValue = React.useMemo<SimpleLanguageContextType>(() => ({
    language,
    setLanguage,
    t,
    dir: language === 'ar' ? 'rtl' : 'ltr'
  }), [language, setLanguage, t]);

  return (
    <SimpleLanguageContext.Provider value={contextValue}>
      {children}
    </SimpleLanguageContext.Provider>
  );
}