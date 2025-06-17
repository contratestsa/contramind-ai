import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
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
  const { t, language } = useSimpleLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<WaitlistData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: waitlistCount } = useQuery({
    queryKey: ['/api/waitlist/count'],
    staleTime: 30000,
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: async (data: WaitlistData) => {
      const response = await apiRequest('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: t('تم التسجيل بنجاح!', 'Successfully registered!'),
        description: t(
          'شكراً لانضمامك إلى قائمة الانتظار. سنتواصل معك قريباً.',
          'Thank you for joining our waitlist. We\'ll be in touch soon.'
        ),
      });
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        company: '',
        jobTitle: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
    },
    onError: (error: any) => {
      toast({
        title: t('خطأ في التسجيل', 'Registration Error'),
        description: t(
          'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.',
          'An error occurred during registration. Please try again.'
        ),
        variant: 'destructive',
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('الاسم مطلوب', 'Name is required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('البريد الإلكتروني مطلوب', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('البريد الإلكتروني غير صحيح', 'Invalid email format');
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('رقم الهاتف مطلوب', 'Phone number is required');
    }

    if (!formData.company.trim()) {
      newErrors.company = t('اسم الشركة مطلوب', 'Company name is required');
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = t('المسمى الوظيفي مطلوب', 'Job title is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t('يرجى ملء جميع الحقول', 'Please fill all fields'),
        description: t('تأكد من إدخال جميع المعلومات المطلوبة', 'Make sure to enter all required information'),
        variant: 'destructive',
      });
      return;
    }
    joinWaitlistMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof WaitlistData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="waitlist" className="py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-sky/20 text-sky px-4 py-2 rounded-full text-sm font-medium mb-6">
            <i className="fas fa-rocket ml-2 rtl:ml-0 rtl:mr-2" />
            <span>{t('قريباً', 'Coming Soon')}</span>
          </div>

          <h2 className="lg:text-5xl font-arabic-heading-bold text-white mb-6 whitespace-pre-line text-[25px]">
            {t('للحصول على اشتراك مجاني لمدة 3 أشهر\nانضم إلى قائمة الانتظار', 'Get 3 Months Free\nJoin Our Waitlist')}
          </h2>

          <p className="text-xl text-gray-300 font-arabic-body max-w-2xl mx-auto">
            {t(
              'كن من أوائل المستخدمين واحصل على وصول مبكر مع ثلاثة أشهر مجانية عند الإطلاق',
              'Be among the first users and get early access with three months free at launch'
            )}
          </p>

          {waitlistCount && (
            <div className="mt-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky mb-2">
                  {waitlistCount.count.toLocaleString()}
                </div>
                <p className="text-gray-400 font-arabic-body">
                  {t('شخص في قائمة الانتظار', 'people on waitlist')}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-8 lg:p-12 border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-white font-arabic-body mb-2 block">
                  {t('الاسم الكامل', 'Full Name')} *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-sky focus:ring-sky ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-white font-arabic-body mb-2 block">
                  {t('البريد الإلكتروني', 'Email Address')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-sky focus:ring-sky ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email address')}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-white font-arabic-body mb-2 block">
                  {t('رقم الهاتف', 'Phone Number')} *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-sky focus:ring-sky ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder={t('أدخل رقم هاتفك', 'Enter your phone number')}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Company */}
              <div>
                <Label htmlFor="company" className="text-white font-arabic-body mb-2 block">
                  {t('الشركة', 'Company')} *
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-sky focus:ring-sky ${errors.company ? 'border-red-500' : ''}`}
                  placeholder={t('أدخل اسم شركتك', 'Enter your company name')}
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>

              {/* Job Title */}
              <div className="md:col-span-2">
                <Label htmlFor="jobTitle" className="text-white font-arabic-body mb-2 block">
                  {t('المسمى الوظيفي', 'Job Title')} *
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-sky focus:ring-sky ${errors.jobTitle ? 'border-red-500' : ''}`}
                  placeholder={t('أدخل مسماك الوظيفي', 'Enter your job title')}
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={joinWaitlistMutation.isPending}
                className="bg-sky hover:bg-sky/90 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-custom hover:shadow-custom-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joinWaitlistMutation.isPending ? (
                  <div className="flex items-center">
                    <i className="fas fa-spinner fa-spin ml-2 rtl:ml-0 rtl:mr-2" />
                    <span>{t('جارٍ التسجيل...', 'Joining...')}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{t('انضم إلى قائمة الانتظار', 'Join Waitlist')}</span>
                    <i className="fas fa-arrow-left ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                  </div>
                )}
              </Button>
            </div>

            <p className="text-gray-400 text-sm text-center font-arabic-body">
              {t(
                'بالانضمام إلى قائمة الانتظار، فإنك توافق على شروط الاستخدام وسياسة الخصوصية',
                'By joining the waitlist, you agree to our Terms of Service and Privacy Policy'
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}