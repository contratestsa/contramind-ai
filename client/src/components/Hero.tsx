import { Button } from '@/components/ui/button';

export default function Hero() {
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
                احصل على 3 أشهر مجاناً عند الإطلاق
              </span>
            </div>

            {/* Main Heading - Arabic first */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="block text-white">
                منصة الذكاء الاصطناعي
              </span>
              <span className="block text-sky glow-text">
                الأولى للعقود القانونية
              </span>
              <span className="block text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">
                في المنطقة العربية
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              حلول ذكية وسريعة لتحليل وصياغة العقود القانونية باللغة العربية، مع دعم كامل للقوانين المحلية والدولية
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <Button 
                onClick={scrollToWaitlist}
                size="lg" 
                className="w-full sm:w-auto bg-sky hover:bg-sky/90 text-navy font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 glow-button"
              >
                انضم لقائمة الانتظار
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-sky text-sky hover:bg-sky hover:text-navy font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300"
              >
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>متوافق مع القوانين المحلية</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>حماية كاملة للبيانات</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>ذكاء اصطناعي متقدم</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}