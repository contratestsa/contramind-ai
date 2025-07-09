import { useState } from "react";
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
  Inbox,
  Globe
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import UploadModal from "@/components/UploadModal";

interface SidebarItem {
  icon: React.ReactNode;
  label: { ar: string; en: string };
  path: string;
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
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const isRTL = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Mock user data for demo
  const userData = {
    user: {
      id: 1,
      username: "Sarah",
      fullName: "Sarah Mitchell",
      email: "sarah@example.com",
      profilePicture: null
    }
  };
  const isLoading = false;

  const sidebarItems: SidebarItem[] = [
    { icon: <Grid3X3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "لوحة القيادة", en: "Dashboard" }, path: "/dashboard" },
    { icon: <Plus className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "إنشاء", en: "Create" }, path: "/create" },
    { icon: <Folder className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المستودع", en: "Repository" }, path: "/repository" },
    { icon: <Bell className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "التنبيهات", en: "Alerts" }, path: "/alerts" },
    { icon: <CheckCircle className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المهام", en: "Tasks" }, path: "/tasks" },
    { icon: <BarChart3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "التقارير", en: "Reports" }, path: "/reports" },
    { icon: <Settings className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "الإعدادات", en: "Settings" }, path: "/settings" },
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
      {/* Left Sidebar */}
      <div className="w-[200px] h-screen bg-[#F8F9FA] fixed z-10" style={{ [isRTL ? 'right' : 'left']: 0 }}>
        {/* Logo */}
        <div className="h-[60px] flex items-center px-5">
          <h1 className="text-xl font-bold text-[#0C2836] font-heading">ContraMind</h1>
        </div>

        {/* My Work Section */}
        <div className="bg-[#0C2836] text-white px-5 py-3">
          <h3 className={cn("text-base font-semibold", language === 'ar' ? 'font-arabic' : 'font-heading')}>{t('عملي', 'My Work')}</h3>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="py-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) })}
                  className={cn(
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                    isRTL ? "flex-row-reverse text-right" : "text-left"
                  )}
                >
                  {item.icon}
                  <span className={cn("text-[15px] text-gray-700", language === 'ar' ? 'font-arabic' : 'font-sans')}>{t(item.label.ar, item.label.en)}</span>
                </button>
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
                  className={cn(
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                    isRTL ? "flex-row-reverse text-right" : "text-left"
                  )}
                >
                  {item.icon}
                  <span className={cn("text-[15px] text-gray-700", language === 'ar' ? 'font-arabic' : 'font-sans')}>{t(item.label.ar, item.label.en)}</span>
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
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 font-sans">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Token Counter */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#0C2836] text-white rounded-lg">
              <span className="text-lg">🪙</span>
              <span className={cn("text-sm font-medium", language === 'ar' ? 'font-arabic' : 'font-sans')}>1,000 {t('رموز', 'Tokens')}</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0C2836] text-white rounded-full flex items-center justify-center font-semibold">
                {userInitials}
              </div>

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
            <h2 className={cn("mt-4 text-2xl font-semibold text-[#0C2836]", language === 'ar' ? 'font-arabic' : 'font-heading')}>
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
                placeholder={t('اسأل عن العقود التقنية...', 'Ask about technology contracts...')}
                className={cn("w-full h-12 pl-12 pr-12 text-base border border-[#E6E6E6] rounded-lg focus:outline-none focus:border-[#B7DEE8] transition-colors", language === 'ar' ? 'font-arabic' : 'font-sans')}
              />
              {/* Search Icon */}
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Send Button */}
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-colors">
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
              <span className={cn(language === 'ar' ? 'font-arabic' : 'font-sans')}>{t('الدردشة تكلف 5 رموز لكل رسالة', 'Chat costs 5 tokens per message')}</span>
            </div>
          </div>

          {/* Action Card */}
          <div className="mt-10">
            <button
              className="relative w-[280px] h-[160px] bg-white border border-[#E6E6E6] rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center gap-2"
              onClick={() => setIsUploadModalOpen(true)}
            >
              {/* Token Badge */}
              <div className="absolute top-4 right-4 bg-[#FFF3CD] flex items-center gap-1 px-2 py-1 rounded-xl">
                <span className="text-xs">🪙</span>
                <span className={cn("text-xs font-medium", language === 'ar' ? 'font-arabic' : 'font-sans')}>{t('10 رموز', '10 tokens')}</span>
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
              <h3 className={cn("text-lg font-bold text-gray-800", language === 'ar' ? 'font-arabic' : 'font-heading')}>
                {t('تحميل ومراجعة', 'Upload & Review')}
              </h3>
              
              {/* Subtitle */}
              <p className={cn("text-sm text-[#6C757D] text-center", language === 'ar' ? 'font-arabic' : 'font-sans')}>
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