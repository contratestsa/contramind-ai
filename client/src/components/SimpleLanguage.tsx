import { ReactNode } from 'react';

export type Language = 'ar' | 'en';

// Global language state
let globalLanguage: Language = 'ar';

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

// Initialize global language
globalLanguage = detectBrowserLanguage();

// Simple language manager
export const LanguageManager = {
  getLanguage: () => globalLanguage,
  
  setLanguage: (lang: Language) => {
    globalLanguage = lang;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-language', lang);
        
        // Force page reload for complete language switch
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch {}
    }
  },
  
  t: (ar: string, en: string) => {
    return globalLanguage === 'ar' ? ar : en;
  },
  
  getDir: () => globalLanguage === 'ar' ? 'rtl' as const : 'ltr' as const
};

interface SimpleLanguageProviderProps {
  children: ReactNode;
}

export function SimpleLanguageProvider({ children }: SimpleLanguageProviderProps) {
  // Set initial document attributes
  if (typeof window !== 'undefined') {
    try {
      const dir = LanguageManager.getDir();
      const lang = LanguageManager.getLanguage();
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('data-language', lang);
    } catch {}
  }
  
  return <>{children}</>;
}