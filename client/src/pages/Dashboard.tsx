import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Grid3X3, 
  Plus, 
  Folder, 
  Bell, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Calendar,
  LogOut,
  Inbox,
  Globe,
  ChevronRight,
  User,
  Building
} from "lucide-react";
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1752056001411.jpg';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import UploadModal from "@/components/UploadModal";

interface SidebarItem {
  icon: React.ReactNode;
  label: { ar: string; en: string };
  path: string;
  subItems?: SidebarItem[];
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  profilePicture?: string;
}

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [expandedSettings, setExpandedSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const isRTL = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم تسجيل الخروج بنجاح', 'Logged out successfully'),
        description: t('نراك قريباً!', 'See you soon!')
      });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: t('خطأ في تسجيل الخروج', 'Logout Error'),
        description: t('حدث خطأ أثناء تسجيل الخروج', 'An error occurred while logging out'),
        variant: 'destructive'
      });
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (error || (!isLoading && !userData?.user)) {
      setLocation('/');
    }
  }, [error, isLoading, userData, setLocation]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-area')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotifications]);

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
  ];

  const bottomItems: SidebarItem[] = [
    { icon: <HelpCircle className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المساعدة", en: "Help" }, path: "/help" },
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
                      // Already on dashboard
                      return;
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
                    item.path === '/dashboard' && "bg-[#E6E6E6]"
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
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-gray-300">
          <ul className="py-2">
            {bottomItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    if (item.path === '/help') {
                      setLocation('/help');
                    } else {
                      toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) });
                    }
                  }}
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
          {/* Left side (empty for now) */}
          <div />

          {/* Right side items */}
          <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
            {/* Inbox */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Inbox className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative notification-area">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {hasNotifications && (
                  <span className={cn(
                    "absolute top-1 w-2 h-2 bg-red-500 rounded-full",
                    isRTL ? "left-1" : "right-1"
                  )} />
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className={cn(
                  "absolute top-full mt-2 w-[250px] bg-white border border-[#E6E6E6] rounded-lg shadow-sm",
                  isRTL ? "left-0" : "right-0"
                )}>
                  {/* Notification 1 */}
                  <div className="p-3 border-b border-[#E6E6E6]">
                    <p className="text-sm font-normal text-gray-800" style={{ fontFamily: 'Inter' }}>
                      {t('اكتمل تحليل العقد', 'Contract analysis complete')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                      {t('قبل 5 دقائق', '5 minutes ago')}
                    </p>
                  </div>
                  
                  {/* Notification 2 */}
                  <div className="p-3">
                    <p className="text-sm font-normal text-gray-800" style={{ fontFamily: 'Inter' }}>
                      {t('مرحباً بك في ContraMind', 'Welcome to ContraMind')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                      {t('اليوم', 'Today')}
                    </p>
                  </div>
                </div>
              )}
            </div>

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
              <div className="w-10 h-10 bg-[#0C2836] text-white rounded-full flex items-center justify-center font-semibold">
                {userInitials}
              </div>
              <button
                onClick={() => {
                  logoutMutation.mutate();
                  setLocation('/');
                }}
                disabled={logoutMutation.isPending}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('تسجيل الخروج', 'Logout')}
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 flex flex-col items-center">
          {/* User Welcome Section */}
          <div className="flex flex-col items-center">
            {/* User Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#0C2836] text-white flex items-center justify-center font-semibold text-2xl overflow-hidden">
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
            
            {/* Greeting Text */}
            <h2 className="mt-4 text-2xl font-semibold text-[#0C2836]">
              {t(
                `مرحباً ${user?.fullName?.split(' ')[0] || 'بك'}, ماذا تريد أن تفعل؟`,
                `Hey ${user?.fullName?.split(' ')[0] || 'there'}, what do you want to do?`
              )}
            </h2>
          </div>

          {/* Search Bar Section */}
          <div className="mt-8 w-full max-w-[600px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setLocation(`/chat?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder={t('اسأل عن العقود التقنية...', 'Ask about technology contracts...')}
                className={cn(
                  "w-full h-12 text-base text-gray-800 placeholder-gray-400 border border-[#E6E6E6] rounded-lg focus:outline-none focus:border-[#B7DEE8] transition-colors",
                  isRTL ? "pr-12 pl-12 text-right" : "pl-12 pr-12 text-left"
                )}
              />
              {/* Search Icon */}
              <svg 
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",
                  isRTL ? "right-4" : "left-4"
                )}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Send Button */}
              <button 
                onClick={() => {
                  if (searchQuery.trim()) {
                    setLocation(`/chat?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-colors",
                  isRTL ? "left-2" : "right-2"
                )}
              >
                <svg 
                  className="w-5 h-5 text-gray-600"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            {/* Info tooltip */}
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('الدردشة تكلف 5 توكن لكل رسالة', 'Chat costs 5 tokens per message')}</span>
            </div>
          </div>

          {/* Action Card */}
          <div className="mt-10">
            <button
              className="relative w-[280px] h-[160px] bg-white border border-[#E6E6E6] rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center gap-2"
              onClick={() => setIsUploadModalOpen(true)}
            >
              {/* Token Badge */}
              <div className={cn(
                "absolute top-4 bg-[#FFF3CD] flex items-center gap-1 px-2 py-1 rounded-xl",
                isRTL ? "left-4 flex-row-reverse" : "right-4"
              )}>
                <span className="text-xs">🪙</span>
                <span className="text-xs font-medium">{t('10 توكن', '10 tokens')}</span>
              </div>
              
              {/* Upload Icon */}
              <svg 
                className="w-8 h-8 text-gray-600"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800">
                {t('تحميل ومراجعة', 'Upload & Review')}
              </h3>
              
              {/* Subtitle */}
              <p className="text-sm text-[#6C757D] text-center">
                {t('حلل عقدك التقني', 'Analyze your technology contract')}
              </p>
            </button>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}