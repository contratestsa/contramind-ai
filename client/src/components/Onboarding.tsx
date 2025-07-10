import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (3)_1752052096349.png';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [companyNameEn, setCompanyNameEn] = useState('');
  const [companyNameAr, setCompanyNameAr] = useState('');
  const [country, setCountry] = useState('saudi-arabia');
  const [contractRole, setContractRole] = useState<string>('');

  const completeOnboarding = useMutation({
    mutationFn: async (data: { 
      companyNameEn: string; 
      companyNameAr?: string; 
      country: string; 
      contractRole: string;
    }) => {
      return apiRequest('/api/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setCurrentStep(4);
    },
    onError: () => {
      toast({
        title: t('خطأ', 'Error'),
        description: t('حدث خطأ في حفظ البيانات', 'Failed to save onboarding data'),
        variant: 'destructive'
      });
    }
  });

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!companyNameEn.trim()) {
        toast({
          title: t('خطأ', 'Error'),
          description: t('الرجاء إدخال اسم الشركة بالإنجليزية', 'Please enter company name in English'),
          variant: 'destructive'
        });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!contractRole) {
        toast({
          title: t('خطأ', 'Error'),
          description: t('الرجاء اختيار دورك', 'Please select your role'),
          variant: 'destructive'
        });
        return;
      }
      completeOnboarding.mutate({
        companyNameEn,
        companyNameAr: companyNameAr || undefined,
        country,
        contractRole
      });
    } else if (currentStep === 4) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="w-full max-w-[500px] px-8">
        {/* Step 1 - Welcome */}
        {currentStep === 1 && (
          <div className="text-center">
            <img 
              src={logoImage} 
              alt="ContraMind Logo" 
              className="h-16 mx-auto mb-8 object-contain"
            />
            <h1 className="text-2xl font-semibold text-[#0C2836] mb-4">
              {t('مرحباً بك في ContraMind!', 'Welcome to ContraMind!')}
            </h1>
            <p className="text-base text-gray-600 mb-8">
              {t('دعنا نبدأ في دقيقتين', "Let's get you started in 2 minutes")}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-[#0a1f2a] transition-colors font-medium"
            >
              {t('ابدأ', 'Get Started')}
            </button>
          </div>
        )}

        {/* Step 2 - Company Info */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-[#0C2836] mb-6 text-center">
              {t('أخبرنا عن شركتك', 'Tell us about your company')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL && "text-right")}>
                  {t('اسم الشركة (بالإنجليزية) *', 'Company Name (English) *')}
                </label>
                <input
                  type="text"
                  value={companyNameEn}
                  onChange={(e) => setCompanyNameEn(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0C2836] text-gray-900 placeholder-gray-400",
                    isRTL && "text-right"
                  )}
                  placeholder={t('ادخل اسم الشركة', 'Enter company name')}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL && "text-right")}>
                  {t('اسم الشركة (بالعربية)', 'Company Name (Arabic)')}
                </label>
                <input
                  type="text"
                  value={companyNameAr}
                  onChange={(e) => setCompanyNameAr(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0C2836] text-gray-900 placeholder-gray-400",
                    "text-right"
                  )}
                  placeholder={t('ادخل اسم الشركة', 'Enter company name')}
                  dir="rtl"
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL && "text-right")}>
                  {t('البلد', 'Country')}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0C2836] text-gray-900",
                    isRTL && "text-right"
                  )}
                >
                  <option value="saudi-arabia">{t('المملكة العربية السعودية', 'Saudi Arabia')}</option>
                  <option value="uae">{t('الإمارات العربية المتحدة', 'United Arab Emirates')}</option>
                  <option value="egypt">{t('مصر', 'Egypt')}</option>
                  <option value="jordan">{t('الأردن', 'Jordan')}</option>
                  <option value="kuwait">{t('الكويت', 'Kuwait')}</option>
                  <option value="qatar">{t('قطر', 'Qatar')}</option>
                  <option value="bahrain">{t('البحرين', 'Bahrain')}</option>
                  <option value="oman">{t('عُمان', 'Oman')}</option>
                  <option value="other">{t('أخرى', 'Other')}</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-6 px-8 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-[#0a1f2a] transition-colors font-medium"
            >
              {t('التالي', 'Next')}
            </button>
          </div>
        )}

        {/* Step 3 - Role Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-[#0C2836] mb-6 text-center">
              {t('ما هو دورك في العقود؟', "What's your role in contracts?")}
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setContractRole('buyer')}
                className={cn(
                  "w-full p-6 border-2 rounded-lg transition-all",
                  contractRole === 'buyer' 
                    ? "border-[#0C2836] bg-[#f0f8ff]" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <h3 className="text-lg font-medium text-[#0C2836] mb-2">
                  {t('أشتري الخدمات (عميل)', 'I buy services (Client)')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('أراجع العقود كمتلقي للخدمات', 'I review contracts as a service recipient')}
                </p>
              </button>

              <button
                onClick={() => setContractRole('vendor')}
                className={cn(
                  "w-full p-6 border-2 rounded-lg transition-all",
                  contractRole === 'vendor' 
                    ? "border-[#0C2836] bg-[#f0f8ff]" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <h3 className="text-lg font-medium text-[#0C2836] mb-2">
                  {t('أبيع الخدمات (مورد)', 'I sell services (Vendor)')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('أراجع العقود كمقدم للخدمات', 'I review contracts as a service provider')}
                </p>
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={!contractRole || completeOnboarding.isPending}
              className="w-full mt-6 px-8 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-[#0a1f2a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completeOnboarding.isPending ? t('جاري الحفظ...', 'Saving...') : t('إكمال الإعداد', 'Complete Setup')}
            </button>
          </div>
        )}

        {/* Step 4 - Completion */}
        {currentStep === 4 && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-[#0C2836] mb-4">
              {t('اكتمل الإعداد!', 'Setup Complete!')}
            </h2>
            <p className="text-base text-gray-600 mb-2">
              {t('لقد حصلت على 1000 رمز', "You've received 1000 tokens")}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              {t('يمكنك الآن البدء في تحليل العقود', 'You can now start analyzing contracts')}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-[#0a1f2a] transition-colors font-medium"
            >
              {t('ابدأ استخدام ContraMind', 'Start Using ContraMind')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}