import * as React from 'react';
import { useLocation, useRoute } from 'wouter';
import { LanguageContext } from './LanguageProvider';

export function LanguageRouter({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const context = React.useContext(LanguageContext);

  React.useEffect(() => {
    if (!context) return;
    
    // Parse language from URL
    const pathSegments = location.split('/').filter(Boolean);
    const urlLang = pathSegments[0];
    
    if (urlLang === 'en' || urlLang === 'ar') {
      // Update language context if URL has language prefix
      if (context && context.language !== urlLang) {
        context.setLanguage(urlLang);
      }
    } else {
      // If no language prefix, redirect to language-aware URL
      const defaultLang = context ? context.language : 'ar';
      const newPath = `/${defaultLang}${location}`;
      setLocation(newPath, { replace: true });
    }
  }, [location, context]);

  return <>{children}</>;
}

export function useLanguageAwareNavigation() {
  const [location, setLocation] = useLocation();
  const context = React.useContext(LanguageContext);

  const navigateTo = React.useCallback((path: string) => {
    if (!context) return;
    const currentLang = context.language;
    const languageAwarePath = path.startsWith('/') ? `/${currentLang}${path}` : `/${currentLang}/${path}`;
    setLocation(languageAwarePath);
  }, [context, setLocation]);

  const getCurrentPath = React.useCallback(() => {
    const pathSegments = location.split('/').filter(Boolean);
    const urlLang = pathSegments[0];
    
    if (urlLang === 'en' || urlLang === 'ar') {
      return '/' + pathSegments.slice(1).join('/');
    }
    return location;
  }, [location]);

  return { navigateTo, getCurrentPath, currentLanguage: context?.language || 'ar' };
}