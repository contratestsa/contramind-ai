import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LanguageManager } from '@/components/SimpleLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PartyPopper } from 'lucide-react';

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
  const t = LanguageManager.t;
  const language = LanguageManager.getLanguage();
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
    onSuccess: (data, variables) => {
      const userName = variables.fullName;
      
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
      
      toast({
        title: t('تم التسجيل بنجاح!', 'Registration Confirmed'),
        description: t(
          `مرحباً ${userName}، أنت رقم ${data.entry?.id || data.waitlistPosition} في قائمة الانتظار لمنصة ContraMind AI. سيتم التواصل معك قريباً مع تحديثات حصرية حول الإطلاق.`,
          `Welcome ${userName}! You are number ${data.entry?.id || data.waitlistPosition} on the ContraMind AI waitlist. You'll receive exclusive updates about our launch soon.`
        ),
      });
      
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        company: '',
        jobTitle: '',
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-[#0f0f0f]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center bg-sky/20 text-sky px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <i className="fas fa-rocket ml-2 rtl:ml-0 rtl:mr-2" />
            <span className="text-[40px]">{t('قريباً', 'Coming Soon')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-4 sm:mb-6 whitespace-pre-line px-2 sm:px-0 leading-snug">
            {t('للحصول على اشتراك مجاني لمدة ٣أشهر   سجل الآن', 'Get 3 Months Free Subscription   Register Now')}
          </h2>
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-custom-hover text-[#141414]"
        >


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
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base bg-[#f0f3f5]"
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
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base bg-[#f0f3f5]"
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
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base bg-[#f0f3f5]"
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
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base bg-[#f0f3f5]"
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
                  className="w-full border-gray-300 focus:border-sky focus:ring-sky text-sm sm:text-base bg-[#f0f3f5]"
                  placeholder={t('محامي، مستشار قانوني، إلخ...', 'Lawyer, Legal Advisor, etc...')}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={joinWaitlistMutation.isPending}
              className="w-full px-6 py-3 sm:py-4 rounded-custom font-semibold text-sm sm:text-lg hover:bg-sky/90 transition-all duration-300 shadow-custom-hover disabled:opacity-50 bg-[#0c2836] text-[#e6f0f5]"
            >
              {joinWaitlistMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('جاري التسجيل...', 'Registering...')}
                </span>
              ) : (
                <span className="font-arabic-body-bold">
                  {t('سجل الآن', 'Register Now')}
                </span>
              )}
            </Button>

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">
                {t(
                  'لن تشارك بريدك الإلكتروني أبداً، يمكنك الغاء الاشتراك في أي وقت. ',
                  'We\'ll never share your email. Unsubscribe anytime.'
                )}
              </p>
              <div className="bg-[#e6f0f5] text-[#0c2836] px-3 py-1 rounded-full">
                <span className="text-xs font-bold flex items-center gap-1 text-[#a0d7eb]">
                  <PartyPopper className="w-3 h-3" />
                  {t(`محترف انضم اليوم ${waitlistCount || 0}`, `Professional joined today ${waitlistCount || 0}`)}
                </span>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}