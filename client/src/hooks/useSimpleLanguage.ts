import { useState, useEffect } from 'react';
import { LanguageManager, type Language } from '@/components/SimpleLanguage';

export type { Language };

// Hook that uses the global language manager
export function useSimpleLanguage() {
  const [language, setLanguageState] = useState<Language>(LanguageManager.getLanguage());
  
  useEffect(() => {
    const unsubscribe = LanguageManager.subscribe((newLang) => {
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
  
  const dir = LanguageManager.getDir();
  
  return { language, setLanguage, t, dir };
}