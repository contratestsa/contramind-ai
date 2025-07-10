import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Grid3X3, 
  Plus, 
  Folder, 
  Bell, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  Layers, 
  HelpCircle, 
  Calendar,
  LogOut,
  Globe,
  ChevronRight,
  User,
  Building
} from "lucide-react";
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1752056001411.jpg';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarItem {
  icon: React.ReactNode;
  label: { ar: string; en: string };
  path: string;
  subItems?: SidebarItem[];
}

interface User {
  id: number;
  username: string;
  fullName?: string;
  profilePicture?: string;
}

interface FAQItem {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export default function Help() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(location.startsWith('/settings'));
  const isRTL = language === 'ar';

  // Fetch user data
  const { data: userData, isLoading: userLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const sidebarItems: SidebarItem[] = [
    { icon: <Grid3X3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "لوحة التحكم", en: "Dashboard" }, path: "/dashboard" },
    { icon: <Plus className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "إنشاء", en: "Create" }, path: "/create" },
    { icon: <Folder className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "ملفاتي", en: "My Drive" }, path: "/repository" },
    { icon: <Bell className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "التنبيهات", en: "Alerts" }, path: "/alerts" },
    { icon: <CheckCircle className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المهام", en: "Tasks" }, path: "/tasks" },
    { icon: <BarChart3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "التقارير", en: "Reports" }, path: "/reports" },
    { 
      icon: <Settings className="w-[18px] h-[18px] text-gray-700" />, 
      label: { ar: "الإعدادات", en: "Settings" }, 
      path: "/settings",
      subItems: [
        { icon: <User className="w-[16px] h-[16px] text-gray-600" />, label: { ar: "الإعدادات الشخصية", en: "Personal Settings" }, path: "/settings/personal" },
        { icon: <Building className="w-[16px] h-[16px] text-gray-600" />, label: { ar: "إعدادات المؤسسة", en: "Organization Settings" }, path: "/settings/organization" }
      ]
    },
    { icon: <Layers className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "صفقات مكدسة", en: "Deals Stack" }, path: "/deals" },
  ];

  const faqItems: FAQItem[] = [
    {
      question: {
        ar: 'كيف تُسهل ContraMind مهمة مراجعة وتحليل العقود؟',
        en: 'How does ContraMind facilitate contract review and analysis?',
      },
      answer: {
        ar: 'تستخدم ContraMind تقنيات الذكاء الاصطناعي المتقدمة لتحليل العقود تلقائياً وتحديد النقاط الحرجة والمخاطر المحتملة. تقوم المنصة بمراجعة شاملة للبنود والشروط، وتقدم تقارير مفصلة حول المخاطر القانونية، وتقترح تعديلات لتحسين العقد وحماية مصالحك.',
        en: 'ContraMind uses advanced AI technologies to automatically analyze contracts and identify critical points and potential risks. The platform provides comprehensive review of terms and conditions, delivers detailed reports on legal risks, and suggests modifications to improve the contract and protect your interests.',
      },
    },
    {
      question: {
        ar: 'ما الأنظمة القانونية التي تغطيها المنصة؟',
        en: 'What legal systems does the platform cover?',
      },
      answer: {
        ar: 'نغطي جميع القوانين التجارية الأساسية بما في ذلك قانون الشركات، قانون العمل، قانون التجارة الإلكترونية، وأنظمة الاستثمار الأجنبي ، وجميع القوانين المتعلقه بالعقود.ونقوم بتحديث قاعدة البيانات باستمرار لتشمل جميع التعديلات الجديدة.',
        en: 'We cover all fundamental commercial laws including Companies Law, Labor Law, E-Commerce Law, Foreign Investment regulations, and all contract-related laws. We continuously update our database to include all new amendments.',
      },
    },
    {
      question: {
        ar: 'هل تدعم ContraMind مراجعة وتحليل العقود باللغة العربية بشكل احترافي؟',
        en: 'Does ContraMind support professional contract review and analysis in Arabic?',
      },
      answer: {
        ar: 'نعم بالتأكيد. ContraMind هي أول منصة ذكاء اصطناعي متخصصة في مراجعة وتحليل العقود باللغة العربية. نستخدم نماذج ذكاء اصطناعي مدربة خصيصاً على النصوص القانونية العربية والمصطلحات التجارية المحلية، مما يضمن فهماً دقيقاً للسياق القانوني والثقافي. المنصة تحلل العقود العربية بدقة عالية وتقدم تقارير شاملة بالعربية مع اقتراحات لتحسين البنود والشروط.',
        en: 'Absolutely. ContraMind is the first AI platform specialized in Arabic contract review and analysis. We use AI models specifically trained on Arabic legal texts and local commercial terminology, ensuring precise understanding of legal and cultural context. The platform analyzes Arabic contracts with high accuracy and provides comprehensive reports in Arabic with suggestions for improving terms and conditions.',
      },
    },
    {
      question: {
        ar: 'كيف يمكن الاستفادة من منصة ContraMind في عملي؟',
        en: 'How can I benefit from ContraMind platform in my business?',
      },
      answer: {
        ar: 'يمكنك استخدام ContraMind لمراجعة جميع أنواع العقود التجارية بسرعة ودقة. المنصة توفر الوقت والجهد من خلال تحليل العقود في ثوانٍ بدلاً من ساعات، تحديد المخاطر القانونية المحتملة، اقتراح تعديلات للحماية، وضمان الامتثال للقوانين السعودية. كما توفر مكتبة من النماذج القانونية المعتمدة وإدارة مركزية لجميع عقودك.',
        en: 'You can use ContraMind to review all types of commercial contracts quickly and accurately. The platform saves time and effort by analyzing contracts in seconds instead of hours, identifying potential legal risks, suggesting protective amendments, and ensuring compliance with Saudi laws. It also provides a library of approved legal templates and centralized management for all your contracts.',
      },
    },
    {
      question: {
        ar: 'هل تحفظ المنصة سرية وأمان البيانات والعقود؟',
        en: 'Does the platform maintain confidentiality and security of data and contracts?',
      },
      answer: {
        ar: 'نضع أمان وسرية بياناتك في أعلى أولوياتنا. جميع البيانات مشفرة باستخدام أحدث تقنيات التشفير، ونتبع معايير الأمان العالمية ISO 27001. لا يتم مشاركة أي بيانات مع أطراف ثالثة، وجميع العقود تخزن في بيئة آمنة معزولة. نضمن الامتثال الكامل لقوانين حماية البيانات المحلية والدولية.',
        en: 'We place your data security and confidentiality as our highest priority. All data is encrypted using the latest encryption technologies, and we follow international security standards ISO 27001. No data is shared with third parties, and all contracts are stored in a secure isolated environment. We ensure full compliance with local and international data protection laws.',
      },
    },
  ];

  if (userLoading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn("min-h-screen flex bg-white", isRTL ? "flex-row-reverse" : "flex-row")}>
      {/* Sidebar */}
      <div className={cn("w-[200px] h-screen bg-[#F8F9FA] fixed z-10", isRTL ? "right-0" : "left-0")}>
        {/* Logo */}
        <div className="h-[80px] flex items-center justify-center px-3 bg-white">
          <div className="bg-white p-3 rounded-lg">
            <img 
              src={logoImage} 
              alt="ContraMind Logo" 
              className="max-h-[50px] object-contain rounded-md"
            />
          </div>
        </div>

        {/* My Work Section */}
        <div className="bg-[#0C2836] text-white px-5 py-3">
          <h3 className={cn("text-base font-semibold", isRTL ? "text-right" : "text-left")}>
            {t('عملي', 'My Work')}
          </h3>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="py-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    if (item.path === '/settings') {
                      setExpandedSettings(!expandedSettings);
                    } else if (item.path === '/dashboard' || item.path === '/repository') {
                      setLocation(item.path);
                    } else {
                      toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) });
                    }
                  }}
                  className="w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors"
                >
                  {item.subItems && (
                    <div className={cn("transition-transform", expandedSettings ? "rotate-90" : "", isRTL ? "order-last" : "order-first")}>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  {item.icon}
                  <span className={cn("text-[15px] text-gray-700 flex-1", isRTL ? "text-right" : "text-left")}>
                    {t(item.label.ar, item.label.en)}
                  </span>
                </button>

                {/* Sub-items */}
                {item.subItems && expandedSettings && (
                  <ul>
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <button
                          onClick={() => setLocation(subItem.path)}
                          className={cn(
                            "w-full h-[40px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                            isRTL ? "pr-10" : "pl-10"
                          )}
                        >
                          {subItem.icon}
                          <span className={cn("text-[14px] text-gray-600 flex-1", isRTL ? "text-right" : "text-left")}>
                            {t(subItem.label.ar, subItem.label.en)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto">
          <ul className="space-y-1">
            <li>
              <button
                className="w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors bg-[#E6E6E6]"
              >
                <HelpCircle className="w-[18px] h-[18px] text-gray-700" />
                <span className={cn("text-[15px] text-gray-700 flex-1", isRTL ? "text-right" : "text-left")}>
                  {t('المساعدة', 'Help')}
                </span>
              </button>
            </li>

          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1 flex flex-col", isRTL ? "mr-[200px]" : "ml-[200px]")}>
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-[#E6E6E6] px-6 flex items-center justify-between">
          <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
            <span className="text-gray-700 text-sm font-medium">{t('مركز المساعدة', 'Help Center')}</span>
          </div>

          <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
            <div className="relative">
              <button 
                onClick={() => setHasNotifications(!hasNotifications)}
                className="relative w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-[20px] h-[20px] text-gray-700" />
                {hasNotifications && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>

            <button
              onClick={toggleLanguage}
              className="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-[20px] h-[20px] text-gray-700" />
            </button>

            <button
              onClick={() => {
                toast({ title: t('تسجيل الخروج', 'Logging out') });
                setLocation('/');
              }}
              className="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-[20px] h-[20px] text-gray-700" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 bg-white p-8">
          <div className="max-w-[800px] mx-auto">
            {/* FAQ Section */}
            <h2 className={cn("text-[24px] font-['Space_Grotesk'] font-semibold text-[#0C2836] mb-8", isRTL && "text-right")}>
              {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
            </h2>

            <div className="space-y-[16px]">
              {faqItems.map((item, index) => (
                <div key={index} className="mb-[16px]">
                  <h3 className={cn("text-[16px] font-['Inter'] text-[#0C2836] mb-2", isRTL && "text-right")}>
                    {t(item.question.ar, item.question.en)}
                  </h3>
                  <p className={cn("text-[14px] font-['Inter'] text-[#6C757D]", isRTL && "text-right")}>
                    {t(item.answer.ar, item.answer.en)}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="bg-[#E8F4F8] p-[24px] rounded-lg mt-12">
              <p className={cn("text-[16px] text-[#0C2836] mb-2", isRTL && "text-right")}>
                {t('تحتاج إلى مزيد من المساعدة؟', 'Need more help?')}
              </p>
              <a 
                href="mailto:Ceo@contramind.com"
                className="text-[#0C2836] underline hover:opacity-80 transition-opacity"
                dir={isRTL ? "rtl" : "ltr"}
              >
                Ceo@contramind.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}