import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  HelpCircle, 
  Settings, 
  LogOut,
  Menu,
  ArrowLeft,
  MessageCircle,
  Mail,
  Monitor,
  FileText,
  Shield,
  ChevronRight
} from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profilePicture?: string;
}

interface FAQItem {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export default function Help() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useLocation();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch user data
  const { data: userData, isLoading } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLocation('/');
  };

  const faqItems: FAQItem[] = [
    {
      question: {
        ar: "ما هو ContraMind؟",
        en: "What is ContraMind?"
      },
      answer: {
        ar: "ContraMind هو منصة تقنية قانونية مدعومة بالذكاء الاصطناعي متخصصة في إدارة العقود لمنطقة الشرق الأوسط وشمال أفريقيا. نحن نقدم أدوات متقدمة لتحليل العقود ومراجعتها وإدارتها.",
        en: "ContraMind is an AI-powered legal technology platform specializing in contract management for the MENA region. We provide advanced tools for contract analysis, review, and management."
      }
    },
    {
      question: {
        ar: "كيف يعمل تحليل العقود؟",
        en: "How does contract analysis work?"
      },
      answer: {
        ar: "يستخدم ContraMind الذكاء الاصطناعي المتقدم لتحليل العقود وتحديد المخاطر والفرص والقضايا المحتملة. يتم تقديم التحليل باللغة العربية والإنجليزية مع توصيات قابلة للتنفيذ.",
        en: "ContraMind uses advanced AI to analyze contracts and identify risks, opportunities, and potential issues. Analysis is provided in both Arabic and English with actionable recommendations."
      }
    },
    {
      question: {
        ar: "ما هي الرموز المميزة (Tokens) وكيف تعمل؟",
        en: "What are tokens and how do they work?"
      },
      answer: {
        ar: "الرموز المميزة هي وحدات الاستخدام في ContraMind. كل عملية تحليل عقد أو استفسار يستهلك عدداً معيناً من الرموز. يمكنك شراء المزيد من الرموز حسب احتياجاتك.",
        en: "Tokens are usage units in ContraMind. Each contract analysis or query consumes a certain number of tokens. You can purchase more tokens based on your needs."
      }
    },
    {
      question: {
        ar: "هل يدعم ContraMind اللغة العربية؟",
        en: "Does ContraMind support Arabic language?"
      },
      answer: {
        ar: "نعم، ContraMind مصمم خصيصاً لدعم اللغة العربية والإنجليزية. يمكنك تحليل العقود بكلا اللغتين والحصول على نتائج دقيقة ومفصلة.",
        en: "Yes, ContraMind is specifically designed to support both Arabic and English languages. You can analyze contracts in both languages and receive accurate, detailed results."
      }
    },
    {
      question: {
        ar: "كيف يمكنني البدء في استخدام ContraMind؟",
        en: "How can I get started with ContraMind?"
      },
      answer: {
        ar: "يمكنك البدء بإنشاء حساب مجاني والحصول على رموز مجانية للتجربة. بعد ذلك، يمكنك تحميل عقدك الأول والحصول على تحليل شامل خلال دقائق.",
        en: "You can start by creating a free account and receiving free tokens for trial. After that, you can upload your first contract and get comprehensive analysis within minutes."
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#343541]">
        <div className="text-white">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C2836] flex">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar - GPT Style */}
      <div className={cn(
        "w-[260px] h-screen bg-[#0C2836] flex flex-col fixed z-50 transition-transform duration-300",
        language === 'ar' ? "right-0" : "left-0",
        showMobileSidebar ? "translate-x-0" : language === 'ar' ? "translate-x-full" : "-translate-x-full",
        !showMobileSidebar && "lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-[rgba(183,222,232,0.1)]">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="w-full h-12 object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setLocation('/dashboard')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white", 
              language === 'ar' && "flex-row-reverse")}
          >
            <ArrowLeft className={cn("w-4 h-4 text-[#B7DEE8]", language === 'ar' && "rotate-180")} />
            <span className="text-sm">{t('العودة للوحة التحكم', 'Back to Dashboard')}</span>
          </button>
          
          <button
            onClick={() => setLocation('/settings/personal')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <Settings className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الإعدادات', 'Settings')}</span>
          </button>
        </nav>

        {/* Bottom Items */}
        <div className="p-4 border-t border-[rgba(183,222,232,0.1)] space-y-2">
          <button
            onClick={() => setLocation('/help')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg bg-[rgba(183,222,232,0.1)] text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <HelpCircle className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('المساعدة', 'Help')}</span>
          </button>
          <button
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <LogOut className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('تسجيل الخروج', 'Logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1", language === 'ar' ? "lg:mr-[260px]" : "lg:ml-[260px]")}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#40414F] border-b border-[#565869]">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 hover:bg-[#565869] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-medium">{t('المساعدة', 'Help')}</span>
          <div className="w-9" />
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-4xl mx-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className={cn("mb-8", language === 'ar' && "text-right")}>
              <h1 className="text-2xl font-semibold text-white mb-2">
                {t('مركز المساعدة', 'Help Center')}
              </h1>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">
                {t('الأسئلة الشائعة ومعلومات الدعم', 'Frequently asked questions and support information')}
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setLocation('/help/desktop-app')}
                className={cn("bg-[rgba(255,255,255,0.05)] border border-[rgba(183,222,232,0.1)] rounded-lg p-6 hover:bg-[rgba(183,222,232,0.1)] transition-colors group", language === 'ar' ? "text-right" : "text-left")}
              >
                <div className={cn("flex items-start justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className="flex-1">
                    <Monitor className={cn("w-8 h-8 text-[#B7DEE8] mb-3", language === 'ar' && "mr-auto")} />
                    <h3 className="text-white font-medium text-lg mb-2">
                      {t('تطبيق سطح المكتب', 'Desktop App')}
                    </h3>
                    <p className="text-[rgba(255,255,255,0.6)] text-sm">
                      {t('تحميل ContraMind لنظام macOS و Windows', 'Download ContraMind for macOS and Windows')}
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 text-[#B7DEE8] mt-1 opacity-0 group-hover:opacity-100 transition-opacity", language === 'ar' && "rotate-180")} />
                </div>
              </button>

              <button
                onClick={() => setLocation('/help/release-notes')}
                className={cn("bg-[rgba(255,255,255,0.05)] border border-[rgba(183,222,232,0.1)] rounded-lg p-6 hover:bg-[rgba(183,222,232,0.1)] transition-colors group", language === 'ar' ? "text-right" : "text-left")}
              >
                <div className={cn("flex items-start justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className="flex-1">
                    <FileText className={cn("w-8 h-8 text-[#B7DEE8] mb-3", language === 'ar' && "mr-auto")} />
                    <h3 className="text-white font-medium text-lg mb-2">
                      {t('ملاحظات الإصدار', 'Release Notes')}
                    </h3>
                    <p className="text-[rgba(255,255,255,0.6)] text-sm">
                      {t('تابع آخر التحديثات والميزات الجديدة', 'Keep track of updates and new features')}
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 text-[#B7DEE8] mt-1 opacity-0 group-hover:opacity-100 transition-opacity", language === 'ar' && "rotate-180")} />
                </div>
              </button>

              <button
                onClick={() => setLocation('/help/terms')}
                className={cn("bg-[rgba(255,255,255,0.05)] border border-[rgba(183,222,232,0.1)] rounded-lg p-6 hover:bg-[rgba(183,222,232,0.1)] transition-colors group", language === 'ar' ? "text-right" : "text-left")}
              >
                <div className={cn("flex items-start justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className="flex-1">
                    <Shield className={cn("w-8 h-8 text-[#B7DEE8] mb-3", language === 'ar' && "mr-auto")} />
                    <h3 className="text-white font-medium text-lg mb-2">
                      {t('الشروط والسياسات', 'Terms & Policies')}
                    </h3>
                    <p className="text-[rgba(255,255,255,0.6)] text-sm">
                      {t('شروط الخدمة وسياسات الخصوصية', 'Terms of Service and Privacy Policies')}
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 text-[#B7DEE8] mt-1 opacity-0 group-hover:opacity-100 transition-opacity", language === 'ar' && "rotate-180")} />
                </div>
              </button>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white mb-4 text-center">
                {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
              </h2>
              
              {faqItems.map((item, index) => (
                <div key={index} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(183,222,232,0.1)] rounded-lg p-6 hover:bg-[rgba(183,222,232,0.1)] transition-colors text-center">
                  <h3 className="text-white font-medium mb-3 text-base">
                    {language === 'ar' ? item.question.ar : item.question.en}
                  </h3>
                  <p className="text-[rgba(255,255,255,0.7)] text-sm leading-relaxed">
                    {language === 'ar' ? item.answer.ar : item.answer.en}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="bg-[rgba(183,222,232,0.1)] rounded-lg p-6 mt-8 border border-[rgba(183,222,232,0.2)] text-center">
              <h2 className="text-[#B7DEE8] text-xl font-medium mb-4">
                {t('تحتاج إلى مساعدة إضافية؟', 'Need Additional Help?')}
              </h2>
              <p className="text-[rgba(255,255,255,0.7)] text-sm mb-4">
                {t('تواصل مع فريق الدعم لدينا للحصول على المساعدة المباشرة', 'Contact our support team for direct assistance')}
              </p>
              <div className="flex items-center gap-2 text-[#B7DEE8] justify-center">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Ceo@contramind.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}