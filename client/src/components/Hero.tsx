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
    <section className="relative bg-gradient-to-br from-navy to-navy/80 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23B7DEE8' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            {/* Launch Offer Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-sky/20 text-sky px-4 py-2 rounded-full text-sm font-medium mb-6 glass-effect"
            >
              <i className="fas fa-star ml-2 rtl:ml-0 rtl:mr-2" />
              <span>
                {t('احصل على 3 أشهر مجاناً عند الإطلاق', 'Get 3 Months Free at Launch')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-space font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">
                {t('أول منصة ذكية', 'First AI-Native')}
              </span>
              <br />
              <span>
                {t('لإدارة العقود في المنطقة', 'CLM for MENA')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl lg:text-2xl text-sky/90 mb-8 font-inter leading-relaxed"
            >
              {t('صياغة، تفاوض وتوقيع أسرع مع الذكاء الاصطناعي', 'Draft, Negotiate & Sign Faster with AI')}
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-end gap-4 mb-8 text-sm"
            >
              {[
                { ar: 'صياغة آلية', en: 'Automated Drafting' },
                { ar: 'تفاوض ذكي', en: 'Smart Negotiation' },
                { ar: 'تقييم المخاطر', en: 'Risk Assessment' },
                { ar: 'توقيع إلكتروني', en: 'E-Signatures' },
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
                  {t('انضم لقائمة الانتظار المبكر', 'Join Early-Access Waitlist')}
                </span>
                <i className="fas fa-arrow-left mr-2 rtl:mr-0 rtl:ml-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform flip-rtl" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              whileHover={{ rotate: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 transition-transform duration-500"
            >
              <div className="bg-grey/30 rounded-lg h-64 lg:h-80 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-file-contract text-6xl text-navy/20 mb-4" />
                  <p className="text-navy/60 font-medium">
                    {t('واجهة منصة ContraMind.ai', 'ContraMind.ai Platform Interface')}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="text-xs text-navy/40 font-mono">app.contramind.ai</div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 bg-sky/20 backdrop-blur-sm rounded-xl p-3"
            >
              <i className="fas fa-robot text-sky text-xl" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-3"
            >
              <i className="fas fa-shield-alt text-white text-xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
