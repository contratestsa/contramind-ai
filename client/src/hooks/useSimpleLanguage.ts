import { useLanguage, type Language } from '@/components/SimpleLanguage';

export type { Language };

export function useSimpleLanguage() {
  return useLanguage();
}