import { useState, useEffect } from "react";
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
  FileText,
  Search,
  Calculator,
  Check,
  ChevronRight,
  User,
  Building
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1752056001411.jpg';

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

interface AnalysisStep {
  id: number;
  icon: React.ReactNode;
  text: { ar: string; en: string };
  activeAt: number; // milliseconds
}

export default function AnalysisProgress() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedSettings, setExpandedSettings] = useState(false);
  const isRTL = language === 'ar';

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Analysis steps
  const analysisSteps: AnalysisStep[] = [
    {
      id: 1,
      icon: <FileText className="w-6 h-6" />,
      text: { ar: "قراءة العقد...", en: "Reading contract..." },
      activeAt: 0
    },
    {
      id: 2,
      icon: <Search className="w-6 h-6" />,
      text: { ar: "تحليل البنود...", en: "Analyzing clauses..." },
      activeAt: 2000
    },
    {
      id: 3,
      icon: <Calculator className="w-6 h-6" />,
      text: { ar: "حساب المخاطر...", en: "Calculating risk..." },
      activeAt: 4000
    }
  ];

  // Handle step progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Activate steps
    analysisSteps.forEach((step, index) => {
      const activateTimer = setTimeout(() => {
        setCurrentStepIndex(index);
      }, step.activeAt);
      timers.push(activateTimer);

      // Complete previous step when next one activates
      if (index > 0) {
        const completeTimer = setTimeout(() => {
          setCompletedSteps(prev => [...prev, index - 1]);
        }, step.activeAt);
        timers.push(completeTimer);
      }
    });

    // Complete all steps and navigate
    const finalTimer = setTimeout(() => {
      setCompletedSteps([0, 1, 2]);
      
      // Store mock analysis data
      const mockAnalysisData = {
        riskScore: 45,
        riskLevel: "Medium",
        findings: [
          {
            type: "liability",
            severity: "high",
            clause: "Section 5.2",
            description: "Unlimited liability clause detected"
          },
          {
            type: "payment",
            severity: "medium",
            clause: "Section 3.1",
            description: "Payment terms exceed 60 days"
          },
          {
            type: "termination",
            severity: "low",
            clause: "Section 12",
            description: "No automatic renewal clause"
          }
        ]
      };
      
      // Store in sessionStorage
      sessionStorage.setItem('analysisResult', JSON.stringify(mockAnalysisData));
      
      // Navigate after 1 more second
      setTimeout(() => {
        setLocation('/analysis-results');
      }, 1000);
    }, 6000);
    
    timers.push(finalTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [setLocation]);

  // Redirect if not authenticated
  useEffect(() => {
    if (error || (!isLoading && !userData?.user)) {
      setLocation('/');
    }
  }, [error, isLoading, userData, setLocation]);

  const sidebarItems: SidebarItem[] = [
    { icon: <Grid3X3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "لوحة التحكم", en: "Dashboard" }, path: "/dashboard" },
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
  ];

  const bottomItems: SidebarItem[] = [
    { icon: <HelpCircle className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المساعدة", en: "Help" }, path: "/help" },
    { icon: <Calendar className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "حجز عرض توضيحي", en: "Schedule Demo" }, path: "/demo" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const user = userData?.user;
  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'U';

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

        {/* Bottom Items */}
        <div className="border-t border-gray-300">
          <ul className="py-2">
            {bottomItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) })}
                  className="w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors"
                >
                  {item.icon}
                  <span className={cn("text-[15px] text-gray-700 flex-1", isRTL ? "text-right" : "text-left")}>
                    {t(item.label.ar, item.label.en)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1", isRTL ? "mr-[200px]" : "ml-[200px]")}>
        {/* Top Header */}
        <header className="h-[60px] bg-white shadow-sm flex items-center justify-between px-6" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {/* Breadcrumb */}
          <div className={cn("text-sm text-gray-600", isRTL ? "text-right" : "text-left")}>
            <button onClick={() => setLocation('/dashboard')} className="hover:text-[#0C2836]">
              {t('لوحة القيادة', 'Dashboard')}
            </button>
            <span className="mx-2">›</span>
            <span>{t('التحميل والمراجعة', 'Upload & Review')}</span>
            <span className="mx-2">›</span>
            <span className="text-[#0C2836] font-medium">{t('التحليل', 'Analyzing')}</span>
          </div>

          {/* Right side items */}
          <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
            {/* Inbox */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Inbox className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {hasNotifications && (
                <span className={cn(
                  "absolute top-1 w-2 h-2 bg-red-500 rounded-full",
                  isRTL ? "left-1" : "right-1"
                )} />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Token Counter */}
            <div className={cn(
              "flex items-center gap-1 px-3 py-1.5 bg-[#0C2836] text-white rounded-lg",
              isRTL ? "flex-row-reverse" : ""
            )}>
              <span className="text-lg">🪙</span>
              <span className="text-sm font-medium">1,000 {t('توكن', 'Tokens')}</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0C2836] text-white rounded-full flex items-center justify-center font-semibold overflow-hidden">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.fullName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <button
                onClick={() => setLocation('/login')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('تسجيل الخروج', 'Logout')}
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex items-center justify-center min-h-[calc(100vh-60px)]">
          <div className="w-[400px] text-center">
            {/* Progress Animation */}
            <div className="mb-12 flex justify-center">
              <div className="w-[100px] h-[100px] flex items-center justify-center">
                <div className="w-full h-full border-4 border-[#0C2836] border-opacity-20 rounded-full animate-spin"
                     style={{ borderTopColor: '#0C2836' }}>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-5">
              {analysisSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isActive = currentStepIndex === index && !isCompleted;
                const isInactive = currentStepIndex < index;

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3"
                  >
                    {/* Icon */}
                    <div className={cn(
                      "transition-all duration-300",
                      isCompleted && "text-green-600",
                      isActive && "text-[#0C2836] animate-pulse",
                      isInactive && "text-[#6C757D]"
                    )}>
                      {isCompleted ? <Check className="w-6 h-6" /> : step.icon}
                    </div>

                    {/* Text */}
                    <span className={cn(
                      "text-base transition-colors duration-300",
                      isCompleted && "text-green-600",
                      isActive && "text-[#0C2836]",
                      isInactive && "text-[#6C757D]"
                    )}>
                      {t(step.text.ar, step.text.en)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            <p className="mt-8 text-sm text-[#6C757D]">
              {t('التحليل قيد التقدم (مدفوع بالفعل)', 'Analysis in progress (already paid)')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}