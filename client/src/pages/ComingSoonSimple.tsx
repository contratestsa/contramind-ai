import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import CountdownTimer from '@/components/CountdownTimer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ComingSoonSimple() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Also check if user data exists in the page (for server-side rendered auth)
  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0C2836] to-[#1e3a47] flex items-center justify-center relative ${language === 'ar' ? 'font-arabic' : 'font-inter'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* User info and logout button */}
      {isAuthenticated && user && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('مرحباً', 'Welcome')}</p>
              <p className="font-semibold text-[#0C2836]">{user.fullName}</p>
            </div>
            <Button
              onClick={() => logout()}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('تسجيل الخروج', 'Logout')}
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] ${
            language === 'ar' ? 'font-arabic-heading' : 'font-space'
          }`}>
            ContraMind.ai
          </h1>
        </motion.div>
        
        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-5xl md:text-6xl font-bold mb-6 ${
            language === 'ar' ? 'font-arabic-heading' : 'font-space'
          }`}
        >
          <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
            {t('قريباً', 'Coming Soon')}
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-xl md:text-2xl text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] mb-12 ${
            language === 'ar' ? 'font-arabic-body' : 'font-inter'
          }`}
        >
          {t('نحن نحضّر شيئاً مذهلاً لك', "We're preparing something amazing for you")}
        </motion.p>
        
        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <CountdownTimer className="justify-center" size="large" />
        </motion.div>
        
        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 shadow-[0_0_30px_rgba(183,222,232,0.3)] max-w-2xl mx-auto border border-[#B7DEE8]/50"
        >
          <h2 className={`text-2xl font-semibold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] ${
            language === 'ar' ? 'font-arabic-heading' : 'font-space'
          }`}>
            {t('مرحباً بك في ContraMind.ai', 'Welcome to ContraMind.ai')}
          </h2>
          <p className={`text-white/80 mb-6 ${
            language === 'ar' ? 'font-arabic-body' : 'font-inter'
          }`}>
            {t(
              'منصة الذكاء الاصطناعي الأولى لإدارة العقود القانونية في منطقة الشرق الأوسط وشمال أفريقيا',
              'The first AI-powered legal contract management platform for the MENA region'
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#B7DEE8]/20 border border-[#B7DEE8] rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(183,222,232,0.5)]">
                <svg className="w-6 h-6 text-[#B7DEE8] drop-shadow-[0_0_10px_rgba(183,222,232,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className={`text-white/70 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('تحليل ذكي', 'Smart Analysis')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#B7DEE8]/20 border border-[#B7DEE8] rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(183,222,232,0.5)]">
                <svg className="w-6 h-6 text-[#B7DEE8] drop-shadow-[0_0_10px_rgba(183,222,232,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className={`text-white/70 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('أمان متقدم', 'Advanced Security')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#B7DEE8]/20 border border-[#B7DEE8] rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(183,222,232,0.5)]">
                <svg className="w-6 h-6 text-[#B7DEE8] drop-shadow-[0_0_10px_rgba(183,222,232,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <span className={`text-white/70 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('دعم ثنائي اللغة', 'Bilingual Support')}
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Thank You Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`mt-8 text-white/60 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}
        >
          {t(
            'شكراً لك على انضمامك إلينا. ترقب الإطلاق!',
            'Thank you for joining us. Stay tuned for the launch!'
          )}
        </motion.p>
      </div>
    </div>
  );
}