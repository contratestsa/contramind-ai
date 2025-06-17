import { useContext } from 'react';
import { SimpleLanguageContext } from '@/components/SimpleLanguage';

export function useLanguage() {
  const context = useContext(SimpleLanguageContext);
  return context;
}
