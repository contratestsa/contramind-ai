import { useState, useEffect } from 'react';
import { LanguageManager, type Language } from '@/components/SimpleLanguage';

export type { Language };

export function useSimpleLanguage() {
  const [language, setLanguageState] = useState<Language>(() => LanguageManager.getLanguage());
  
  useEffect(() => {
    const unsubscribe = LanguageManager.subscribe((newLang) => {
      setLanguageState(newLang);
    });
    
    return unsubscribe;
  }, []);
  
  const setLanguage = (lang: Language) => {
    LanguageManager.setLanguage(lang);
    // Force page reload for complete language switch
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  
  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };
  
  const dir = language === 'ar' ? 'rtl' as const : 'ltr' as const;
  
  return { 
    language, 
    setLanguage, 
    t, 
    dir 
  };
}