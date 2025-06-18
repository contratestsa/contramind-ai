import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface WaitlistData {
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  jobTitle: string;
}

export default function Waitlist() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<WaitlistData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
  });

  // Fetch the actual waitlist count from the database
  const { data: waitlistCount } = useQuery({
    queryKey: ['/api/waitlist/count'],
    queryFn: async () => {
      const response = await fetch('/api/waitlist/count');
      if (!response.ok) throw new Error('Failed to fetch waitlist count');
      const data = await response.json();
      return data.count;
    },
  });

  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: async (data: WaitlistData) => {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join waitlist');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        company: '',
        jobTitle: '',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
      
      toast({
        title: t('تم التسجيل بنجاح!', 'Successfully Registered!'),
        description: t(
          `أنت رقم ${data.waitlistPosition} في قائمة الانتظار. سنتواصل معك قريباً!`,
          `You are #${data.waitlistPosition} on the waitlist. We'll contact you soon!`
        ),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('خطأ في التسجيل', 'Registration Error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName || !formData.phoneNumber) {
      toast({
        title: t('بيانات مطلوبة', 'Required fields'),
        description: t(
          'يرجى ملء جميع الحقول المطلوبة',
          'Please fill in all required fields'
        ),
        variant: 'destructive',
      });
      return;
    }
    joinWaitlistMutation.mutate(formData);
  };

  return (
    <section id="waitlist" className="py-12 sm:py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center bg-sky/20 text-sky px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <i className="fas fa-rocket ml-2 rtl:ml-0 rtl:mr-2" />
            <span>{t('قريباً', 'Coming Soon')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-4 sm:mb-6 whitespace-pre-line px-2 sm:px-0 leading-snug">
            {t('للحصول على اشتراك مجاني لمدة ٣أشهر   سجل الآن', 'Get 3 Months Free Subscription   Register Now')}
          </h2>

          {/* Countdown Timer */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-custom mb-6 sm:mb-8 max-w-md mx-auto"
          >
            <div className="text-xs sm:text-sm text-gray-400 mb-2 font-arabic-body">
              {t('متبقي على الإطلاق', 'Time until launch')}
            </div>
            <div className="text-xl sm:text-2xl font-space font-bold text-gray-800">
              <span>{countdown.days.toString().padStart(2, '0')}</span>:
              <span>{countdown.hours.toString().padStart(2, '0')}</span>:
              <span>{countdown.minutes.toString().padStart(2, '0')}</span>:
              <span>{countdown.seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 font-arabic-body">
              {t('أيام : ساعات : دقائق : ثوان', 'Days : Hours : Minutes : Seconds')}
            </div>
          </motion.div>
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-custom-hover"
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-arabic-heading-bold text-gray-800">
              {t('انضم إلى قائمة الانتظار', 'Join the Waitlist')}
            </h3>
            <div className="bg-sky text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full">
              <span className="text-xs sm:text-sm font-bold">
                {waitlistCount ? `#${waitlistCount + 1}` : '#1'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                  {t('الاسم الكامل', 'Full Name')} *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base"
                  placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  {t('البريد الإلكتروني', 'Email Address')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base"
                  placeholder={t('example@domain.com', 'example@domain.com')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                  {t('رقم الهاتف', 'Phone Number')} *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base"
                  placeholder={t('+966 50 123 4567', '+966 50 123 4567')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-semibold text-gray-700">
                  {t('الشركة', 'Company')}
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base"
                  placeholder={t('اسم الشركة', 'Company name')}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-700">
                  {t('المسمى الوظيفي', 'Job Title')}
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base"
                  placeholder={t('محامي، مستشار قانوني، إلخ...', 'Lawyer, Legal Advisor, etc...')}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={joinWaitlistMutation.isPending}
              className="w-full bg-sky text-navy px-6 py-3 sm:py-4 rounded-custom font-semibold text-sm sm:text-lg hover:bg-sky/90 transition-all duration-300 shadow-custom-hover disabled:opacity-50"
            >
              {joinWaitlistMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('جاري التسجيل...', 'Registering...')}
                </span>
              ) : (
                <span className="font-arabic-body-bold">
                  {t('انضم إلى قائمة الانتظار مجاناً', 'Join the Waitlist for Free')}
                </span>
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>
                {t(
                  'لو سجلت، يعني أنك موافق على قائمة الانتظار في أن يحصل',
                  'By registering, you agree to our Terms of Service and Privacy Policy'
                )}
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}