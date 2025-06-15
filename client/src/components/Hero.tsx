import { motion } from 'framer-motion';
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
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Launch Offer Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-sky/20 text-sky px-4 py-2 rounded-full text-sm font-medium mb-6 glass-effect"
            >
              <span className="animate-pulse glow-text font-bold text-[#f0f2f2]">
                احصل على 3 أشهر مجاناً عند الإطلاق
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-arabic-heading-bold leading-loose pt-[12px] pb-[12px] pl-[-3px] pr-[-3px] ml-[-22px] mr-[-22px] mt-[19px] mb-[19px]"
            >
              <span className="gradient-text ml-[0px] mr-[0px] pl-[0px] pr-[0px] pt-[75px] pb-[75px] mt-[28px] mb-[28px]">
                أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي
              </span>
            </motion.h1>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 mb-8 text-sm"
            >
              {['صياغة', 'تفاوض', 'تحليل مخاطر', 'توقيع إلكتروني'].map((feature, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/10 px-3 py-1 rounded-full font-bold"
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                onClick={scrollToWaitlist}
                className="bg-sky hover:bg-sky/90 text-navy font-bold px-8 py-3 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                انضم لقائمة الانتظار
              </Button>
              
              <p className="text-grey/80 text-sm">
                انضم إلى أكثر من 500+ محامي ومستشار قانوني
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}