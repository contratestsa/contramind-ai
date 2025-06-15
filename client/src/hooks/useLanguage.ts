import { useContext } from 'react';
import { LanguageContext } from '@/components/LanguageProvider';

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}
