import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import CountdownTimer from '@/components/CountdownTimer';

export default function ComingSoonSimple() {
  const { t, language } = useLanguage();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] flex items-center justify-center ${language === 'ar' ? 'font-arabic' : 'font-inter'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img 
            src="/ContramindLogo.svg" 
            alt="ContraMind.ai" 
            className="h-16 mx-auto mb-8"
          />
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
          <span className="bg-gradient-to-r from-[#0C2836] to-[#1e3a47] bg-clip-text text-transparent">
            {t('قريباً', 'Coming Soon')}
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-xl md:text-2xl text-gray-600 mb-12 ${
            language === 'ar' ? 'font-arabic-body' : 'font-inter'
          }`}
        >
          {t('نحن نحضر شيئاً مذهلاً لك', "We're preparing something amazing for you")}
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
        >
          <h2 className={`text-2xl font-semibold mb-6 text-[#0C2836] ${
            language === 'ar' ? 'font-arabic-heading' : 'font-space'
          }`}>
            {t('مرحباً بك في ContraMind.ai', 'Welcome to ContraMind.ai')}
          </h2>
          <p className={`text-gray-600 mb-6 ${
            language === 'ar' ? 'font-arabic-body' : 'font-inter'
          }`}>
            {t(
              'منصة الذكاء الاصطناعي الأولى لإدارة العقود القانونية في منطقة الشرق الأوسط وشمال أفريقيا',
              'The first AI-powered legal contract management platform for the MENA region'
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#B7DEE8] rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-[#0C2836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-gray-700 ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('تحليل ذكي', 'Smart Analysis')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#B7DEE8] rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-[#0C2836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className={`text-gray-700 ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
                {t('أمان متقدم', 'Advanced Security')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#B7DEE8] rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-[#0C2836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className={`text-gray-700 ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}>
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
          className={`mt-8 text-gray-500 ${language === 'ar' ? 'font-arabic-body' : 'font-inter'}`}
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