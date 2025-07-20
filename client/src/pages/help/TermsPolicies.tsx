import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { FileText, Shield, Cookie, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type Section = 'terms' | 'privacy' | 'cookie';

export default function TermsPolicies() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [activeSection, setActiveSection] = useState<Section>('terms');

  const pageVariants = {
    initial: { opacity: 0, x: isRTL ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 20 : -20 }
  };

  const sections = [
    {
      id: 'terms',
      icon: FileText,
      title: { ar: 'شروط الخدمة', en: 'Terms of Service' },
      content: {
        ar: `هذه هي شروط الخدمة لمنصة ContraMind. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط.

1. قبول الشروط
بدخولك أو استخدامك لخدمات ContraMind، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجوز لك استخدام خدماتنا.

2. وصف الخدمة
ContraMind هي منصة تحليل العقود القانونية المدعومة بالذكاء الاصطناعي، مصممة خصيصاً لمنطقة الشرق الأوسط وشمال أفريقيا.

3. حساب المستخدم
أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور وتقييد الوصول إلى جهاز الكمبيوتر الخاص بك.

4. الخصوصية والبيانات
نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا.

5. حقوق الملكية الفكرية
جميع المحتويات والعلامات التجارية والملكية الفكرية الأخرى على منصتنا هي ملك لـ ContraMind.`,
        en: `These are the Terms of Service for the ContraMind platform. By using our services, you agree to be bound by these terms.

1. Acceptance of Terms
By accessing or using ContraMind services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access our services.

2. Description of Service
ContraMind is an AI-powered legal contract analysis platform specifically designed for the MENA region.

3. User Account
You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.

4. Privacy and Data
We respect your privacy and are committed to protecting your personal data in accordance with our Privacy Policy.

5. Intellectual Property Rights
All content, trademarks, and other intellectual property on our platform are the property of ContraMind.`
      }
    },
    {
      id: 'privacy',
      icon: Shield,
      title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
      content: {
        ar: `سياسة الخصوصية هذه توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصة ContraMind.

1. المعلومات التي نجمعها
نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو تحميل عقد للتحليل.

2. كيف نستخدم معلوماتك
نستخدم المعلومات التي نجمعها لتوفير وتحسين خدماتنا، ولتخصيص تجربتك، وللتواصل معك.

3. مشاركة المعلومات
نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض التسويق.

4. أمان البيانات
نطبق تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.

5. حقوقك
لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها وحذفها، وكذلك الحق في الاعتراض على معالجة بياناتك.`,
        en: `This Privacy Policy explains how we collect, use, and protect your information when you use the ContraMind platform.

1. Information We Collect
We collect information you provide directly to us, such as when you create an account or upload a contract for analysis.

2. How We Use Your Information
We use the information we collect to provide and improve our services, to personalize your experience, and to communicate with you.

3. Information Sharing
We do not sell, rent, or share your personal information with third parties for marketing purposes.

4. Data Security
We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.

5. Your Rights
You have the right to access, correct, and delete your personal information, as well as the right to object to the processing of your data.`
      }
    },
    {
      id: 'cookie',
      icon: Cookie,
      title: { ar: 'سياسة ملفات تعريف الارتباط', en: 'Cookie Policy' },
      content: {
        ar: `تشرح هذه السياسة كيفية استخدام ContraMind لملفات تعريف الارتباط والتقنيات المماثلة.

1. ما هي ملفات تعريف الارتباط؟
ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقع ويب.

2. كيف نستخدم ملفات تعريف الارتباط
نستخدم ملفات تعريف الارتباط لتحسين تجربتك، وتذكر تفضيلاتك، وفهم كيفية استخدامك لمنصتنا.

3. أنواع ملفات تعريف الارتباط التي نستخدمها
- ملفات تعريف الارتباط الضرورية: مطلوبة لتشغيل الموقع
- ملفات تعريف الارتباط الوظيفية: تتذكر تفضيلاتك
- ملفات تعريف الارتباط التحليلية: تساعدنا على فهم كيفية استخدامك للموقع

4. إدارة ملفات تعريف الارتباط
يمكنك التحكم في ملفات تعريف الارتباط وحذفها من خلال إعدادات متصفحك.

5. التحديثات على هذه السياسة
قد نقوم بتحديث سياسة ملفات تعريف الارتباط هذه من وقت لآخر لتعكس التغييرات في ممارساتنا.`,
        en: `This policy explains how ContraMind uses cookies and similar technologies.

1. What Are Cookies?
Cookies are small text files that are stored on your device when you visit a website.

2. How We Use Cookies
We use cookies to improve your experience, remember your preferences, and understand how you use our platform.

3. Types of Cookies We Use
- Essential cookies: Required for the site to function
- Functional cookies: Remember your preferences
- Analytics cookies: Help us understand how you use the site

4. Managing Cookies
You can control and delete cookies through your browser settings.

5. Updates to This Policy
We may update this Cookie Policy from time to time to reflect changes in our practices.`
      }
    }
  ];

  const scrollToSection = (sectionId: Section) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id as Section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-[#0C2836]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.15 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className={cn("flex items-center space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
            <li>
              <Link href="/help" className="text-[#B7DEE8] hover:text-white transition-colors duration-150">
                {t('المساعدة', 'Help')}
              </Link>
            </li>
            <li className="text-[#B7DEE8]/60">›</li>
            <li className="text-white">
              {t('الشروط والسياسات', 'Terms & Policies')}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sticky Table of Contents */}
          <motion.aside
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <h2 className={cn("text-lg font-semibold text-white mb-4", isRTL && "text-right")}>
                {t('المحتويات', 'Contents')}
              </h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id as Section)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg transition-all duration-150 flex items-center gap-3",
                            isRTL && "text-right flex-row-reverse",
                            activeSection === section.id
                              ? "bg-[#B7DEE8]/20 text-white border-l-4 border-[#B7DEE8]"
                              : "text-[#B7DEE8]/60 hover:text-white hover:bg-white/5"
                          )}
                          style={isRTL ? { borderRight: activeSection === section.id ? '4px solid #B7DEE8' : 'none', borderLeft: 'none' } : {}}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{section.title[language]}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.15 }}
            className="lg:col-span-3"
          >
            {/* Acceptance Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.15 }}
              className="bg-[#B7DEE8]/10 border border-[#B7DEE8]/20 rounded-lg p-6 mb-8"
            >
              <p className={cn("text-white/90", isRTL && "text-right")}>
                {t(
                  'بمتابعة استخدام ContraMind، فإنك توافق على شروط الخدمة وسياسة الخصوصية وسياسة ملفات تعريف الارتباط.',
                  'By continuing to use ContraMind, you agree to our Terms of Service, Privacy Policy, and Cookie Policy.'
                )}
              </p>
            </motion.div>

            {/* Sections */}
            <div className="space-y-16">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.15 }}
                    className="scroll-mt-24"
                  >
                    <div className={cn("flex items-center gap-4 mb-6", isRTL && "flex-row-reverse")}>
                      <Icon className="w-8 h-8 text-[#B7DEE8]" />
                      <h2 className="text-3xl font-bold text-white">
                        {section.title[language]}
                      </h2>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-[#B7DEE8]/20">
                      <div className={cn("prose prose-invert max-w-none", isRTL && "text-right")}>
                        <p className="whitespace-pre-line text-white/80 leading-relaxed">
                          {section.content[language]}
                        </p>
                      </div>
                    </div>
                    
                    {/* Terms of Service Update Notice */}
                    {section.id === 'terms' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.15 }}
                        className={cn("mt-6 text-[#B7DEE8]/80 text-sm", isRTL && "text-right")}
                      >
                        <p>
                          {language === 'ar' 
                            ? 'بإنشاء حسابك واستخدام منصة ContraMind، فإنك تقر وتوافق على الالتزام بهذه الشروط. إذا كان لديك أي أسئلة، يرجى الاتصال بنا على Info@contramind.com'
                            : 'By creating your account and using the ContraMind platform, you acknowledged and agreed to be bound by these terms. If you have any questions, please contact us at Info@contramind.com'
                          }
                        </p>
                      </motion.div>
                    )}
                  </motion.section>
                );
              })}
            </div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.15 }}
              className={cn("mt-12 text-center text-[#B7DEE8]/60 text-sm", isRTL && "text-right")}
            >
              {t('آخر تحديث: 14 يناير 2025', 'Last updated: January 14, 2025')}
            </motion.div>
          </motion.main>
        </div>
      </div>
    </motion.div>
  );
}