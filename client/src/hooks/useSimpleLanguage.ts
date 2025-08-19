import { LanguageManager, type Language } from '@/utils/languageManager';

export type { Language };

export function useSimpleLanguage() {
  const setLanguage = (lang: Language) => {
    LanguageManager.setLanguage(lang);
  };
  
  const t = (ar: string, en: string) => {
    return LanguageManager.t(ar, en);
  };
  
  return { 
    language: LanguageManager.getLanguage(), 
    setLanguage, 
    t, 
    dir: LanguageManager.getDir() 
  };
}