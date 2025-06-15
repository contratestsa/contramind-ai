export type Language = 'ar' | 'en';

// Simple language hook without useState to avoid React hooks issues
export function useSimpleLanguage() {
  const language: Language = 'ar'; // Fixed to Arabic for now
  
  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  return { language, t, dir };
}