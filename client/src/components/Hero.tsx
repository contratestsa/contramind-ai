import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const { t, language } = useSimpleLanguage();

  const scrollToWaitlist = () => {
    const element = document.querySelector('#waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-sky/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-sky/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center bg-sky/20 text-sky px-4 py-2 rounded-full text-sm font-medium mb-8">
            <i className="fas fa-rocket ml-2 rtl:ml-0 rtl:mr-2" />
            <span>{t('قريباً', 'Coming Soon')}</span>
          </div>

          <h1 className={`text-4xl lg:text-6xl leading-loose pt-[12px] pb-[12px] pl-[-3px] pr-[-3px] ml-[-22px] mr-[-22px] mt-[19px] mb-[19px] ${language === 'ar' ? 'font-arabic-heading-bold' : 'font-heading font-bold'}`}>
            <span className="gradient-text ml-[0px] mr-[0px] pl-[0px] pr-[0px] pt-[75px] pb-[75px] mt-[28px] mb-[28px]">
              {t(' أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي', 'The First Legal AI Platform for Contract Management & Review, Supporting Arabic Language')}
            </span>
          </h1>

          <p className={`text-xl text-gray-300 ${language === 'ar' ? 'font-arabic-body' : 'font-body'} max-w-3xl mx-auto mb-12`}>
            {t(
              'ثلاثة أشهر مجاناً عند الإطلاق - كن من أوائل المستخدمين',
              'Get 3 months free at launch - Be among the first users'
            )}
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            {[
              { ar: 'صياغة', en: 'Drafting' },
              { ar: 'تفاوض', en: 'Negotiation' },
              { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
              { ar: 'توقيع إلكتروني', en: 'ESigning' },
              { ar: 'متابعة', en: 'Tracking' },
            ].map((feature, index) => (
              <span
                key={index}
                className="bg-white/10 px-3 py-1 rounded-full font-bold"
              >
                {t(feature.ar, feature.en)}
              </span>
            ))}
          </div>

          <Button
            onClick={scrollToWaitlist}
            size="lg"
            className="bg-sky hover:bg-sky/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-custom hover:shadow-custom-hover transition-all duration-300"
          >
            {t('انضم إلى قائمة الانتظار', 'Join Waitlist')}
            <i className="fas fa-arrow-left ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  );
}