import * as React from 'react';
import { SimpleLanguageContext } from '@/components/SimpleLanguage';

export function useLanguage() {
  const context = React.useContext(SimpleLanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a SimpleLanguageProvider');
  }
  return context;
}
