import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Settings, 
  HelpCircle, 
  LogOut,
  User,
  Menu,
  MessageSquare,
  Plus,
  Upload,
  ArrowLeft,
  ChevronRight,
  Send
} from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';
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

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profilePicture?: string;
}

export default function PersonalSettings() {
  const { t, language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center bg-[#343541]">
        <div className="text-white">{t('جاري التحميل...', 'Loading...')}</div>
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-[#343541] flex">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar - GPT Style */}
      <div className={cn(
        "w-[260px] h-screen bg-[#202123] flex flex-col fixed z-50 transition-transform duration-300 lg:translate-x-0",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-600">
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
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2B32] transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('العودة للوحة التحكم', 'Back to Dashboard')}</span>
          </button>
          
          <button
            onClick={() => setLocation('/settings/personal')}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#2A2B32] text-white"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">{t('الإعدادات الشخصية', 'Personal Settings')}</span>
          </button>
        </nav>

        {/* Bottom Items */}
        <div className="p-4 border-t border-gray-600 space-y-2">
          <button
            onClick={() => setLocation('/help')}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2B32] transition-colors text-white"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">{t('المساعدة', 'Help')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2B32] transition-colors text-white"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">{t('تسجيل الخروج', 'Logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px]">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#40414F] border-b border-[#565869]">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 hover:bg-[#565869] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-medium">{t('الإعدادات', 'Settings')}</span>
          <div className="w-9" />
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-white mb-2">
                {t('الإعدادات الشخصية', 'Personal Settings')}
              </h1>
              <p className="text-[#8E8EA0] text-sm">
                {t('قم بتحديث معلومات ملفك الشخصي وتفضيلاتك', 'Update your profile information and preferences')}
              </p>
            </div>

            {/* Profile Information Card */}
            <div className="bg-[#40414F] border border-[#565869] rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-medium text-white mb-4">
                {t('معلومات الملف الشخصي', 'Profile Information')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-[#8E8EA0] text-sm font-medium">
                    {t('الاسم الكامل', 'Full Name')}
                  </Label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full bg-[#343541] border border-[#565869] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#19C37D] focus:border-transparent"
                    placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#8E8EA0] text-sm font-medium">
                    {t('البريد الإلكتروني', 'Email Address')}
                  </Label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-1 w-full bg-[#343541] border border-[#565869] rounded-lg px-4 py-3 text-[#8E8EA0] cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-[#8E8EA0] text-sm font-medium">
                    {t('رقم الهاتف', 'Phone Number')}
                  </Label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 w-full bg-[#343541] border border-[#565869] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#19C37D] focus:border-transparent"
                    placeholder={t('أدخل رقم الهاتف', 'Enter phone number')}
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="text-[#8E8EA0] text-sm font-medium">
                    {t('اللغة المفضلة', 'Preferred Language')}
                  </Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger className="mt-1 w-full bg-[#343541] border border-[#565869] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#343541] border border-[#565869]">
                      <SelectItem value="ar" className="text-white hover:bg-[#2A2B32]">العربية</SelectItem>
                      <SelectItem value="en" className="text-white hover:bg-[#2A2B32]">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-[#19C37D] hover:bg-[#16B374] text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {t('حفظ التغييرات', 'Save Changes')}
                </button>
              </div>
            </div>

            {/* Notification Preferences Card */}
            <div className="bg-[#40414F] border border-[#565869] rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-medium text-white mb-4">
                {t('تفضيلات الإشعارات', 'Notification Preferences')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm font-medium">
                      {t('الإشعارات عبر البريد الإلكتروني', 'Email Notifications')}
                    </Label>
                    <p className="text-[#8E8EA0] text-xs mt-1">
                      {t('استقبل الإشعارات عبر البريد الإلكتروني', 'Receive notifications via email')}
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm font-medium">
                      {t('إشعارات اكتمال التحليل', 'Analysis Complete Notifications')}
                    </Label>
                    <p className="text-[#8E8EA0] text-xs mt-1">
                      {t('عند انتهاء تحليل العقد', 'When contract analysis is complete')}
                    </p>
                  </div>
                  <Switch
                    checked={analysisCompleteNotifications}
                    onCheckedChange={setAnalysisCompleteNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm font-medium">
                      {t('تحذيرات الرصيد المنخفض', 'Low Token Warnings')}
                    </Label>
                    <p className="text-[#8E8EA0] text-xs mt-1">
                      {t('عندما يصبح رصيدك منخفضاً', 'When your token balance is low')}
                    </p>
                  </div>
                  <Switch
                    checked={lowTokenWarnings}
                    onCheckedChange={setLowTokenWarnings}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm font-medium">
                      {t('الملخص الأسبوعي', 'Weekly Summary')}
                    </Label>
                    <p className="text-[#8E8EA0] text-xs mt-1">
                      {t('ملخص أسبوعي لنشاطك', 'Weekly summary of your activity')}
                    </p>
                  </div>
                  <Switch
                    checked={weeklySummary}
                    onCheckedChange={setWeeklySummary}
                  />
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="w-full bg-[#19C37D] hover:bg-[#16B374] text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {t('حفظ التفضيلات', 'Save Preferences')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}