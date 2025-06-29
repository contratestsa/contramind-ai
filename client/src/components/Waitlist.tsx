import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { insertWaitlistSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface WaitlistData {
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  jobTitle: string;
}

export default function Waitlist() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WaitlistData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Count query
  const { data: waitlistCount } = useQuery({
    queryKey: ['/api/waitlist/count'],
    refetchInterval: 5000,
  });

  // Mutation for waitlist registration
  const mutation = useMutation({
    mutationFn: async (data: WaitlistData) => {
      const response = await apiRequest('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      // Show success message with position
      toast({
        title: t('تم التسجيل بنجاح!', 'Successfully Registered!'),
        description: t(
          `مرحباً ${formData.fullName}! أنت المشترك رقم ${data.position} في قائمة الانتظار`,
          `Welcome ${formData.fullName}! You are subscriber #${data.position} on the waitlist`
        ),
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        company: '',
        jobTitle: '',
      });
      
      // Invalidate count query to update the counter
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('خطأ في التسجيل', 'Registration Error'),
        description: error.message,
      });
    },
  });

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('2025-07-18T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field: keyof WaitlistData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast({
        variant: 'destructive',
        title: t('خطأ في البيانات', 'Data Error'),
        description: t('يرجى ملء جميع الحقول المطلوبة', 'Please fill in all required fields'),
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: 'destructive',
        title: t('خطأ في البريد الإلكتروني', 'Email Error'),
        description: t('يرجى إدخال بريد إلكتروني صحيح', 'Please enter a valid email address'),
      });
      return;
    }

    mutation.mutate(formData);
  };

  const jobTitles = [
    { value: 'lawyer', ar: 'محامي', en: 'Lawyer' },
    { value: 'legal_counsel', ar: 'مستشار قانوني', en: 'Legal Counsel' },
    { value: 'paralegal', ar: 'مساعد قانوني', en: 'Paralegal' },
    { value: 'contract_manager', ar: 'مدير عقود', en: 'Contract Manager' },
    { value: 'legal_assistant', ar: 'مساعد قانوني', en: 'Legal Assistant' },
    { value: 'compliance_officer', ar: 'مسؤول امتثال', en: 'Compliance Officer' },
    { value: 'business_owner', ar: 'صاحب عمل', en: 'Business Owner' },
    { value: 'entrepreneur', ar: 'رائد أعمال', en: 'Entrepreneur' },
    { value: 'other', ar: 'أخرى', en: 'Other' },
  ];

  return (
    <section id="waitlist" className="py-12 sm:py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-[#0f0f0f]">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center bg-sky/20 text-sky px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <i className="fas fa-rocket ml-2 rtl:ml-0 rtl:mr-2" />
            <span>{t('قريباً', 'Coming Soon')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-4 sm:mb-6 whitespace-pre-line px-2 sm:px-0 leading-snug">
            {t('للحصول على اشتراك مجاني لمدة ٣أشهر   سجل الآن', 'Get 3 Months Free Subscription   Register Now')}
          </h2>

          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4 font-arabic-body">
              {t('الوقت المتبقي للإطلاق', 'Time Left Until Launch')}
            </p>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
              {[
                { value: timeLeft.days, label: { ar: 'يوم', en: 'Day' } },
                { value: timeLeft.hours, label: { ar: 'ساعة', en: 'Hour' } },
                { value: timeLeft.minutes, label: { ar: 'دقيقة', en: 'Min' } },
                { value: timeLeft.seconds, label: { ar: 'ثانية', en: 'Sec' } },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-sky/20 rounded-lg p-2 sm:p-3 mb-1 sm:mb-2">
                    <span className="text-lg sm:text-2xl font-bold text-sky">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-white/70 font-arabic-body">
                    {item.label.ar}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist Counter */}
          <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-sky text-sm sm:text-base font-medium mb-1 sm:mb-2">
              {t('انضم إلى', 'Join')}{' '}
              <span className="text-lg sm:text-xl font-bold">
                {waitlistCount?.count || 109}+
              </span>{' '}
              {t('محترف قانوني', 'Legal Professionals')}
            </p>
            <p className="text-white/60 text-xs sm:text-sm">
              {t('في انتظار ContraMind', 'Waiting for ContraMind')}
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-custom max-w-2xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-arabic-heading-bold text-navy mb-2 sm:mb-3">
              {t('احجز مكانك المجاني', 'Reserve Your Free Spot')}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base font-arabic-body">
              {t('اشتراك مجاني لمدة 3 أشهر للمشتركين الأوائل', '3 Months Free for Early Subscribers')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-navy font-semibold text-sm sm:text-base">
                {t('الاسم الكامل', 'Full Name')} *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="mt-1 sm:mt-2 text-sm sm:text-base py-2 sm:py-3"
                placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-navy font-semibold text-sm sm:text-base">
                {t('البريد الإلكتروني', 'Email Address')} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1 sm:mt-2 text-sm sm:text-base py-2 sm:py-3"
                placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email address')}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber" className="text-navy font-semibold text-sm sm:text-base">
                {t('رقم الهاتف', 'Phone Number')} *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="mt-1 sm:mt-2 text-sm sm:text-base py-2 sm:py-3"
                placeholder={t('أدخل رقم هاتفك', 'Enter your phone number')}
                required
              />
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company" className="text-navy font-semibold text-sm sm:text-base">
                {t('الشركة / المؤسسة', 'Company / Organization')}
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="mt-1 sm:mt-2 text-sm sm:text-base py-2 sm:py-3"
                placeholder={t('أدخل اسم شركتك أو مؤسستك', 'Enter your company or organization')}
              />
            </div>

            {/* Job Title */}
            <div>
              <Label htmlFor="jobTitle" className="text-navy font-semibold text-sm sm:text-base">
                {t('المسمى الوظيفي', 'Job Title')}
              </Label>
              <Select value={formData.jobTitle} onValueChange={(value) => handleInputChange('jobTitle', value)}>
                <SelectTrigger className="mt-1 sm:mt-2 text-sm sm:text-base py-2 sm:py-3">
                  <SelectValue placeholder={t('اختر مسماك الوظيفي', 'Select your job title')} />
                </SelectTrigger>
                <SelectContent>
                  {jobTitles.map((title) => (
                    <SelectItem key={title.value} value={title.value}>
                      {title.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-navy hover:bg-navy/90 text-white py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg"
            >
              {mutation.isPending 
                ? t('جاري التسجيل...', 'Registering...')
                : t('احجز مكانك المجاني', 'Reserve Free Spot')
              }
            </Button>

            {/* Privacy Note */}
            <p className="text-center text-xs sm:text-sm text-gray-500 font-arabic-body">
              {t(
                'لن نشارك بياناتك مع أي جهة. يمكنك إلغاء الاشتراك في أي وقت.',
                "We'll never share your data. You can unsubscribe anytime."
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}