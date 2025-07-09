import { useState } from "react";
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
  Inbox,
  Globe,
  ChevronRight,
  User,
  Building,
  Search,
  Rocket,
  Coins,
  Upload,
  Headset,
  CreditCard,
  Plus as PlusIcon,
  Minus,
  MessageSquare,
  TicketIcon,
  Sparkles
} from "lucide-react";
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1752056001411.jpg';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import FeedbackModal from "@/components/FeedbackModal";
import TicketModal from "@/components/TicketModal";

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

interface QuickLink {
  icon: React.ReactNode;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  action?: () => void;
}

export default function HelpCenter() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const isRTL = language === 'ar';

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const sidebarItems: SidebarItem[] = [
    { icon: <Grid3X3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "لوحة القيادة", en: "Dashboard" }, path: "/dashboard" },
    { icon: <Plus className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "إنشاء", en: "Create" }, path: "/create" },
    { icon: <Folder className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المستودع", en: "Repository" }, path: "/repository" },
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
    { icon: <HelpCircle className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المساعدة", en: "Help" }, path: "/help" },
  ];

  const quickLinks: QuickLink[] = [
    {
      icon: <Rocket className="w-8 h-8 text-blue-600" />,
      title: { ar: "البدء", en: "Getting Started" },
      description: { ar: "تعلم الأساسيات", en: "Learn the basics" }
    },
    {
      icon: <Coins className="w-8 h-8 text-yellow-600" />,
      title: { ar: "فهم الرموز", en: "Understanding Tokens" },
      description: { ar: "كيف تعمل الرموز", en: "How tokens work" }
    },
    {
      icon: <Upload className="w-8 h-8 text-green-600" />,
      title: { ar: "إرشادات التحميل", en: "Upload Guidelines" },
      description: { ar: "متطلبات الملفات", en: "File requirements" }
    },
    {
      icon: <Search className="w-8 h-8 text-purple-600" />,
      title: { ar: "تحليل العقود", en: "Contract Analysis" },
      description: { ar: "كيف يحلل الذكاء الاصطناعي", en: "How AI analyzes" }
    },
    {
      icon: <CreditCard className="w-8 h-8 text-orange-600" />,
      title: { ar: "الفواتير والمدفوعات", en: "Billing & Payments" },
      description: { ar: "معلومات الاشتراك", en: "Subscription info" }
    },
    {
      icon: <Headset className="w-8 h-8 text-red-600" />,
      title: { ar: "اتصل بالدعم", en: "Contact Support" },
      description: { ar: "احصل على المساعدة", en: "Get help" },
      action: () => setShowTicketModal(true)
    }
  ];

  const faqCategories = {
    general: {
      label: { ar: "عام", en: "General" },
      items: [
        {
          question: { ar: "ما هو ContraMind؟", en: "What is ContraMind?" },
          answer: { ar: "ContraMind هو منصة ذكاء اصطناعي متقدمة لتحليل العقود القانونية.", en: "ContraMind is an advanced AI platform for analyzing legal contracts." }
        },
        {
          question: { ar: "ما مدى دقة تحليل الذكاء الاصطناعي؟", en: "How accurate is the AI analysis?" },
          answer: { ar: "نظامنا يحقق دقة تصل إلى 95% في تحديد المخاطر القانونية.", en: "Our system achieves up to 95% accuracy in identifying legal risks." }
        },
        {
          question: { ar: "هل بياناتي آمنة؟", en: "Is my data secure?" },
          answer: { ar: "نعم، نستخدم تشفير على مستوى المؤسسات ونلتزم بأعلى معايير الأمان.", en: "Yes, we use enterprise-level encryption and comply with the highest security standards." }
        }
      ]
    },
    tokens: {
      label: { ar: "الرموز", en: "Tokens" },
      items: [
        {
          question: { ar: "ما هي الرموز وكيف تعمل؟", en: "What are tokens and how do they work?" },
          answer: { ar: "الرموز هي وحدات تستخدم لتحليل العقود. كل تحليل يستهلك عدد معين من الرموز.", en: "Tokens are units used for contract analysis. Each analysis consumes a certain number of tokens." }
        },
        {
          question: { ar: "كيف أحصل على المزيد من الرموز؟", en: "How do I get more tokens?" },
          answer: { ar: "يمكنك شراء المزيد من الرموز من صفحة الإعدادات أو الترقية لخطة أعلى.", en: "You can purchase more tokens from the settings page or upgrade to a higher plan." }
        },
        {
          question: { ar: "هل تنتهي صلاحية الرموز؟", en: "Do tokens expire?" },
          answer: { ar: "لا، الرموز لا تنتهي صلاحيتها وتبقى في حسابك حتى تستخدمها.", en: "No, tokens don't expire and remain in your account until you use them." }
        }
      ]
    },
    contracts: {
      label: { ar: "العقود", en: "Contracts" },
      items: [
        {
          question: { ar: "ما هي صيغ الملفات المدعومة؟", en: "What file formats are supported?" },
          answer: { ar: "ندعم PDF، DOCX، DOC، وملفات النصوص.", en: "We support PDF, DOCX, DOC, and text files." }
        },
        {
          question: { ar: "ما هو الحد الأقصى لحجم الملف؟", en: "What's the maximum file size?" },
          answer: { ar: "الحد الأقصى لحجم الملف هو 50 ميجابايت.", en: "The maximum file size is 50MB." }
        },
        {
          question: { ar: "هل يمكنني تحليل عدة عقود؟", en: "Can I analyze multiple contracts?" },
          answer: { ar: "نعم، يمكنك تحليل عدة عقود في وقت واحد باستخدام ميزة التحليل المجمع.", en: "Yes, you can analyze multiple contracts at once using the batch analysis feature." }
        }
      ]
    },
    technical: {
      label: { ar: "تقني", en: "Technical" },
      items: [
        {
          question: { ar: "ما هي المتصفحات المدعومة؟", en: "Which browsers are supported?" },
          answer: { ar: "ندعم أحدث إصدارات Chrome، Firefox، Safari، وEdge.", en: "We support the latest versions of Chrome, Firefox, Safari, and Edge." }
        },
        {
          question: { ar: "هل يمكنني استخدام ContraMind على الهاتف المحمول؟", en: "Can I use ContraMind on mobile?" },
          answer: { ar: "نعم، منصتنا متوافقة مع الأجهزة المحمولة وتعمل على جميع الأجهزة.", en: "Yes, our platform is mobile-responsive and works on all devices." }
        },
        {
          question: { ar: "كيف أقوم بتفعيل اللغة العربية؟", en: "How do I enable Arabic?" },
          answer: { ar: "انقر على أيقونة اللغة في الشريط العلوي للتبديل بين العربية والإنجليزية.", en: "Click the language icon in the top bar to switch between Arabic and English." }
        }
      ]
    }
  };

  const currentCategory = faqCategories[activeTab as keyof typeof faqCategories];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleLogout = () => {
    // Logout logic would go here
    toast({
      title: t('تم تسجيل الخروج', 'Logged out'),
      description: t('تم تسجيل خروجك بنجاح', 'You have been logged out successfully')
    });
    setLocation('/');
  };

  const getNotificationCount = () => {
    return hasNotifications ? 3 : 0;
  };

  return (
    <div className={cn("min-h-screen bg-[#FAFAFA] flex", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200">
        {/* Logo Area */}
        <div className="h-[72px] flex items-center px-5 border-b border-gray-200">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="h-10 w-auto rounded-lg bg-white p-1.5"
          />
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
                    } else if (item.path === '/help') {
                      // Already on help page
                      return;
                    } else if (item.path === '/repository') {
                      setLocation('/repository');
                    } else if (item.path === '/dashboard') {
                      setLocation('/dashboard');
                    } else if (item.path === '/settings/personal') {
                      setLocation(item.path);
                    } else if (item.path === '/settings/organization') {
                      setLocation(item.path);
                    } else {
                      toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) });
                    }
                  }}
                  className={cn(
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                    item.path === '/help' && "bg-[#E6E6E6]"
                  )}
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

          {/* Footer Quick Links */}
          <div className="border-t border-gray-200 mt-auto p-4">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full h-[36px] px-3 flex items-center gap-2 hover:bg-[#E6E6E6] transition-colors rounded"
            >
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <span className="text-[12px] text-gray-600">{t('ملاحظات', 'Feedback')}</span>
            </button>
            <button
              onClick={() => setShowTicketModal(true)}
              className="w-full h-[36px] px-3 flex items-center gap-2 hover:bg-[#E6E6E6] transition-colors rounded"
            >
              <TicketIcon className="w-4 h-4 text-gray-600" />
              <span className="text-[12px] text-gray-600">{t('رفع تذكرة', 'Raise Ticket')}</span>
            </button>
            <button
              onClick={() => setLocation('/whats-new')}
              className="w-full h-[36px] px-3 flex items-center gap-2 hover:bg-[#E6E6E6] transition-colors rounded"
            >
              <Sparkles className="w-4 h-4 text-gray-600" />
              <span className="text-[12px] text-gray-600">{t('ما الجديد', "What's New")}</span>
            </button>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-5 mt-auto">
          <button className="flex items-center gap-3">
            <HelpCircle className="w-[18px] h-[18px] text-gray-700" />
            <span className="text-[15px] text-gray-700">{t('المساعدة', 'Help')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#FAFAFA]">
        {/* Top Bar */}
        <header className="h-[72px] bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className={cn("flex items-center gap-2 text-sm text-gray-600", isRTL && "flex-row-reverse")}>
            <span>{t('مركز المساعدة', 'Help Center')}</span>
          </div>
          
          <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
            {/* Notifications */}
            <button className="relative">
              <Inbox className="w-5 h-5 text-gray-600" />
              {getNotificationCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getNotificationCount()}
                </span>
              )}
            </button>

            {/* Language Toggle */}
            <button onClick={toggleLanguage} className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-sm">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className={cn("text-right", isRTL && "text-left")}>
                <p className="text-sm font-medium">{userData?.user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{userData?.user?.username || 'user@example.com'}</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-[#E8F4F8] py-10 px-8">
          <h1 className="text-[32px] font-semibold text-center mb-6">
            {t('كيف يمكننا مساعدتك؟', 'How can we help you?')}
          </h1>
          <div className="max-w-[500px] mx-auto relative">
            <input
              type="text"
              placeholder={t('ابحث عن المساعدة...', 'Search for help...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full h-12 px-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                isRTL && "text-right"
              )}
            />
            <Search className={cn(
              "absolute top-3 w-6 h-6 text-gray-400",
              isRTL ? "right-4" : "left-4"
            )} />
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action || (() => toast({ 
                  title: t('قريباً', 'Coming Soon'), 
                  description: t('هذه الميزة ستكون متاحة قريباً', 'This feature will be available soon')
                }))}
                className="bg-white border border-[#E6E6E6] p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {link.icon}
                  <h3 className="font-semibold text-lg">{t(link.title.ar, link.title.en)}</h3>
                  <p className="text-gray-600 text-sm">{t(link.description.ar, link.description.en)}</p>
                </div>
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
            </h2>

            {/* Category Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              {Object.entries(faqCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors relative",
                    activeTab === key 
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600" 
                      : "text-gray-600 hover:text-gray-800"
                  )}
                >
                  {t(category.label.ar, category.label.en)}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {currentCategory.items.map((item, index) => {
                const itemId = `${activeTab}-${index}`;
                const isExpanded = expandedFAQ === itemId;
                
                return (
                  <div key={itemId} className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(itemId)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className={cn("font-medium", isRTL && "text-right")}>
                        {t(item.question.ar, item.question.en)}
                      </span>
                      {isExpanded ? (
                        <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <PlusIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-4">
                        <p className={cn("text-gray-600", isRTL && "text-right")}>
                          {t(item.answer.ar, item.answer.en)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
      {showTicketModal && <TicketModal onClose={() => setShowTicketModal(false)} />}
    </div>
  );
}