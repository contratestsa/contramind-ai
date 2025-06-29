import { LanguageManager, type Language } from '@/components/SimpleLanguage';

export type { Language };

export function useSimpleLanguage() {
  const t = (ar: string, en: string) => {
    return LanguageManager.t(ar, en);
  };
  
  return { 
    language: LanguageManager.getLanguage(), 
    setLanguage: LanguageManager.setLanguage, 
    t, 
    dir: LanguageManager.getDir()
  };
}