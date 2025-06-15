export type Language = 'ar' | 'en';

// Static language utility without hooks
export const language: Language = 'ar';

export const t = (ar: string, en: string) => {
  return language === 'ar' ? ar : en;
};

export const dir = language === 'ar' ? 'rtl' : 'ltr';

// Simple function for components to use
export function useSimpleLanguage() {
  return { language, t, dir };
}