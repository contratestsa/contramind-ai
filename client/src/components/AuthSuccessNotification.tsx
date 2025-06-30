import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { useToast } from '@/hooks/use-toast';

export default function AuthSuccessNotification() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { t } = useSimpleLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user just completed OAuth authentication
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success' && isAuthenticated && user) {
      // Show success toast
      toast({
        title: t('تم تسجيل الدخول بنجاح', 'Successfully signed in'),
        description: t(`مرحباً ${user.fullName}!`, `Welcome ${user.fullName}!`),
        duration: 4000,
      });
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isAuthenticated, user, t, toast]);

  return null; // This component doesn't render anything
}