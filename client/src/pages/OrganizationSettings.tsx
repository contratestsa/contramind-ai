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
  HelpCircle, 
  Calendar,
  LogOut,
  Inbox,
  Globe,
  ChevronDown,
  ChevronRight,
  User,
  Building,
  Info,
  Edit,
  Trash2,
  AlertCircle,
  Menu
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface Signatory {
  id: string;
  nameAr: string;
  nameEn: string;
  position: string;
  email: string;
}

export default function OrganizationSettings() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(true);
  const [deleteSignatoryId, setDeleteSignatoryId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const isRTL = language === 'ar';

  // Form states
  const [companyNameAr, setCompanyNameAr] = useState('');
  const [companyNameEn, setCompanyNameEn] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [country, setCountry] = useState('saudi-arabia');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Mock signatories
  const [signatories, setSignatories] = useState<Signatory[]>([
    {
      id: '1',
      nameAr: 'أحمد محمد',
      nameEn: 'Ahmed Mohammed',
      position: 'Chief Executive Officer',
      email: 'ahmed@company.com'
    }
  ]);

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

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

  const handleSaveCompanyInfo = () => {
    if (!companyNameAr || !companyNameEn || !registrationNumber) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('يرجى ملء جميع الحقول المطلوبة', 'Please fill all required fields'),
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: t('تم حفظ معلومات الشركة', 'Company Info Saved'),
      description: t('تم تحديث معلومات الشركة بنجاح', 'Company information has been updated successfully')
    });
  };

  const handleAddSignatory = () => {
    toast({
      title: t('قريباً', 'Coming Soon'),
      description: t('إضافة المفوضين بالتوقيع قريباً', 'Adding signatories coming soon')
    });
  };

  const handleDeleteSignatory = (id: string) => {
    setSignatories(signatories.filter(s => s.id !== id));
    toast({
      title: t('تم الحذف', 'Deleted'),
      description: t('تم حذف المفوض بالتوقيع', 'Signatory has been deleted')
    });
    setDeleteSignatoryId(null);
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

  return (
    <div className={cn("min-h-screen flex bg-white", isRTL ? "flex-row-reverse" : "flex-row")}>
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-[200px] h-screen bg-[#F8F9FA] fixed z-50 transition-transform duration-300 md:translate-x-0",
        showMobileSidebar ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full",
        isRTL ? "right-0" : "left-0"
      )}>
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
                      setLocation(item.path);
                    } else if (item.path === '/settings/organization') {
                      // Already on organization settings
                      return;
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
      <div className={cn("flex-1", isRTL ? "md:mr-[200px]" : "md:ml-[200px]")}>
        {/* Top Header */}
        <header className="h-[60px] bg-white shadow-sm flex items-center justify-between px-4 md:px-6" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {/* Breadcrumb */}
          <div className={cn("text-xs md:text-sm text-gray-600 flex items-center", isRTL ? "text-right" : "text-left")}>
            {/* Mobile hamburger menu */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden mr-2"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <span>{t('الإعدادات', 'Settings')}</span>
            <span className="mx-2">{'>'}</span>
            <span className="text-[#0C2836] font-medium">{t('إعدادات المؤسسة', 'Organization Settings')}</span>
          </div>

          {/* Right side items */}
          <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
            {/* Inbox */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Inbox className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative notification-area">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
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
        <main className="p-4 md:p-6">
          {/* Alert Banner */}
          <div className={cn("bg-[#FFF3CD] border border-[#FFEAA7] rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
            <Info className="w-5 h-5 text-[#856404] flex-shrink-0" />
            <p className={cn("text-sm text-[#856404]", isRTL ? "text-right" : "text-left")}>
              {t('أكمل ملف تعريف مؤسستك لفتح جميع الميزات', 'Complete your organization profile to unlock all features')}
            </p>
          </div>

          {/* Company Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-5">
            <h2 className={cn("text-lg md:text-xl font-semibold text-[#0C2836] mb-4 md:mb-6", isRTL ? "text-right" : "text-left")}>
              {t('معلومات الشركة', 'Company Information')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('اسم الشركة (بالعربية)', 'Company Name (Arabic)')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyNameAr}
                  onChange={(e) => setCompanyNameAr(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    "text-right"
                  )}
                  dir="rtl"
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('اسم الشركة (بالإنجليزية)', 'Company Name (English)')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyNameEn}
                  onChange={(e) => setCompanyNameEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836] text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('رقم السجل التجاري', 'Registration Number')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('الرقم الضريبي', 'VAT Number')}
                </label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('الدولة', 'Country')}
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saudi-arabia">{t('المملكة العربية السعودية', 'Saudi Arabia')}</SelectItem>
                    <SelectItem value="uae">{t('الإمارات العربية المتحدة', 'United Arab Emirates')}</SelectItem>
                    <SelectItem value="kuwait">{t('الكويت', 'Kuwait')}</SelectItem>
                    <SelectItem value="qatar">{t('قطر', 'Qatar')}</SelectItem>
                    <SelectItem value="bahrain">{t('البحرين', 'Bahrain')}</SelectItem>
                    <SelectItem value="oman">{t('عمان', 'Oman')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('المدينة', 'City')}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className={cn("block text-sm font-medium text-gray-700 mb-1", isRTL ? "text-right" : "text-left")}>
                  {t('العنوان', 'Address')}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>
            </div>

            <div className={cn("flex justify-end mt-6", isRTL ? "flex-row-reverse" : "")}>
              <button
                onClick={handleSaveCompanyInfo}
                className="px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors"
              >
                {t('حفظ معلومات الشركة', 'Save Company Info')}
              </button>
            </div>
          </div>

          {/* Authorized Signatories */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-5">
            <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 md:mb-6", isRTL ? "md:flex-row-reverse" : "")}>
              <h2 className={cn("text-lg md:text-xl font-semibold text-[#0C2836]", isRTL ? "text-right" : "text-left")}>
                {t('المفوضون بالتوقيع', 'Authorized Signatories')}
              </h2>
              <button
                onClick={handleAddSignatory}
                className="px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors"
              >
                {t('إضافة مفوض', 'Add Signatory')}
              </button>
            </div>

            {signatories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={cn("px-4 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")}>
                        {t('الاسم (عربي/إنجليزي)', 'Name (AR/EN)')}
                      </th>
                      <th className={cn("px-4 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")}>
                        {t('المنصب', 'Position')}
                      </th>
                      <th className={cn("px-4 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")}>
                        {t('البريد الإلكتروني', 'Email')}
                      </th>
                      <th className={cn("px-4 py-3 text-sm font-medium text-gray-700 text-center")}>
                        {t('الإجراءات', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {signatories.map((signatory) => (
                      <tr key={signatory.id} className="border-t">
                        <td className={cn("px-4 py-3", isRTL ? "text-right" : "text-left")}>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{signatory.nameAr}</p>
                            <p className="text-sm text-gray-500">{signatory.nameEn}</p>
                          </div>
                        </td>
                        <td className={cn("px-4 py-3 text-sm text-gray-600", isRTL ? "text-right" : "text-left")}>
                          {signatory.position}
                        </td>
                        <td className={cn("px-4 py-3 text-sm text-gray-600", isRTL ? "text-right" : "text-left")}>
                          {signatory.email}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t('تعديل المفوض قريباً', 'Edit signatory coming soon') })}
                              className="text-[#0C2836] hover:bg-gray-100 p-1 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteSignatoryId(signatory.id)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={cn("text-sm text-gray-500", isRTL ? "text-right" : "text-left")}>
                {t('لا يوجد مفوضون بالتوقيع', 'No authorized signatories')}
              </p>
            )}
          </div>

          {/* Subscription & Tokens */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className={cn("text-lg md:text-xl font-semibold text-[#0C2836] mb-4 md:mb-6", isRTL ? "text-right" : "text-left")}>
              {t('الاشتراك والرصيد', 'Subscription & Tokens')}
            </h2>

            <div className="space-y-4">
              <div className={cn("flex items-center justify-between py-3 border-b", isRTL ? "flex-row-reverse" : "")}>
                <span className="text-sm font-medium text-gray-700">{t('الخطة الحالية', 'Current Plan')}</span>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                  {t('نسخة تجريبية مجانية', 'Free Trial')}
                </span>
              </div>

              <div className={cn("flex items-center justify-between py-3 border-b", isRTL ? "flex-row-reverse" : "")}>
                <span className="text-sm font-medium text-gray-700">{t('رصيد التوكنات', 'Token Balance')}</span>
                <span className="text-lg font-semibold text-[#0C2836]">988 {t('توكن', 'Tokens')}</span>
              </div>

              <div className="py-3">
                <div className={cn("flex items-center justify-between mb-2", isRTL ? "flex-row-reverse" : "")}>
                  <span className="text-sm font-medium text-gray-700">{t('الاستخدام الشهري', 'Monthly Usage')}</span>
                  <span className="text-sm text-gray-500">12/1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0C2836] h-2 rounded-full" style={{ width: '1.2%' }} />
                </div>
              </div>

              <div className={cn("flex gap-4 pt-4", isRTL ? "flex-row-reverse" : "")}>
                <button
                  onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t('شراء التوكنات قريباً', 'Purchase tokens coming soon') })}
                  className="px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors"
                >
                  {t('شراء توكنات', 'Purchase Tokens')}
                </button>
                <button
                  onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t('سجل الاستخدام قريباً', 'Usage history coming soon') })}
                  className="px-4 py-2 text-[#0C2836] hover:underline"
                >
                  {t('عرض سجل الاستخدام', 'View Usage History')}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSignatoryId} onOpenChange={() => setDeleteSignatoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('تأكيد الحذف', 'Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('هل أنت متأكد من حذف هذا المفوض بالتوقيع؟', 'Are you sure you want to delete this signatory?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('إلغاء', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteSignatoryId && handleDeleteSignatory(deleteSignatoryId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('حذف', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}