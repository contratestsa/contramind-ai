import { motion } from 'framer-motion';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Waitlist() {
  const { t } = useSimpleLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(t('شكراً لاهتمامك! سيتم تفعيل النموذج قريباً.', 'Thank you for your interest! Form will be activated soon.'));
  };

  return (
    <section id="waitlist" className="py-20 lg:py-32 bg-gradient-to-br from-navy to-purple-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-6xl font-arabic-heading-bold text-white mb-6">
              {t('انضم إلى قائمة الانتظار', 'Join the Waitlist')}
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-arabic-body">
              {t(
                'كن من أوائل المستفيدين من ثورة الذكاء الاصطناعي في الخدمات القانونية. احصل على وصول مبكر وخصومات حصرية.',
                'Be among the first to benefit from the AI revolution in legal services. Get early access and exclusive discounts.'
              )}
            </p>

            {/* Countdown Timer */}
            <div className="mb-8">
              <h3 className="text-lg font-arabic-body-bold text-white mb-4">
                {t('الإطلاق المتوقع خلال:', 'Expected launch in:')}
              </h3>
              <div className="flex gap-4">
                <div className="text-center bg-white/10 rounded-lg p-3 min-w-[80px]">
                  <div className="text-2xl font-bold text-white">30</div>
                  <div className="text-sm text-gray-300">{t('يوم', 'Days')}</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 min-w-[80px]">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-300">{t('ساعة', 'Hours')}</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 min-w-[80px]">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-300">{t('دقيقة', 'Minutes')}</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 min-w-[80px]">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-300">{t('ثانية', 'Seconds')}</div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-navy text-sm"></i>
                </div>
                <span className="text-gray-300 font-arabic-body">
                  {t('وصول مبكر حصري للمنصة', 'Exclusive early access to the platform')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-navy text-sm"></i>
                </div>
                <span className="text-gray-300 font-arabic-body">
                  {t('خصم 50% على الاشتراك الأول', '50% discount on first subscription')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-navy text-sm"></i>
                </div>
                <span className="text-gray-300 font-arabic-body">
                  {t('دعم فني متخصص', 'Specialized technical support')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-white font-arabic-body-bold">
                  {t('الاسم الكامل', 'Full Name')}
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-gold focus:ring-gold"
                  placeholder={t('اكتب اسمك الكامل', 'Enter your full name')}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white font-arabic-body-bold">
                  {t('البريد الإلكتروني', 'Email Address')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-gold focus:ring-gold"
                  placeholder={t('your@email.com', 'your@email.com')}
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-white font-arabic-body-bold">
                  {t('الشركة', 'Company')}
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-gold focus:ring-gold"
                  placeholder={t('اسم شركتك', 'Your company name')}
                />
              </div>

              <div>
                <Label htmlFor="jobTitle" className="text-white font-arabic-body-bold">
                  {t('المسمى الوظيفي', 'Job Title')}
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  required
                  className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-gold focus:ring-gold"
                  placeholder={t('مسماك الوظيفي', 'Your job title')}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-navy font-arabic-body-bold py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('انضم إلى قائمة الانتظار', 'Join Waitlist')}
              </Button>
            </form>

            <p className="text-sm text-gray-400 text-center mt-6 font-arabic-body">
              {t(
                'سنحترم خصوصيتك ولن نشارك بياناتك مع أطراف ثالثة',
                'We respect your privacy and will not share your data with third parties'
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}