import { useLanguage } from '@/hooks/useLanguage';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fas fa-robot',
      title: { ar: 'ذكاء اصطناعي متطور', en: 'Advanced AI' },
      description: {
        ar: 'تحليل عميق للعقود باستخدام أحدث تقنيات الذكاء الاصطناعي المدربة على القوانين المحلية',
        en: 'Deep contract analysis using cutting-edge AI trained on local laws',
      },
    },
    {
      icon: 'fas fa-shield-alt',
      title: { ar: 'أمان وحماية', en: 'Security & Protection' },
      description: {
        ar: 'حماية متقدمة للبيانات مع التشفير الكامل والامتثال لمعايير الأمان العالمية',
        en: 'Advanced data protection with full encryption and global security compliance',
      },
    },
    {
      icon: 'fas fa-language',
      title: { ar: 'دعم ثنائي اللغة', en: 'Bilingual Support' },
      description: {
        ar: 'واجهة مطورة باللغتين العربية والإنجليزية مع دعم كامل للنصوص من اليمين إلى اليسار',
        en: 'Built for Arabic and English with full RTL support and cultural adaptation',
      },
    },
    {
      icon: 'fas fa-chart-line',
      title: { ar: 'تحليلات متقدمة', en: 'Advanced Analytics' },
      description: {
        ar: 'تقارير شاملة ورؤى تحليلية لتحسين عمليات إدارة العقود وزيادة الكفاءة',
        en: 'Comprehensive reports and insights to optimize contract management efficiency',
      },
    },
  ];

  return (
    <section id="product" className="py-20 lg:py-32 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-6">
            {t('ميزات متقدمة للمحترفين', 'Advanced Features for Professionals')}
          </h2>
          <p className="text-xl text-gray-300 font-arabic-body max-w-3xl mx-auto">
            {t(
              'من ثلاثة أسابيع إلى ساعات',
              'From Weeks to Hours → Transforming Contract Management'
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Main Feature Card */}
          <div className="bg-gray-700/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-custom-hover transition-all duration-300">
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
              <p className="text-gray-300 text-lg font-arabic-body leading-relaxed mb-6">
                {t(
                  'اختصر عملية مراجعة العقود من أسابيع إلى ساعات. احصل على تحليل شامل، مراجعة دقيقة، واقتراحات تطوير فورية لجميع عقودك.',
                  'Reduce contract review from weeks to hours. Get comprehensive analysis, precise review, and instant improvement suggestions for all your contracts.'
                )}
              </p>
              <div className="flex items-center text-sky">
                <i className="fas fa-arrow-left text-lg ml-2 rtl:ml-0 rtl:mr-2 rtl:transform rtl:rotate-180" />
                <span className="font-medium">
                  {t('اكتشف الفرق', 'Discover the Difference')}
                </span>
              </div>
            </div>
          </div>

          {/* Process Visualization */}
          <div className="bg-gray-700/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
            <h3 className="text-2xl font-arabic-heading-bold text-white mb-8">
              {t('كيف يعمل ContraMind؟', 'How ContraMind Works')}
            </h3>
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: { ar: 'ارفع العقد', en: 'Upload Contract' },
                  description: { ar: 'رفع سريع وآمن', en: 'Quick & Secure Upload' },
                },
                {
                  step: '02',
                  title: { ar: 'تحليل تلقائي', en: 'AI Analysis' },
                  description: { ar: 'مراجعة شاملة بالذكاء الاصطناعي', en: 'Comprehensive AI Review' },
                },
                {
                  step: '03',
                  title: { ar: 'تقرير فوري', en: 'Instant Report' },
                  description: { ar: 'نتائج مفصلة واقتراحات', en: 'Detailed Results & Suggestions' },
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center group">
                  <div className="w-12 h-12 bg-sky/20 rounded-xl flex items-center justify-center ml-4 rtl:ml-0 rtl:mr-4 group-hover:bg-sky/30 transition-colors">
                    <span className="text-sky font-bold text-lg">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-arabic-heading-medium text-lg mb-1">
                      {item.title.ar}
                    </h4>
                    <p className="text-gray-400 text-sm font-arabic-body">
                      {item.description.ar}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-700/50 rounded-2xl p-6 lg:p-8 text-center hover:shadow-custom-hover transition-all duration-300 group hover:bg-gray-700/70"
            >
              <div className="w-16 h-16 bg-sky/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className={`${feature.icon} text-2xl text-sky`} />
              </div>
              <h3 className="text-xl font-arabic-heading-bold text-white mb-4">
                {feature.title.ar}
              </h3>
              <p className="text-gray-300 font-arabic-body text-sm leading-relaxed">
                {feature.description.ar}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}