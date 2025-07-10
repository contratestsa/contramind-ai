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
  HelpCircle, 
  Calendar,
  LogOut,
  Inbox,
  Globe,
  AlertTriangle,
  DollarSign,
  FileX,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  Building
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';

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

interface Finding {
  type: string;
  severity: string;
  clause: string;
  description: string;
}

interface AnalysisResult {
  riskScore: number;
  riskLevel: string;
  findings: Finding[];
}

export default function AnalysisResults() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedFindings, setExpandedFindings] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [expandedSettings, setExpandedSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const isRTL = language === 'ar';

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

  // Load analysis result from sessionStorage
  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    const storedParty = sessionStorage.getItem('selectedParty');
    
    if (storedResult) {
      setAnalysisResult(JSON.parse(storedResult));
    }
    if (storedParty) {
      setSelectedParty(storedParty);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (error || (!isLoading && !userData?.user)) {
      setLocation('/');
    }
  }, [error, isLoading, userData, setLocation]);

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

  const toggleFinding = (index: number) => {
    setExpandedFindings(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getPartyLabel = (party: string) => {
    const labels = {
      buyer: { ar: "متلقي الخدمة", en: "Service Recipient" },
      vendor: { ar: "مقدم الخدمة", en: "Service Provider" },
      neutral: { ar: "تحليل عام", en: "General Analysis" }
    };
    return labels[party as keyof typeof labels] || { ar: "غير محدد", en: "Not specified" };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return '#DC3545';
      case 'medium': return '#FFC107';
      case 'low': return '#28A745';
      default: return '#6C757D';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'liability': return <AlertTriangle className="w-5 h-5" />;
      case 'payment': return <DollarSign className="w-5 h-5" />;
      case 'termination': return <FileX className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getRecommendation = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': 
        return t(
          'إجراء فوري مطلوب. فكر في التفاوض على هذا البند.',
          'Immediate action recommended. Consider negotiating this clause.'
        );
      case 'medium': 
        return t(
          'راجع مع المستشار القانوني. قد تحتاج إلى تعديل.',
          'Review with legal counsel. May need adjustment.'
        );
      case 'low': 
        return t(
          'بند قياسي. لا يتطلب أي إجراء.',
          'Standard clause. No action needed.'
        );
      default: return '';
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: t('قريباً', 'Coming Soon'),
      description: t('ميزة تنزيل التقرير قادمة قريباً', 'Report download feature coming soon')
    });
  };

  if (isLoading || !analysisResult) {
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

  // Calculate gauge angle based on risk score (0-180 degrees)
  const gaugeAngle = (analysisResult.riskScore / 100) * 180;

  return (
    <div className={cn("min-h-screen flex bg-white", isRTL ? "flex-row-reverse" : "flex-row")}>
      {/* Sidebar */}
      <div className={cn("w-[200px] h-screen bg-[#F8F9FA] fixed z-10", isRTL ? "right-0" : "left-0")}>
        {/* Logo */}
        <div className="h-[80px] flex items-center bg-white">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="w-full h-full object-contain"
          />
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
                    } else if (item.path === '/tasks') {
                      setLocation('/tasks');
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
          {/* Breadcrumb */}
          <div className={cn("text-sm text-gray-600", isRTL ? "text-right" : "text-left")}>
            <button onClick={() => setLocation('/dashboard')} className="hover:text-[#0C2836]">
              {t('لوحة القيادة', 'Dashboard')}
            </button>
            <span className="mx-2">›</span>
            <span>{t('التحميل والمراجعة', 'Upload & Review')}</span>
            <span className="mx-2">›</span>
            <span className="text-[#0C2836] font-medium">{t('النتائج', 'Results')}</span>
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
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Contract Name and Party Badge */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#0C2836] mb-2">
                {t('عقد_تقني.pdf', 'technology_contract.pdf')}
              </h1>
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-[#E8F4F8] text-[#0C2836]">
                {t('تم التحليل كـ: ', 'Analyzed as: ')}
                {t(getPartyLabel(selectedParty).ar, getPartyLabel(selectedParty).en)}
              </span>
            </div>

            {/* Risk Score Gauge */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative w-[200px] h-[100px] mb-4">
                {/* Gauge Background */}
                <svg width="200" height="100" viewBox="0 0 200 100" className="absolute">
                  {/* Background arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#E6E6E6"
                    strokeWidth="20"
                  />
                  {/* Colored zones */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 80 30"
                    fill="none"
                    stroke="#28A745"
                    strokeWidth="20"
                  />
                  <path
                    d="M 80 30 A 80 80 0 0 1 160 50"
                    fill="none"
                    stroke="#FFC107"
                    strokeWidth="20"
                  />
                  <path
                    d="M 160 50 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#DC3545"
                    strokeWidth="20"
                  />
                  {/* Needle */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="20"
                    stroke="#0C2836"
                    strokeWidth="3"
                    transform={`rotate(${gaugeAngle - 90} 100 100)`}
                    className="transition-transform duration-1000"
                  />
                  <circle cx="100" cy="100" r="6" fill="#0C2836" />
                </svg>
                {/* Score Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#0C2836] mt-8">
                    {analysisResult.riskScore}
                  </span>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-700">
                {t('درجة المخاطر: متوسطة', 'Risk Score: Medium')}
              </p>
            </div>

            {/* Key Findings Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#0C2836] mb-2">
                {t('نتائج تحليل العقد', 'Contract Analysis Findings')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('بناءً على دورك كـ ', 'Based on your role as ')}
                {t(getPartyLabel(selectedParty).ar, getPartyLabel(selectedParty).en)}
              </p>

              {/* Findings Cards */}
              <div className="space-y-4">
                {analysisResult.findings.map((finding, index) => (
                  <div
                    key={index}
                    className="bg-white border border-[#E6E6E6] rounded-lg overflow-hidden"
                    style={{ borderLeftWidth: '4px', borderLeftColor: getSeverityColor(finding.severity) }}
                  >
                    <div className="p-5">
                      {/* Top Row */}
                      <div className={cn(
                        "flex items-center justify-between mb-3",
                        isRTL ? "flex-row-reverse" : ""
                      )}>
                        <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                          <span
                            className="px-2 py-1 text-xs font-medium rounded"
                            style={{ 
                              backgroundColor: `${getSeverityColor(finding.severity)}20`,
                              color: getSeverityColor(finding.severity)
                            }}
                          >
                            {t(
                              finding.severity === 'high' ? 'عالي' : finding.severity === 'medium' ? 'متوسط' : 'منخفض',
                              finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)
                            )}
                          </span>
                          <span className="text-sm text-gray-600">{finding.clause}</span>
                        </div>
                        {getTypeIcon(finding.type)}
                      </div>

                      {/* Description */}
                      <p className="text-base text-gray-700 mb-3">{finding.description}</p>

                      {/* Expandable Recommendations */}
                      <button
                        onClick={() => toggleFinding(index)}
                        className={cn(
                          "flex items-center gap-2 text-sm text-[#0C2836] hover:underline",
                          isRTL ? "flex-row-reverse" : ""
                        )}
                      >
                        {t('عرض التوصيات', 'View Recommendations')}
                        {expandedFindings.includes(index) ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </button>

                      {expandedFindings.includes(index) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
                          {getRecommendation(finding.severity)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-4">
              {/* Primary Button */}
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-6 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Download className="w-5 h-5" />
                {t('تنزيل التقرير (2 توكن)', 'Download Report (2 tokens)')}
              </button>

              {/* Secondary Buttons */}
              <div className={cn("flex gap-4", isRTL ? "flex-row-reverse" : "")}>
                <button
                  onClick={() => toast({ title: t('قريباً', 'Coming Soon') })}
                  className="px-6 py-2 border border-[#0C2836] text-[#0C2836] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('عرض في المستودع', 'View in Repository')}
                </button>
                <button
                  onClick={() => setLocation('/dashboard')}
                  className="text-[#0C2836] hover:underline"
                >
                  {t('تحليل عقد آخر', 'Analyze Another Contract')}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}