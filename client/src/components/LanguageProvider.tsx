import { createContext, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

// Simple static context value to avoid React hooks issues
const staticContextValue: LanguageContextType = {
  language: 'ar',
  setLanguage: () => {},
  t: (ar: string, en: string) => ar,
  dir: 'rtl'
};

export const LanguageContext = createContext<LanguageContextType | undefined>(staticContextValue);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  return (
    <LanguageContext.Provider value={staticContextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
