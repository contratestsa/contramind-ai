import { useLanguage } from '@/hooks/useLanguage';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: '🤖',
      titleAr: 'تحليل ذكي للعقود',
      titleEn: 'Smart Contract Analysis',
      descriptionAr: 'تحليل شامل للعقود باستخدام الذكاء الاصطناعي مع تحديد المخاطر والفرص',
      descriptionEn: 'Comprehensive contract analysis using AI with risk and opportunity identification'
    },
    {
      icon: '⚡',
      titleAr: 'مراجعة فورية',
      titleEn: 'Instant Review',
      descriptionAr: 'مراجعة العقود في ثوانٍ معدودة مع تقارير مفصلة',
      descriptionEn: 'Review contracts in seconds with detailed reports'
    },
    {
      icon: '🌍',
      titleAr: 'دعم اللغة العربية',
      titleEn: 'Arabic Language Support',
      descriptionAr: 'دعم كامل للغة العربية والمصطلحات القانونية العربية',
      descriptionEn: 'Full support for Arabic language and legal terminology'
    },
    {
      icon: '🔒',
      titleAr: 'أمان متقدم',
      titleEn: 'Advanced Security',
      descriptionAr: 'حماية متقدمة للبيانات مع التشفير الكامل',
      descriptionEn: 'Advanced data protection with full encryption'
    },
    {
      icon: '📊',
      titleAr: 'تقارير تفصيلية',
      titleEn: 'Detailed Reports',
      descriptionAr: 'تقارير شاملة مع توصيات قابلة للتنفيذ',
      descriptionEn: 'Comprehensive reports with actionable recommendations'
    },
    {
      icon: '🔗',
      titleAr: 'تكامل سهل',
      titleEn: 'Easy Integration',
      descriptionAr: 'تكامل سلس مع أنظمة العمل الحالية',
      descriptionEn: 'Seamless integration with existing work systems'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-arabic-heading-bold text-navy mb-6">
            {t('ميزات ContraMind', 'ContraMind Features')}
          </h2>
          <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
            {t('اكتشف كيف يمكن لتقنيات الذكاء الاصطناعي المتقدمة أن تثور عمليات مراجعة العقود', 'Discover how advanced AI technology can revolutionize your contract review process')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-custom hover:shadow-custom-hover transition-all duration-300 border border-gray-200"
            >
              <div className="text-4xl mb-6 text-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-arabic-heading-medium text-navy mb-4 text-center">
                {t(feature.titleAr, feature.titleEn)}
              </h3>
              <p className="text-gray-600 font-arabic-body text-center leading-relaxed">
                {t(feature.descriptionAr, feature.descriptionEn)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-sky/10 text-sky px-6 py-3 rounded-full text-sm font-medium">
            <span className="mr-2">✨</span>
            {t('والمزيد من الميزات المتقدمة قريباً', 'And more advanced features coming soon')}
          </div>
        </div>
      </div>
    </section>
  );
}