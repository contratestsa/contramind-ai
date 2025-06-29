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
            <div className="inline-flex items-center bg-sky/20 text-sky px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 glass-effect">
              <span className="animate-pulse glow-text font-bold text-[#f0f2f2]">
                {t('احصل على 3 أشهر مجاناً عند الإطلاق', 'Get 3 Months Free at Launch')}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-6xl leading-[1.1] sm:leading-[1.1] lg:leading-[1.1] mb-6 sm:mb-8 px-2 sm:px-0 text-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              <span className="gradient-text block whitespace-pre-line text-center">
                <span style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                  {t('أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي', 'The First Legal AI Platform for Contract Management and Review, Supporting Arabic Language')}
                </span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
               style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Inter', sans-serif" }}>
              {t('اكتشف قوة الذكاء الاصطناعي في مراجعة وتحليل العقود القانونية. منصة متطورة مصممة خصيصاً للمحامين والشركات في المنطقة العربية.', 'Discover the power of AI in legal contract review and analysis. An advanced platform designed specifically for lawyers and companies in the Arab region.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
              <Button
                onClick={scrollToWaitlist}
                className="w-full sm:w-auto bg-sky hover:bg-sky/90 text-navy font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-custom hover:shadow-custom-hover transform hover:scale-105"
                style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Space Grotesk', sans-serif" }}
              >
                {t('انضم للقائمة المبكرة', 'Join Early Access')}
              </Button>
              
              <div className="text-center sm:text-left">
                <p className="text-sky font-semibold text-lg"
                   style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Space Grotesk', sans-serif" }}>
                  {t('الإطلاق قريباً', 'Coming Soon')}
                </p>
                <p className="text-gray-400 text-sm"
                   style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Inter', sans-serif" }}>
                  {t('انضم إلى أكثر من 1000+ مستخدم في الانتظار', 'Join 1000+ users waiting')}
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-60">
              <div className="flex items-center gap-2 text-sm text-gray-400"
                   style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Inter', sans-serif" }}>
                <span>🔒</span>
                <span>{t('آمن ومشفر', 'Secure & Encrypted')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400"
                   style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Inter', sans-serif" }}>
                <span>⚡</span>
                <span>{t('تحليل فوري', 'Instant Analysis')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400"
                   style={{ fontFamily: language === 'ar' ? "'Almarai', sans-serif" : "'Inter', sans-serif" }}>
                <span>🌍</span>
                <span>{t('دعم عربي كامل', 'Full Arabic Support')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}