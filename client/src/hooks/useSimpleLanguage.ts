import { useSimpleLanguageContext } from '@/components/SimpleLanguage';

export type Language = 'ar' | 'en';

// Hook that uses the SimpleLanguage context
export function useSimpleLanguage() {
  return useSimpleLanguageContext();
}