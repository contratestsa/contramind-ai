import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const { t } = useLanguage();

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
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
              className="inline-flex items-center bg-sky/20 text-sky px-4 py-2 rounded-full text-sm font-medium mb-6 glass-effect"
            >
              <span>
                {t('احصل على 3 أشهر مجاناً عند الإطلاق', 'Get 3 Months Free at Launch')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-heading font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">
                {t(' أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي', 'The Premier AI-Powered Legal Contract Management Platform in MENA')}
              </span>
            </motion.h1>





            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 mb-8 text-sm"
            >
              {[
                { ar: 'صياغة', en: 'Drafting' },
                { ar: 'تفاوض', en: 'Negotiation' },
                { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
                { ar: 'توقيع إلكتروني', en: 'ESigning' },
              ].map((feature, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/10 px-3 py-1 rounded-full"
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
                className="bg-sky text-navy px-8 py-4 rounded-custom font-semibold text-lg hover:bg-sky/90 transition-all duration-300 shadow-custom-hover group"
              >
                <span>
                  {t('انضم لقائمة الانتظار ⟶', 'Join the Early Access Waitlist ⟶')}
                </span>
              </Button>
            </motion.div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
