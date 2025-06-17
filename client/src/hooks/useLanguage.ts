import React from 'react';
import { LanguageContext } from '@/components/LanguageProvider';

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  return context;
}
