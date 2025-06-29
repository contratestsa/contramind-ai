import { useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

// Simple global state for language
let currentLanguage: Language = 'ar';

// Detect browser language
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ar';
  
  try {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      return savedLanguage as Language;
    }
    
    const browserLanguage = navigator.language || 'en';
    return browserLanguage.startsWith('ar') ? 'ar' : 'en';
  } catch {
    return 'ar';
  }
};

// Initialize language
if (typeof window !== 'undefined') {
  currentLanguage = detectBrowserLanguage();
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(currentLanguage);

  useEffect(() => {
    // Set document attributes
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
    setLanguageState(lang);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  };

  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };

  return {
    language,
    setLanguage,
    t,
    dir: language === 'ar' ? 'rtl' as const : 'ltr' as const
  };
}