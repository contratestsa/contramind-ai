import { useState } from "react";
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
  Layers, 
  HelpCircle, 
  Calendar,
  LogOut,
  Inbox,
  Globe,
  ChevronDown,
  ChevronRight,
  User,
  Building,
  Camera,
  Info
} from "lucide-react";
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1752056001411.jpg';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  fullName?: string;
  profilePicture?: string;
}

export default function PersonalSettings() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(true);
  const isRTL = language === 'ar';

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(language);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisCompleteNotifications, setAnalysisCompleteNotifications] = useState(true);
  const [lowTokenWarnings, setLowTokenWarnings] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

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

  const handleSaveProfile = () => {
    toast({
      title: t('تم حفظ التغييرات', 'Changes Saved'),
      description: t('تم تحديث معلومات ملفك الشخصي بنجاح', 'Your profile information has been updated successfully')
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: t('تم حفظ التفضيلات', 'Preferences Saved'),
      description: t('تم تحديث تفضيلات الإشعارات بنجاح', 'Your notification preferences have been updated successfully')
    });
  };

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

  // Set initial values from user data
  if (user && !fullName) {
    setFullName(user.fullName || '');
  }

  return (
    <div className={cn("min-h-screen flex bg-white", isRTL ? "flex-row-reverse" : "flex-row")}>
      {/* Left Sidebar */}
      <div className="w-[200px] h-screen bg-[#F8F9FA] fixed z-10" style={{ [isRTL ? 'right' : 'left']: 0 }}>
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
                    } else if (item.path === '/settings/personal') {
                      // Already on personal settings
                      return;
                    } else if (item.path === '/settings/organization') {
                      setLocation(item.path);
                    } else {
                      toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) });
                    }
                  }}
                  className={cn(
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                    (item.path === '/settings' && location.startsWith('/settings')) && "bg-[#E6E6E6]"
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
                            isRTL ? "pr-10" : "pl-10",
                            location === subItem.path && "bg-[#E6E6E6]"
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
            <span>{t('الإعدادات', 'Settings')}</span>
            <span className="mx-2">{'>'}</span>
            <span className="text-[#0C2836] font-medium">{t('الإعدادات الشخصية', 'Personal Settings')}</span>
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
                onClick={() => setLocation('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('تسجيل الخروج', 'Logout')}
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Profile Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5">
            <h2 className={cn("text-xl font-semibold text-[#0C2836] mb-6", isRTL ? "text-right" : "text-left")}>
              {t('معلومات الملف الشخصي', 'Profile Information')}
            </h2>
            
            <div className={cn("flex items-start gap-6 mb-6", isRTL ? "flex-row-reverse" : "")}>
              <div className="relative">
                <div className="w-20 h-20 bg-[#0C2836] text-white rounded-full flex items-center justify-center text-2xl font-semibold">
                  {userInitials}
                </div>
                <button className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <button className="text-[#0C2836] text-sm hover:underline">
                {t('تغيير الصورة', 'Change Photo')}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('الاسم الكامل', 'Full Name')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('البريد الإلكتروني', 'Email')}
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('رقم الهاتف', 'Phone Number')}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('اللغة المفضلة', 'Preferred Language')}
                </label>
                <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('الإنجليزية', 'English')}</SelectItem>
                    <SelectItem value="ar">{t('العربية', 'Arabic')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={cn("flex justify-end mt-6", isRTL ? "flex-row-reverse" : "")}>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors"
              >
                {t('حفظ التغييرات', 'Save Changes')}
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5">
            <h2 className={cn("text-xl font-semibold text-[#0C2836] mb-6", isRTL ? "text-right" : "text-left")}>
              {t('تفضيلات الإشعارات', 'Notification Preferences')}
            </h2>

            <div className="space-y-4">
              <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                <div className={cn("space-y-0.5", isRTL ? "text-right" : "text-left")}>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">
                    {t('الإشعارات عبر البريد الإلكتروني', 'Email notifications')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t('تلقي تحديثات مهمة عبر البريد الإلكتروني', 'Receive important updates via email')}
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                <div className={cn("space-y-0.5", isRTL ? "text-right" : "text-left")}>
                  <Label htmlFor="analysis-complete" className="text-sm font-medium">
                    {t('اكتمال تحليل العقد', 'Contract analysis complete')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t('الحصول على إشعار عند اكتمال تحليل العقد', 'Get notified when contract analysis is done')}
                  </p>
                </div>
                <Switch
                  id="analysis-complete"
                  checked={analysisCompleteNotifications}
                  onCheckedChange={setAnalysisCompleteNotifications}
                />
              </div>

              <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                <div className={cn("space-y-0.5", isRTL ? "text-right" : "text-left")}>
                  <Label htmlFor="low-token-warnings" className="text-sm font-medium">
                    {t('تحذيرات انخفاض الرصيد', 'Low token warnings')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t('تنبيهات عندما ينخفض رصيد التوكنات', 'Alerts when token balance is running low')}
                  </p>
                </div>
                <Switch
                  id="low-token-warnings"
                  checked={lowTokenWarnings}
                  onCheckedChange={setLowTokenWarnings}
                />
              </div>

              <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                <div className={cn("space-y-0.5", isRTL ? "text-right" : "text-left")}>
                  <Label htmlFor="weekly-summary" className="text-sm font-medium">
                    {t('الملخص الأسبوعي', 'Weekly summary')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t('تلقي ملخص أسبوعي لنشاطك', 'Receive a weekly summary of your activity')}
                  </p>
                </div>
                <Switch
                  id="weekly-summary"
                  checked={weeklySummary}
                  onCheckedChange={setWeeklySummary}
                />
              </div>
            </div>

            <div className={cn("flex justify-end mt-6", isRTL ? "flex-row-reverse" : "")}>
              <button
                onClick={handleSaveNotifications}
                className="px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors"
              >
                {t('حفظ التفضيلات', 'Save Preferences')}
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className={cn("text-xl font-semibold text-[#0C2836] mb-6", isRTL ? "text-right" : "text-left")}>
              {t('إعدادات الأمان', 'Security Settings')}
            </h2>

            <div className="space-y-4">
              <div className={cn("flex items-center justify-between py-3 border-b", isRTL ? "flex-row-reverse" : "")}>
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <p className="text-sm font-medium text-gray-700">{t('آخر تسجيل دخول', 'Last login')}</p>
                  <p className="text-sm text-gray-500">{t('اليوم في 2:30 م', 'Today at 2:30 PM')}</p>
                </div>
              </div>

              <div className={cn("py-3 border-b", isRTL ? "text-right" : "text-left")}>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('الحسابات المتصلة', 'Connected accounts')}</p>
                <div className="space-y-2">
                  <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs">G</div>
                    <span className="text-sm text-gray-600">Google</span>
                  </div>
                  <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs">M</div>
                    <span className="text-sm text-gray-600">Microsoft</span>
                  </div>
                </div>
              </div>

              <div className={cn("flex items-center justify-between py-3", isRTL ? "flex-row-reverse" : "")}>
                <div className={cn("space-y-0.5", isRTL ? "text-right" : "text-left")}>
                  <Label className="text-sm font-medium">
                    {t('المصادقة الثنائية', 'Two-factor authentication')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t('قريباً', 'Coming Soon')}
                  </p>
                </div>
                <Switch disabled />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}