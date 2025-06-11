import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export default function Features() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const features = [
    {
      icon: 'fas fa-shield-alt',
      title: { ar: 'حافظ على الامتثال بشكل مستمر', en: 'Stay compliant continuously' },
      description: {
        ar: 'مراقبة تلقائية للامتثال التنظيمي وفقاً للقوانين المحلية',
        en: 'Automatic regulatory compliance monitoring per local laws',
      },
    },
    {
      icon: 'fas fa-edit',
      title: { ar: 'مساعد الصياغة بالذكاء الاصطناعي', en: 'Ready AI Draft Assist' },
      description: {
        ar: 'إنشاء مسودات عقود احترافية بنقرة واحدة',
        en: 'Generate professional contract drafts with one click',
      },
    },
    {
      icon: 'fas fa-handshake',
      title: { ar: 'مساعد التفاوض التجريبي', en: 'Alpha Negotiation Copilot' },
      description: {
        ar: 'مساعدة ذكية في التفاوض مع اقتراحات فورية',
        en: 'Smart negotiation assistance with instant suggestions',
      },
    },
    {
      icon: 'fas fa-search',
      title: { ar: 'تحليل مخاطر متخصص بالسعودية', en: 'PoC Saudi-Specific Risk Analysis' },
      description: {
        ar: 'تحليل شامل للمخاطر وفقاً للقوانين السعودية',
        en: 'Comprehensive risk analysis per Saudi regulations',
      },
    },
    {
      icon: 'fas fa-clipboard-check',
      title: { ar: 'مراقبة الامتثال التنظيمي حسب الخطة', en: 'Road-map Regulatory Compliance Monitor' },
      description: {
        ar: 'متابعة مستمرة للامتثال والتحديثات التنظيمية',
        en: 'Continuous compliance tracking and regulatory updates',
      },
    },
    {
      icon: 'fas fa-signature',
      title: { ar: 'توقيع إلكتروني أصلي وجاهز', en: 'Ready Native E-Signature' },
      description: {
        ar: 'توقيع إلكتروني معتمد ومتوافق مع المعايير المحلية',
        en: 'Certified e-signature compliant with local standards',
      },
    },
  ];

  return (
    <section id="product" className="py-20 lg:py-32 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl lg:text-5xl font-heading font-bold text-white mb-6"
          >
            {t('ميزات متقدمة للمحترفين', 'Advanced Features for Professionals')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 font-sans max-w-3xl mx-auto"
          >
            {t(
              'من ثلاثة أسابيع إلى ساعات - ثورة حقيقية في إدارة العقود',
              'From three weeks to hours - a true revolution in contract management'
            )}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 mb-20"
        >
          {/* Main Feature Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-700/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-custom-hover transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="w-16 h-16 bg-sky/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-clock text-2xl text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4">
                {t(
                  'تقليص مدة التفاوض من ثلاثة أسابيع إلى ساعات',
                  'Three-week negotiations reduced to hours'
                )}
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                {t(
                  'مساعد التفاوض يقدم اقتراحات ومقترحات مضادة على مستوى البنود فوراً',
                  'Negotiation Copilot surfaces clause-level suggestions instantly'
                )}
              </p>
              <div className="flex items-center text-sky font-semibold group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300">
                <span>{t('اكتشف المزيد', 'Learn More')}</span>
                <i className="fas fa-arrow-left mr-2 rtl:mr-0 rtl:ml-2 flip-rtl" />
              </div>
            </div>
          </motion.div>

          {/* Secondary Feature Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-700/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-custom-hover transition-all duration-300"
          >
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy/10 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="w-16 h-16 bg-navy/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-cogs text-2xl text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4">
                {t('مراجعة يدوية مُؤتمتة', 'Manual review, automated')}
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                {t(
                  'أداة واحدة موحدة: صياغة، تفاوض، تقييم المخاطر، توقيع',
                  'One unified tool: Draft, negotiate, assess risk, sign'
                )}
              </p>
              <div className="flex items-center text-sky font-semibold group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300">
                <span>{t('استكشف الأدوات', 'Explore Tools')}</span>
                <i className="fas fa-arrow-left mr-2 rtl:mr-0 rtl:ml-2 flip-rtl" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-6 rounded-2xl hover:bg-gray-700/30 transition-all duration-300 hover:shadow-custom group"
            >
              <div className="w-16 h-16 bg-sky/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className={`${feature.icon} text-2xl text-white`} />
              </div>
              <h4 className="text-xl font-space font-semibold text-white mb-3">
                {t(feature.title.ar, feature.title.en)}
              </h4>
              <p className="text-gray-300">
                {t(feature.description.ar, feature.description.en)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
