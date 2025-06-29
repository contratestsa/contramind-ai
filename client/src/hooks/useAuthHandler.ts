import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from './use-toast';
import { useSimpleLanguage } from './useSimpleLanguage';

export function useAuthHandler() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useSimpleLanguage();

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const error = urlParams.get('error');

    if (authStatus === 'success') {
      toast({
        title: t('تم تسجيل الدخول بنجاح', 'Login Successful'),
        description: t('مرحباً بك في ContraMind', 'Welcome to ContraMind'),
        variant: 'default',
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Optionally redirect or refresh user state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }

    if (error) {
      let errorMessage = '';
      switch (error) {
        case 'google_auth_failed':
          errorMessage = t('فشل في تسجيل الدخول عبر Google', 'Google authentication failed');
          break;
        case 'microsoft_auth_failed':
          errorMessage = t('فشل في تسجيل الدخول عبر Microsoft', 'Microsoft authentication failed');
          break;
        default:
          errorMessage = t('فشل في تسجيل الدخول', 'Authentication failed');
      }

      toast({
        title: t('خطأ في المصادقة', 'Authentication Error'),
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, t]);
}