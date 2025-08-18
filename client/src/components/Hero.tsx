
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LanguageManager } from '@/components/SimpleLanguage';

export default function Hero() {
  const t = LanguageManager.t;
  const language = LanguageManager.getLanguage();

  const scrollToWaitlist = () => {
    const element = document.querySelector('#waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-navy text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23B7DEE8' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Launch Offer Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-sky/20 text-sky px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 glass-effect"
            >
              <span className="animate-pulse glow-text font-bold text-[#f0f2f2]">
                {t('احصل على 3 أشهر مجاناً عند الإطلاق', 'Get 3 Months Free at Launch')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl lg:text-6xl leading-[1.1] sm:leading-[1.1] lg:leading-[1.1] mb-6 sm:mb-8 px-2 sm:px-0 text-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              <span className="gradient-text block whitespace-pre-line text-center">
                <span style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                  {t('أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي', 'The First Legal AI Platform for Contract Management and Review, Supporting Arabic Language')}
                </span>
              </span>
            </motion.h1>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm px-4 sm:px-0"
            >
              {[
                { ar: 'صياغة', en: 'Drafting' },
                { ar: 'تفاوض', en: 'Negotiation' },
                { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
                { ar: 'توقيع إلكتروني', en: 'ESigning' },
                { ar: 'متابعة', en: 'Tracking' },
              ].map((feature, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/10 px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm"
                >
                  {t(feature.ar, feature.en)}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={scrollToWaitlist}
                className="bg-sky text-navy px-6 sm:px-8 lg:px-[86px] py-3 sm:py-4 rounded-custom font-semibold hover:bg-sky/90 transition-all duration-300 shadow-custom-hover group mx-4 sm:mx-0"
              >
                <span className="text-sm sm:text-lg lg:text-[26px] font-arabic-body-bold">
                  {t('انضم لقائمة الإنتظار ⟶', 'Join the Early Access Waitlist ⟶')}
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}