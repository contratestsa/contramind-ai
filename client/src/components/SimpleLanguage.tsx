import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Detect browser language on initial load
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ar';
  
  try {
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
  } catch {
    return 'ar';
  }
};

interface SimpleLanguageProviderProps {
  children: ReactNode;
}

export function SimpleLanguageProvider({ children }: SimpleLanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => detectBrowserLanguage());

  useEffect(() => {
    // Set document attributes when language changes
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch {}
    // Force page reload for complete language switch
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };

  const dir = language === 'ar' ? 'rtl' as const : 'ltr' as const;

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    dir
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a SimpleLanguageProvider');
  }
  return context;
}