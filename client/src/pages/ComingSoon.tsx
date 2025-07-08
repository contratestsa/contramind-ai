import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Lock, Globe } from 'lucide-react';

export default function ComingSoon() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate time until launch (July 18, 2025)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2025-07-18T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#1e2936] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e2936] via-[#243342] to-[#1e2936]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        {/* ContraMind.ai Logo/Text */}
        <h2 className="text-3xl font-bold text-white mb-8 font-space tracking-wider animate-pulse">ContraMind.ai</h2>

        {/* Coming Soon Heading */}
        <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4 font-space tracking-wide" style={{
          textShadow: '0 0 40px rgba(183, 222, 232, 0.8), 0 0 80px rgba(183, 222, 232, 0.6)'
        }}>
          {t('قريباً', 'Coming Soon')}
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-300 mb-12 font-inter tracking-wide">
          {t('نحن نحضر شيئاً مذهلاً لك', "We're preparing something amazing for you")}
        </p>

        {/* Countdown Timer Box */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 mb-12 shadow-2xl max-w-2xl mx-auto"
          style={{
            boxShadow: '0 0 60px rgba(183, 222, 232, 0.5), 0 10px 40px rgba(0, 0, 0, 0.2)'
          }}
        >
          <p className="text-gray-500 text-sm mb-4 font-inter">{t('الوقت حتى الإطلاق', 'Time until launch')}</p>
          <div className="text-5xl lg:text-6xl font-bold text-[#1e2936] tracking-wider font-space">
            {formatNumber(timeLeft.days)}:{formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
          </div>
          <div className="flex justify-center gap-8 mt-3 text-gray-500 text-sm">
            <span>{t('أيام', 'Days')}</span>
            <span>:</span>
            <span>{t('ساعات', 'Hours')}</span>
            <span>:</span>
            <span>{t('دقائق', 'Minutes')}</span>
            <span>:</span>
            <span>{t('ثواني', 'Seconds')}</span>
          </div>
        </motion.div>

        {/* Features Box */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[#243342] rounded-3xl p-8 shadow-xl max-w-3xl mx-auto border border-gray-700"
          style={{
            boxShadow: '0 0 50px rgba(183, 222, 232, 0.3), 0 10px 30px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(183, 222, 232, 0.2)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-space">
            {t('مرحباً بك في ContraMind.ai', 'Welcome to ContraMind.ai')}
          </h3>
          <p className="text-gray-400 mb-8 font-inter">
            {t('أول منصة لإدارة العقود القانونية مدعومة بالذكاء الاصطناعي في منطقة الشرق الأوسط وشمال أفريقيا', 'The first AI-powered legal contract management platform for the MENA region')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center mx-auto mb-3 transition-all hover:scale-110" style={{
                borderColor: 'rgba(183, 222, 232, 0.5)',
                boxShadow: '0 0 20px rgba(183, 222, 232, 0.3)'
              }}>
                <Lightbulb className="w-8 h-8 text-[#B7DEE8]" />
              </div>
              <p className="text-gray-300 text-sm font-inter">{t('تحليل ذكي', 'Smart Analysis')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center mx-auto mb-3 transition-all hover:scale-110" style={{
                borderColor: 'rgba(183, 222, 232, 0.5)',
                boxShadow: '0 0 20px rgba(183, 222, 232, 0.3)'
              }}>
                <Lock className="w-8 h-8 text-[#B7DEE8]" />
              </div>
              <p className="text-gray-300 text-sm font-inter">{t('أمان متقدم', 'Advanced Security')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center mx-auto mb-3 transition-all hover:scale-110" style={{
                borderColor: 'rgba(183, 222, 232, 0.5)',
                boxShadow: '0 0 20px rgba(183, 222, 232, 0.3)'
              }}>
                <Globe className="w-8 h-8 text-[#B7DEE8]" />
              </div>
              <p className="text-gray-300 text-sm font-inter">{t('دعم ثنائي اللغة', 'Bilingual Support')}</p>
            </div>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-400 mt-12 font-inter"
        >
          {t('شكراً لانضمامك إلينا. ترقب الإطلاق!', 'Thank you for joining us. Stay tuned for the launch!')}
        </motion.p>
      </motion.div>
    </div>
  );
}