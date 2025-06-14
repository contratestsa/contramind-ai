import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface WaitlistData {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
}

export default function Waitlist() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<WaitlistData>({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
  });

  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: async (data: WaitlistData) => {
      const response = await apiRequest('POST', '/api/waitlist', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم الانضمام بنجاح!', 'Successfully joined!'),
        description: t(
          'شكراً لانضمامك! سنتواصل معك قريباً.',
          'Thank you for joining! We\'ll be in touch soon.'
        ),
      });
      setFormData({
        fullName: '',
        email: '',
        company: '',
        jobTitle: '',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
    },
    onError: () => {
      toast({
        title: t('حدث خطأ', 'Error occurred'),
        description: t(
          'حدث خطأ أثناء الانضمام. يرجى المحاولة مرة أخرى.',
          'An error occurred while joining. Please try again.'
        ),
        variant: 'destructive',
      });
    },
  });

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
    if (!formData.email || !formData.fullName) {
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

  const jobTitleOptions = [
    { ar: 'محامي', en: 'Legal Counsel' },
    { ar: 'مدير قانوني', en: 'Legal Manager' },
    { ar: 'مدير عام', en: 'General Manager' },
    { ar: 'أخرى', en: 'Other' },
  ];

  return (
    <section id="waitlist" className="py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-sky/20 text-sky px-4 py-2 rounded-full text-sm font-medium mb-6">
            <i className="fas fa-rocket ml-2 rtl:ml-0 rtl:mr-2" />
            <span>{t('قريباً', 'Coming Soon')}</span>
          </div>

          <h2 className="lg:text-5xl font-arabic-heading-bold text-white mb-6 whitespace-pre-line text-[25px]">
            {t('للحصول على الاشتراك مجاني لمدة ٣ أشهر\nسجل الآن', 'Get 3 Months Free Subscription\nRegister Now')}
          </h2>



          {/* Countdown Timer */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-custom mb-8 max-w-md mx-auto"
          >
            <div className="text-sm text-gray-400 mb-2 font-arabic-body">
              {t('متبقي على الإطلاق', 'Time until launch')}
            </div>
            <div className="text-2xl font-space font-bold text-gray-800">
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
          className="bg-white rounded-2xl p-8 lg:p-12 shadow-custom-hover"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-white mb-2">
                  {t('الاسم الكامل', 'Full Name')} *
                </Label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t('اسمك الكامل', 'Your full name')}
                  className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
                  required
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-white mb-2">
                  {t('البريد الإلكتروني', 'Email Address')} *
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@company.com"
                  className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-white mb-2">
                {t('اسم الشركة', 'Company Name')}
              </Label>
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={t('شركتك', 'Your company')}
                className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-white mb-2">
                {t('المنصب', 'Job Title')}
              </Label>
              <Select value={formData.jobTitle} onValueChange={(value) => setFormData({ ...formData, jobTitle: value })}>
                <SelectTrigger className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors">
                  <SelectValue placeholder={t('اختر منصبك', 'Select your role')} />
                </SelectTrigger>
                <SelectContent>
                  {jobTitleOptions.map((option, index) => (
                    <SelectItem key={index} value={t(option.ar, option.en)}>
                      {t(option.ar, option.en)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={joinWaitlistMutation.isPending}
              className="w-full bg-navy text-white py-4 px-6 rounded-custom font-semibold text-lg hover:bg-navy/90 transition-all duration-300 shadow-custom hover:shadow-custom-hover"
            >
              {joinWaitlistMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2 rtl:mr-0 rtl:ml-2" />
              ) : (
                <>
                  <span>
                    {t('سجّل الآن', 'Register Now')}
                  </span>
                </>
              )}
            </Button>
          </form>

          {/* Privacy & Stats */}
          <div className="mt-8 pt-6 border-t border-grey/50">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-400">
                {t(
                  'لن نشارك بريدك الإلكتروني أبداً. إلغاء الاشتراك في أي وقت.',
                  "We'll never share your email. Unsubscribe anytime."
                )}
              </p>
              <div className="flex items-center text-sm text-sky font-medium">
                <i className="fas fa-users ml-2 rtl:ml-0 rtl:mr-2" />
                <span>
                  {t('🎉 217 محترف انضم اليوم', '🎉 217 professionals joined today')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
