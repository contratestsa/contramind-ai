import { useLanguage, type Language } from './useLanguage';

export type { Language };

export function useSimpleLanguage() {
  return useLanguage();
}