import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const { t, language } = useLanguage();

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
          <div>
            {/* Launch Offer Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-sky/20 rounded-full text-sky text-sm font-medium mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-sky rounded-full mr-2 rtl:mr-0 rtl:ml-2 animate-pulse" />
              {t('عرض الإطلاق المحدود', 'Limited Launch Offer')}
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-arabic-heading-bold mb-6 sm:mb-8 leading-tight">
              <span className="block">
                {t('منصة ContraMind', 'ContraMind Platform')}
              </span>
              <span className="block text-sky">
                {t('للذكاء الاصطناعي', 'AI-Powered')}
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-arabic-body mt-2 text-gray-300">
                {t(
                  'أول منصة ذكاء اصطناعي للعقود باللغة العربية',
                  'First AI Contract Platform in Arabic Language'
                )}
              </span>
            </h1>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm px-4 sm:px-0">
              {[
                { ar: 'صياغة', en: 'Drafting' },
                { ar: 'تفاوض', en: 'Negotiation' },
                { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
                { ar: 'توقيع إلكتروني', en: 'ESigning' },
                { ar: 'متابعة', en: 'Tracking' },
              ].map((feature, index) => (
                <span
                  key={index}
                  className="bg-white/10 px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm"
                >
                  {feature.ar}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-arabic-body max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
              {t(
                'احصل على الوصول المبكر لأول منصة ذكاء اصطناعي متخصصة في إدارة العقود باللغة العربية. تحليل فوري، مراجعة دقيقة، وحلول قانونية مبتكرة.',
                'Get early access to the first AI platform specialized in Arabic contract management. Instant analysis, precise review, and innovative legal solutions.'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
              <Button
                onClick={scrollToWaitlist}
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-sky hover:bg-sky/90 text-navy transition-all duration-300 hover:scale-105"
              >
                {t('انضم للقائمة المبكرة', 'Join Early Access')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-navy transition-all duration-300"
              >
                {t('شاهد العرض التوضيحي', 'Watch Demo')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}