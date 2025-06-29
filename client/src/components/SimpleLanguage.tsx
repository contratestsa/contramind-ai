import React, { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'ar' | 'en';

interface SimpleLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const SimpleLanguageContext = createContext<SimpleLanguageContextType | undefined>(undefined);

interface SimpleLanguageProviderProps {
  children: React.ReactNode;
}

export function SimpleLanguageProvider({ children }: SimpleLanguageProviderProps) {
  // Detect browser language
  const detectBrowserLanguage = (): Language => {
    // Check localStorage first for user preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      return savedLanguage as Language;
    }
    
    // Detect from browser language
    const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
    
    // Check if browser language is Arabic
    if (browserLanguage.startsWith('ar')) {
      return 'ar';
    }
    
    // Default to English for all other languages
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(detectBrowserLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (ar: string, en: string): string => {
    return language === 'ar' ? ar : en;
  };

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  const contextValue: SimpleLanguageContextType = {
    language,
    setLanguage,
    t,
    dir
  };

  return (
    <SimpleLanguageContext.Provider value={contextValue}>
      {children}
    </SimpleLanguageContext.Provider>
  );
}

export function useSimpleLanguageContext() {
  const context = useContext(SimpleLanguageContext);
  if (context === undefined) {
    throw new Error('useSimpleLanguageContext must be used within a SimpleLanguageProvider');
  }
  return context;
}