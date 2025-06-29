// Simple non-hook language utility to avoid React hooks errors
export type Language = 'ar' | 'en';

let currentLanguage: Language = 'ar';

export function useSimpleLanguage() {
  const t = (ar: string, en: string) => {
    return currentLanguage === 'ar' ? ar : en;
  };

  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
      try {
        localStorage.setItem('language', lang);
      } catch (e) {
        console.warn('Failed to save language preference');
      }
    }
    // Force re-render by reloading the page
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return {
    language: currentLanguage,
    setLanguage,
    t,
    dir: currentLanguage === 'ar' ? 'rtl' as const : 'ltr' as const
  };
}