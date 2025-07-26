import { ReactNode, useEffect, useState, createContext, useContext } from 'react';

export type Language = 'ar' | 'en';

// Detect browser language on initial load
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
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
    return 'en';
  }
};

// Language context
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  getDir: () => 'rtl' | 'ltr';
} | null>(null);

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a SimpleLanguageProvider');
  }
  return context;
};

// Global language manager for non-React contexts
export const LanguageManager = {
  getLanguage: (): Language => {
    if (typeof window === 'undefined') return 'en';
    try {
      const savedLanguage = localStorage.getItem('language');
      
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        return savedLanguage as Language;
      }
      return detectBrowserLanguage();
    } catch {
      return 'en';
    }
  },
  
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang);
        
        // Single source of truth for direction - only set on documentElement
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
        
        // Force page reload for complete language switch
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch {}
    }
  },
  
  t: (ar: string, en: string) => {
    const currentLang = LanguageManager.getLanguage();
    return currentLang === 'ar' ? ar : en;
  },
  
  getDir: (): 'rtl' | 'ltr' => {
    const currentLang = LanguageManager.getLanguage();
    return currentLang === 'ar' ? 'rtl' : 'ltr';
  }
};

// Simple language provider that bridges LanguageManager with React context
export function SimpleLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(LanguageManager.getLanguage());
  
  useEffect(() => {
    // Initialize direction on mount
    const currentLang = LanguageManager.getLanguage();
    
    // Single source of truth for direction - only set on documentElement
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang === 'ar' ? 'ar' : 'en');
    
    // Update state to match
    setLanguageState(currentLang);
  }, []);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    LanguageManager.setLanguage(lang);
  };
  
  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };
  
  const getDir = (): 'rtl' | 'ltr' => {
    return language === 'ar' ? 'rtl' : 'ltr';
  };
  
  const value = {
    language,
    setLanguage,
    t,
    getDir
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Commenting out the old SimpleLanguageProvider as it's not used anymore
// The app uses LanguageManager instead
/*
interface SimpleLanguageProviderProps {
  children: ReactNode;
}

export function SimpleLanguageProvider({ children }: SimpleLanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(detectBrowserLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-language', lang);
    
    // Force page reload for complete language switch
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };

  const getDir = (): 'rtl' | 'ltr' => {
    return language === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    // Set initial document attributes
    const dir = getDir();
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    getDir
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
*/