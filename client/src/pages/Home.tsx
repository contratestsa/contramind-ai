import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Waitlist from '@/components/Waitlist';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { LanguageManager } from '@/components/SimpleLanguage';

export default function Home() {
  const [location] = useLocation();
  const { toast } = useToast();
  const t = LanguageManager.t;

  useEffect(() => {
    // Check for message query parameter
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    
    if (message === 'verify-email') {
      toast({
        title: t('تحقق من بريدك الإلكتروني', 'Verify Your Email'),
        description: t(
          'يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل. تحقق من صندوق الوارد للحصول على رابط التحقق.',
          'Please check your email to complete your registration. Look for the verification link in your inbox.'
        ),
        duration: 10000,
      });
      
      // Remove the query parameter from the URL
      window.history.replaceState({}, '', '/');
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-navy">
      <Header />
      <Hero />
      <Features />
      <Waitlist />
      <FAQ />
      <Footer />
    </div>
  );
}
