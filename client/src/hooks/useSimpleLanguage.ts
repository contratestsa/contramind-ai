import { LanguageManager, type Language } from '@/components/SimpleLanguage';

export type { Language };

// Simple hook that uses the global language manager without React state
export function useSimpleLanguage() {
  const setLanguage = (lang: Language) => {
    LanguageManager.setLanguage(lang);
    // Force re-render by updating a data attribute
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-language', lang);
    }
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