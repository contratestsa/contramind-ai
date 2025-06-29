import { ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface SimpleLanguageProviderProps {
  children: ReactNode;
}

export function SimpleLanguageProvider({ children }: SimpleLanguageProviderProps) {
  return <>{children}</>;
}

// Legacy compatibility exports - these are not used but kept for compatibility
export const LanguageManager = {
  getLanguage: () => 'ar' as Language,
  setLanguage: () => {},
  subscribe: () => () => {},
  t: (ar: string, en: string) => ar,
  getDir: () => 'rtl' as const
};

export function useLanguageContext() {
  throw new Error('useLanguageContext is deprecated, use useLanguage instead');
}