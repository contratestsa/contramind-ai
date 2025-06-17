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
      icon: 'fas fa-robot',
      title: { ar: 'صياغة العقود بالذكاءالاصطناعي', en: 'AI Contract Drafting' },
      description: {
        ar: 'إنشاء مسودات عقود احترافية بنقرة واحدة',
        en: 'Generate professional contract drafts with only one click',
      },
    },
    {
      icon: 'fas fa-handshake',
      title: { ar: 'مساعد التفاوض الذكي', en: 'Smart Negotiation Assistant' },
      description: {
        ar: 'تسريع عمليات التفاوض بين الإدارات في الشركة',
        en: 'Accelerate negotiation processes between Corporate Teams',
      },
    },
    {
      icon: 'fas fa-search',
      title: { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
      description: {
        ar: 'تحليل شامل للمخاطر وفقاً للقوانين السعودية',
        en: 'Comprehensive risk analysis with Saudi regulations',
      },
    },
    {
      icon: 'fas fa-clipboard-check',
      title: { ar: 'مراقبة الإمتثال', en: 'Compliance Monitoring' },
      description: {
        ar: 'متابعة مستمرة للامتثال والتحديثات التنظيمية',
        en: 'Continuous compliance tracking and regulatory updates',
      },
    },
    {
      icon: 'fas fa-signature',
      title: { ar: 'توقيع إلكتروني معتمد', en: 'Certified ESignature' },
      description: {
        ar: 'توقيع إلكتروني معتمد ومتوافق مع المعايير المحلية',
        en: 'Certified esignature compliant with local regulations',
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
            className="text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-6"
          >
            {t('ميزات متقدمة للمحترفين', 'Advanced Features for Professionals')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 font-arabic-body max-w-3xl mx-auto"
          >
            {t(
              'من ثلاثة أسابيع إلى ساعات',
              'From Weeks to Hours → Transforming Contract Management'
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
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-sky/20 rounded-2xl flex items-center justify-center ml-4 rtl:ml-0 rtl:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-clock text-2xl text-white ml-[10px] mr-[10px] pl-[13px] pr-[13px] mt-[9px] mb-[9px] pt-[12px] pb-[12px]" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-arabic-heading-bold text-white">
                  {t(
                    'عزّز إنتاجية أعمالك مع ContraMind',
                    'Enhance Your Business Productivity with ContraMind'
                  )}
                </h3>
              </div>
              <p className="text-gray-300 text-lg mb-6 font-arabic-body text-justify">
                {t(
                  'نوفر لك منصة متكاملة لإدارة وتوزيع المهام بكل سهولة، مع متابعة دقيقة لإنجاز المهام، مما يتيح لفريقك التركيز على ما يهم فعلاً. نُسهل لك عمليات التفاوض المعقدة، ونقدّم حلول ذكية تدعم اتخاذ القرارات القانونية بثقة ووضوح ، لتختصر الوقت والجهد في كل مرحلة من مراحل إبرام العقد. مع ContraMind، أنت في قلب كل خطوة، تحكم ووضوح وكفاءة، لضمان سير أعمالك بشكل قانوني و بكفاءة وشفافية مستمرة.',
                  'We provide you with an integrated platform for managing and distributing tasks with ease, along with precise task completion tracking that allows your team to focus on what truly matters. We simplify complex negotiation processes and offer smart solutions that support confident and informed legal decision making, saving time and effort at every stage of contract completion. With ContraMind, you are at the center of every step, with control, clarity, and efficiency, ensuring your legal runs smoothly and legally with continuous transparency.'
                )}
              </p>

            </div>
          </motion.div>

          {/* Secondary Feature Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-700/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-custom-hover transition-all duration-300"
          >
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy/10 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-navy/20 rounded-2xl flex items-center justify-center ml-4 rtl:ml-0 rtl:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-cogs text-2xl text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-arabic-heading-bold text-white">
                  {t('مراجعة قانونية دقيقة وتحليل مخاطر متكامل', 'Precise Legal Review and Comprehensive Risk Analysis')}
                </h3>
              </div>
              <p className="text-gray-300 text-lg mb-6 font-arabic-body text-justify">
                {t(
                  'توفّر لك ContraMind منصة متطورة تجمع جميع مراحل إدارة العقود في مكان واحد، بدءًا من صياغة الوثائق وصولاً إلى التفاوض، المراجعة، تحليل المخاطر، التوقيع، الحفظ، ثم الإدارة.وذلك لتمكين فريقك من التركيز على اتخاذ القرارات بكل ثقة، مع تقليل المخاطر وتحقيق أعلى مستويات الكفاءة.نرافقك في كل خطوة، لنضمن لك نتائج دقيقة ومستدامة بشفافية كاملة.',
                  'ContraMind offers a comprehensive platform that integrates all stages of contract management in one location. From document drafting to negotiation, review, risk analysis, signing, storage, and management. This enables your team to focus on making decisions with complete confidence, while reducing risks and achieving the highest levels of efficiency. We support you at every stage to ensure accurate and sustainable outcomes with full transparency.'
                )}
              </p>

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
