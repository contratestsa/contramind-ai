import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';

export default function Features() {
  const { t } = useSimpleLanguage();

  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-6">
            {t('المميزات', 'Features')}
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
                  <i className="fas fa-clock text-2xl text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-arabic-heading-bold text-white">
                  {t('سرعة لا تُصدّق', 'Unbelievable Speed')}
                </h3>
              </div>
              <p className="text-gray-300 mb-6 font-arabic-body leading-relaxed">
                {t(
                  'قلل من الوقت المطلوب لمراجعة العقود من أسابيع إلى ساعات مع مساعد الذكاء الاصطناعي المخصص للقانون',
                  'Reduce contract review time from weeks to hours with our specialized legal AI assistant'
                )}
              </p>
              <div className="flex items-center text-sky font-medium">
                <i className="fas fa-arrow-left rtl:rotate-180 ml-2 rtl:ml-0 rtl:mr-2" />
                <span>{t('تعرف على المزيد', 'Learn More')}</span>
              </div>
            </div>
          </div>

          {/* Secondary Feature Card */}
          <div className="bg-gray-700/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-custom-hover transition-all duration-300">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky/10 rounded-full transform -translate-x-16 translate-y-16 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-sky/20 rounded-2xl flex items-center justify-center ml-4 rtl:ml-0 rtl:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-globe text-2xl text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-arabic-heading-bold text-white">
                  {t('دعم اللغة العربية', 'Arabic Language Support')}
                </h3>
              </div>
              <p className="text-gray-300 mb-6 font-arabic-body leading-relaxed">
                {t(
                  'أول منصة ذكاء اصطناعي قانونية مصممة خصيصاً لدعم اللغة العربية والقوانين المحلية في منطقة الشرق الأوسط',
                  'First legal AI platform designed specifically for Arabic language support and local regulations in the Middle East'
                )}
              </p>
              <div className="flex items-center text-sky font-medium">
                <i className="fas fa-arrow-left rtl:rotate-180 ml-2 rtl:ml-0 rtl:mr-2" />
                <span>{t('اكتشف الإمكانيات', 'Discover Capabilities')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: 'fas fa-edit',
              title: { ar: 'صياغة ذكية', en: 'Smart Drafting' },
              description: {
                ar: 'إنشاء عقود احترافية بالذكاء الاصطناعي',
                en: 'Generate professional contracts with AI assistance'
              }
            },
            {
              icon: 'fas fa-search',
              title: { ar: 'مراجعة دقيقة', en: 'Precise Review' },
              description: {
                ar: 'تحليل شامل للمخاطر والثغرات القانونية',
                en: 'Comprehensive analysis of risks and legal gaps'
              }
            },
            {
              icon: 'fas fa-handshake',
              title: { ar: 'تفاوض مبسط', en: 'Simplified Negotiation' },
              description: {
                ar: 'أدوات متقدمة لتسهيل عملية التفاوض',
                en: 'Advanced tools to streamline negotiation process'
              }
            },
            {
              icon: 'fas fa-shield-alt',
              title: { ar: 'أمان متقدم', en: 'Advanced Security' },
              description: {
                ar: 'حماية عالية المستوى لبياناتك القانونية',
                en: 'Enterprise-grade security for your legal data'
              }
            },
            {
              icon: 'fas fa-users',
              title: { ar: 'تعاون فعال', en: 'Effective Collaboration' },
              description: {
                ar: 'منصة موحدة لفرق العمل القانونية',
                en: 'Unified platform for legal teams collaboration'
              }
            },
            {
              icon: 'fas fa-chart-line',
              title: { ar: 'تحليلات متقدمة', en: 'Advanced Analytics' },
              description: {
                ar: 'إحصائيات وتقارير شاملة لأداء العقود',
                en: 'Comprehensive insights and contract performance reports'
              }
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-sky/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className={`${feature.icon} text-sky`} />
              </div>
              <h4 className="text-xl font-arabic-heading-bold text-white mb-3">
                {t(feature.title.ar, feature.title.en)}
              </h4>
              <p className="text-gray-300 font-arabic-body leading-relaxed">
                {t(feature.description.ar, feature.description.en)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}