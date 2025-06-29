import { useState, useEffect } from 'react';
import { LanguageManager, type Language } from '@/components/SimpleLanguage';

export type { Language };

export function useSimpleLanguage() {
  const [language, setLanguageState] = useState<Language>(LanguageManager.getLanguage());
  
  useEffect(() => {
    const unsubscribe = LanguageManager.subscribe((newLang: Language) => {
      setLanguageState(newLang);
    });
    
    return unsubscribe;
  }, []);
  
  const setLanguage = (lang: Language) => {
    LanguageManager.setLanguage(lang);
  };
  
  const t = (ar: string, en: string) => {
    return LanguageManager.t(ar, en);
  };
  
  return { 
    language, 
    setLanguage, 
    t, 
    dir: language === 'ar' ? 'rtl' : 'ltr'
  };
}