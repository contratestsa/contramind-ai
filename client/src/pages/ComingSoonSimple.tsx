import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import CountdownTimer from '@/components/CountdownTimer';
import { Lightbulb, Shield, Globe } from 'lucide-react';

export default function ComingSoonSimple() {
  const { t, language } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#2c4a5a] to-[#1e3544] flex flex-col items-center justify-center px-4 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Logo */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-white mb-12"
      >
        ContraMind.ai
      </motion.h1>

      {/* Coming Soon Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl md:text-6xl font-bold text-white mb-4"
      >
        {t('قريباً', 'Coming Soon')}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-xl text-white/80 mb-12"
      >
        {t('نحن نحضر شيئاً مذهلاً لك', "We're preparing something amazing for you")}
      </motion.p>

      {/* Countdown Timer Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-xl mb-12 max-w-xl w-full"
      >
        <p className="text-gray-500 text-center mb-4">{t('الوقت حتى الإطلاق', 'Time until launch')}</p>
        <CountdownTimer size="large" />
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-[#243a48]/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-6">
          {t('مرحباً بك في ContraMind.ai', 'Welcome to ContraMind.ai')}
        </h3>
        <p className="text-white/80 text-center mb-8">
          {t(
            'أول منصة لإدارة العقود القانونية بالذكاء الاصطناعي لمنطقة الشرق الأوسط وشمال أفريقيا',
            'The first AI-powered legal contract management platform for the MENA region'
          )}
        </p>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white/30 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-medium">{t('تحليل ذكي', 'Smart Analysis')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-medium">{t('أمان متقدم', 'Advanced Security')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white/30 flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-medium">{t('دعم ثنائي اللغة', 'Bilingual Support')}</p>
          </div>
        </div>
      </motion.div>

      {/* Footer Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-white/60 text-center mt-8"
      >
        {t('شكراً لانضمامك إلينا. ترقب الإطلاق!', 'Thank you for joining us. Stay tuned for the launch!')}
      </motion.p>
    </div>
  );
}