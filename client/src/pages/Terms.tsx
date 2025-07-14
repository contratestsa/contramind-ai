import { useLocation } from "wouter";
import { ArrowLeft, FileText, Shield, Cookie } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Terms() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const isRTL = language === 'ar';
  const [activeSection, setActiveSection] = useState('terms');
  const [showAcceptanceBanner, setShowAcceptanceBanner] = useState(false);

  // Sections for sticky TOC
  const sections = [
    { id: 'terms', label: t('شروط الخدمة', 'Terms of Service'), icon: FileText },
    { id: 'privacy', label: t('سياسة الخصوصية', 'Privacy Policy'), icon: Shield },
    { id: 'cookie', label: t('سياسة ملفات تعريف الارتباط', 'Cookie Policy'), icon: Cookie }
  ];

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setLocation('/dashboard')}
              className={cn(
                "flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",
                isRTL && "flex-row-reverse"
              )}
            >
              <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
              <span>{t('المساعدة', 'Help')} › {t('الشروط والسياسات', 'Terms & Policies')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Acceptance Banner */}
      {showAcceptanceBanner && (
        <div className="bg-[#B7DEE8]/20 border-b border-[#B7DEE8]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <p className="text-sm text-gray-700">
                {t('بالاستمرار، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا', 
                   'By continuing, you agree to our Terms of Service and Privacy Policy')}
              </p>
              <button
                onClick={() => setShowAcceptanceBanner(false)}
                className="ml-4 px-4 py-2 bg-[#0C2836] text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
              >
                {t('موافق', 'Accept')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={cn(
          "flex gap-8",
          isRTL && "flex-row-reverse"
        )}>
          {/* Sticky TOC */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {t('التنقل', 'Navigation')}
              </h3>
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        activeSection === section.id
                          ? "bg-[#B7DEE8]/20 text-[#0C2836] font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                        isRTL && "flex-row-reverse text-right"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {t('الشروط والسياسات', 'Terms & Policies')}
            </h1>

            {/* Terms of Service */}
            <section id="terms" className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#0C2836]" />
                {t('شروط الخدمة', 'Terms of Service')}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {t('تاريخ السريان: 1 يوليو 2025', 'Effective Date: July 1, 2025')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('1. قبول الشروط', '1. Acceptance of Terms')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('باستخدام منصة ContraMind، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.',
                     'By using the ContraMind platform, you agree to be bound by these terms. If you do not agree to these terms, please do not use our services.')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('2. وصف الخدمة', '2. Description of Service')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('ContraMind هي منصة قانونية مدعومة بالذكاء الاصطناعي تقدم خدمات تحليل العقود وإدارة المستندات القانونية للمنطقة العربية.',
                     'ContraMind is an AI-powered legal platform offering contract analysis and legal document management services for the MENA region.')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('3. حسابات المستخدمين', '3. User Accounts')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('أنت مسؤول عن الحفاظ على سرية معلومات حسابك وعن جميع الأنشطة التي تحدث تحت حسابك.',
                     'You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.')}
                </p>
              </div>
            </section>

            {/* Privacy Policy */}
            <section id="privacy" className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#0C2836]" />
                {t('سياسة الخصوصية', 'Privacy Policy')}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {t('تاريخ آخر تحديث: 1 يوليو 2025', 'Last Updated: July 1, 2025')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('1. المعلومات التي نجمعها', '1. Information We Collect')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو استخدام خدماتنا. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني ومعلومات الاتصال الأخرى.',
                     'We collect information you provide directly to us, such as when you create an account or use our services. This may include your name, email address, and other contact information.')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('2. كيف نستخدم معلوماتك', '2. How We Use Your Information')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('نستخدم المعلومات التي نجمعها لتوفير خدماتنا وتحسينها، وللتواصل معك، ولأغراض الأمان ومنع الاحتيال.',
                     'We use the information we collect to provide and improve our services, to communicate with you, and for security and fraud prevention purposes.')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('3. مشاركة المعلومات', '3. Information Sharing')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراضها التسويقية.',
                     'We do not sell, rent, or share your personal information with third parties for their marketing purposes.')}
                </p>
              </div>
            </section>

            {/* Cookie Policy */}
            <section id="cookie" className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-[#0C2836]" />
                {t('سياسة ملفات تعريف الارتباط', 'Cookie Policy')}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {t('تاريخ السريان: 1 يوليو 2025', 'Effective Date: July 1, 2025')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('1. ما هي ملفات تعريف الارتباط', '1. What Are Cookies')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم وضعها على جهازك عند زيارة موقعنا الإلكتروني.',
                     'Cookies are small text files that are placed on your device when you visit our website.')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('2. كيف نستخدم ملفات تعريف الارتباط', '2. How We Use Cookies')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا، ولتذكر تفضيلاتك، ولأغراض التحليل.',
                     'We use cookies to enhance your experience on our site, to remember your preferences, and for analytics purposes.')}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
                  {t('3. إدارة ملفات تعريف الارتباط', '3. Managing Cookies')}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t('يمكنك التحكم في ملفات تعريف الارتباط وحذفها من خلال إعدادات متصفحك. ومع ذلك، قد يؤثر تعطيل ملفات تعريف الارتباط على وظائف موقعنا.',
                     'You can control and delete cookies through your browser settings. However, disabling cookies may affect the functionality of our site.')}
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}