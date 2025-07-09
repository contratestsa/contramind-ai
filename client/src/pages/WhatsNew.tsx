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
  MessageSquare,
  TicketIcon,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1752056001411.jpg';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

interface Update {
  version: string;
  date: string;
  changes: { ar: string; en: string };
  isNew?: boolean;
}

export default function WhatsNew() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(false);
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

  const updates: Update[] = [
    {
      version: "v1.0.2",
      date: t("اليوم", "Today"),
      changes: { ar: "إضافة فلاتر المستودع", en: "Added repository filters" },
      isNew: true
    },
    {
      version: "v1.0.1",
      date: t("منذ 3 أيام", "3 days ago"),
      changes: { ar: "تحسين دعم اللغة العربية", en: "Improved Arabic support" }
    },
    {
      version: "v1.0.0",
      date: t("منذ أسبوع", "1 week ago"),
      changes: { ar: "الإصدار الأولي", en: "Initial release" }
    }
  ];

  const handleLogout = () => {
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
                      setLocation('/help');
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
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors"
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
              className={cn(
                "w-full h-[36px] px-3 flex items-center gap-2 hover:bg-[#E6E6E6] transition-colors rounded",
                "bg-[#E6E6E6]"
              )}
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
            <button onClick={() => setLocation('/help')} className="hover:text-gray-800">
              <span>{t('مركز المساعدة', 'Help Center')}</span>
            </button>
            <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
            <span>{t('ما الجديد', "What's New")}</span>
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

        {/* Page Content */}
        <div className="px-8 py-8">
          <h1 className="text-2xl font-semibold mb-8">{t('ما الجديد', "What's New")}</h1>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className={cn(
              "absolute top-8 bottom-0 w-0.5 bg-gray-300",
              isRTL ? "right-4" : "left-4"
            )} />

            {/* Updates */}
            <div className="space-y-8">
              {updates.map((update, index) => (
                <div key={index} className={cn("relative flex gap-6", isRTL && "flex-row-reverse")}>
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute w-8 h-8 bg-white border-2 rounded-full flex items-center justify-center",
                    update.isNew ? "border-blue-600" : "border-gray-400",
                    isRTL ? "right-0" : "left-0"
                  )}>
                    {update.isNew && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("flex-1", isRTL ? "pr-12" : "pl-12")}>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className={cn("flex items-start justify-between mb-2", isRTL && "flex-row-reverse")}>
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {update.version}
                            {update.isNew && (
                              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                                {t('جديد', 'New')}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">{update.date}</p>
                        </div>
                      </div>
                      <p className={cn("text-gray-700", isRTL && "text-right")}>
                        {t(update.changes.ar, update.changes.en)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}