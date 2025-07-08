import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import CountdownTimer from '@/components/CountdownTimer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComingSoon() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const { toast } = useToast();

  // Check for successful authentication
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    if (urlParams.get('auth') === 'success') {
      toast({
        title: t('تم تسجيل الدخول بنجاح', 'Login Successful'),
        description: t('مرحباً بك في ContraMind.ai', 'Welcome to ContraMind.ai'),
        variant: 'default',
      });
    }
  }, [location, t, toast]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              language === 'ar' ? 'font-arabic-heading' : 'font-space'
            }`}>
              <span className="bg-gradient-to-r from-[#0C2836] to-[#1e3a47] bg-clip-text text-transparent">
                {t('نحن نحضر شيئاً مذهلاً لك', "We're preparing something amazing for you")}
              </span>
            </h1>
            
            <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed ${
              language === 'ar' ? 'font-arabic-body' : 'font-inter'
            }`}>
              {t(
                'منصة ContraMind.ai قادمة قريباً بتقنيات الذكاء الاصطناعي المتطورة لإدارة العقود القانونية',
                'ContraMind.ai platform is coming soon with advanced AI technologies for legal contract management'
              )}
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <CountdownTimer size="large" className="max-w-md mx-auto" />
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-custom">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0C2836] to-[#1e3a47] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${language === 'ar' ? 'font-arabic-heading' : 'font-space'}`}>
                {t('تحليل ذكي للعقود', 'Smart Contract Analysis')}
              </h3>
              <p className={`text-gray-600 text-sm ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('تحليل متقدم للعقود باستخدام الذكاء الاصطناعي', 'Advanced AI-powered contract analysis')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-custom">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B7DEE8] to-[#87ceeb] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#0C2836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${language === 'ar' ? 'font-arabic-heading' : 'font-space'}`}>
                {t('دعم ثنائي اللغة', 'Bilingual Support')}
              </h3>
              <p className={`text-gray-600 text-sm ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('دعم كامل للغتين العربية والإنجليزية', 'Full Arabic and English language support')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-custom">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0C2836] to-[#1e3a47] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${language === 'ar' ? 'font-arabic-heading' : 'font-space'}`}>
                {t('أمان متقدم', 'Advanced Security')}
              </h3>
              <p className={`text-gray-600 text-sm ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('حماية متطورة للبيانات والعقود', 'Advanced data and contract protection')}
              </p>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <p className={`text-gray-500 ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
              {t(
                'شكراً لك على انضمامك إلينا. سنتواصل معك قريباً عند إطلاق المنصة',
                'Thank you for joining us. We\'ll contact you soon when the platform launches'
              )}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}