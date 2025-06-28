import * as React from 'react';
import { LanguageContext } from '@/components/LanguageProvider';

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
