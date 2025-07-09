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
  Clock,
  AlertTriangle,
  Search,
  Download,
  Eye,
  Trash2,
  FileText,
  ChevronRight,
  User,
  Building
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
  fullName?: string;
  profilePicture?: string;
}

interface Contract {
  id: string;
  name: string;
  partyRole: string;
  uploadDate: string;
  riskScore: number | null;
  status: 'analyzed' | 'analyzing' | 'uploaded';
  riskLevel?: 'low' | 'medium' | 'high';
}

export default function Repository() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteContractId, setDeleteContractId] = useState<string | null>(null);
  const [expandedSettings, setExpandedSettings] = useState(location.startsWith('/settings'));
  const isRTL = language === 'ar';

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Mock contracts data
  const contracts: Contract[] = [
    {
      id: '1',
      name: 'TechVendor_Agreement_2024.pdf',
      partyRole: 'Service Provider',
      uploadDate: 'Today, 2:30 PM',
      riskScore: 45,
      status: 'analyzed',
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'CloudServices_Contract.docx',
      partyRole: 'Service Recipient',
      uploadDate: 'Yesterday',
      riskScore: 72,
      status: 'analyzed',
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Maintenance_Agreement.pdf',
      partyRole: 'Service Provider',
      uploadDate: '2 days ago',
      riskScore: null,
      status: 'analyzing',
    }
  ];

  // Calculate summary stats
  const totalContracts = contracts.length;
  const analyzedContracts = contracts.filter(c => c.status === 'analyzed').length;
  const analyzingContracts = contracts.filter(c => c.status === 'analyzing').length;
  const highRiskContracts = contracts.filter(c => c.riskLevel === 'high').length;

  // Filter and sort contracts
  const filteredContracts = contracts
    .filter(contract => {
      const matchesSearch = contract.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return 0; // In real app, compare dates
      } else if (sortBy === 'oldest') {
        return 0; // In real app, compare dates
      } else if (sortBy === 'risk') {
        return (b.riskScore || 0) - (a.riskScore || 0);
      }
      return 0;
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

  const handleView = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract?.status === 'analyzed') {
      // In real app, navigate to analysis results
      toast({
        title: t('عرض نتائج التحليل', 'View Analysis Results'),
        description: t('الانتقال إلى صفحة النتائج...', 'Navigating to results page...')
      });
    }
  };

  const handleDownload = (contractId: string) => {
    toast({
      title: t('تنزيل التقرير', 'Download Report'),
      description: t('سيتم خصم 2 توكن', 'Will deduct 2 tokens')
    });
  };

  const handleDelete = (contractId: string) => {
    setDeleteContractId(contractId);
  };

  const confirmDelete = () => {
    if (deleteContractId) {
      toast({
        title: t('تم حذف العقد', 'Contract Deleted'),
        description: t('تم حذف العقد بنجاح', 'Contract deleted successfully')
      });
      setDeleteContractId(null);
    }
  };

  const getRiskDotColor = (riskScore: number | null, riskLevel?: string) => {
    if (!riskScore) return 'bg-gray-400';
    if (riskLevel === 'high' || riskScore >= 70) return 'bg-red-500';
    if (riskLevel === 'medium' || riskScore >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-green-100 text-green-700';
      case 'analyzing':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
                      // Already on repository page
                      return;
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
                    item.path === '/repository' && "bg-[#E6E6E6]"
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
          {/* Breadcrumb */}
          <div className={cn("text-sm text-gray-600", isRTL ? "text-right" : "text-left")}>
            <span className="text-[#0C2836] font-medium">{t('المستودع', 'Repository')}</span>
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
          {/* Page Title */}
          <div className="mb-6">
            <h1 className={cn("text-2xl font-bold text-[#0C2836] mb-2", isRTL ? "text-right" : "text-left")}>
              {t('مستودع العقود', 'Contract Repository')}
            </h1>
            <p className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}>
              {t('إدارة ومراجعة جميع عقودك', 'Manage and review all your contracts')}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Total Contracts */}
            <div className="bg-white border border-[#E6E6E6] rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                <Folder className="w-8 h-8 text-gray-600" />
                <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  <p className="text-2xl font-bold text-[#0C2836]">{totalContracts}</p>
                  <p className="text-sm text-gray-600">{t('إجمالي العقود', 'Total Contracts')}</p>
                </div>
              </div>
            </div>

            {/* Analyzed */}
            <div className="bg-white border border-[#E6E6E6] rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  <p className="text-2xl font-bold text-[#0C2836]">{analyzedContracts}</p>
                  <p className="text-sm text-gray-600">{t('تم التحليل', 'Analyzed')}</p>
                </div>
              </div>
            </div>

            {/* Analyzing */}
            <div className="bg-white border border-[#E6E6E6] rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                <Clock className="w-8 h-8 text-orange-600" />
                <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  <p className="text-2xl font-bold text-[#0C2836]">{analyzingContracts}</p>
                  <p className="text-sm text-gray-600">{t('قيد التحليل', 'Analyzing')}</p>
                </div>
              </div>
            </div>

            {/* High Risk */}
            <div className="bg-white border border-[#E6E6E6] rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  <p className="text-2xl font-bold text-[#0C2836]">{highRiskContracts}</p>
                  <p className="text-sm text-gray-600">{t('مخاطر عالية', 'High Risk')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className={cn("flex gap-4 mb-6", isRTL ? "flex-row-reverse" : "")}>
            {/* Search */}
            <div className="relative w-[300px]">
              <Search className={cn("absolute top-3 w-4 h-4 text-gray-400", isRTL ? "right-3" : "left-3")} />
              <input
                type="text"
                placeholder={t('البحث في العقود...', 'Search contracts...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2836]",
                  isRTL ? "text-right" : "text-left"
                )}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('جميع الحالات', 'All Statuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                <SelectItem value="analyzed">{t('تم التحليل', 'Analyzed')}</SelectItem>
                <SelectItem value="analyzing">{t('قيد التحليل', 'Analyzing')}</SelectItem>
                <SelectItem value="uploaded">{t('تم الرفع', 'Uploaded')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('الأحدث أولاً', 'Newest First')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('الأحدث أولاً', 'Newest First')}</SelectItem>
                <SelectItem value="oldest">{t('الأقدم أولاً', 'Oldest First')}</SelectItem>
                <SelectItem value="risk">{t('مستوى المخاطر', 'Risk Level')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contracts Table */}
          {filteredContracts.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={cn("px-6 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")} style={{ width: '40%' }}>
                      {t('اسم العقد', 'Contract Name')}
                    </th>
                    <th className={cn("px-6 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")} style={{ width: '15%' }}>
                      {t('دور الطرف', 'Party Role')}
                    </th>
                    <th className={cn("px-6 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")} style={{ width: '15%' }}>
                      {t('تاريخ الرفع', 'Upload Date')}
                    </th>
                    <th className={cn("px-6 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")} style={{ width: '15%' }}>
                      {t('نسبة المخاطر', 'Risk Score')}
                    </th>
                    <th className={cn("px-6 py-3 text-sm font-medium text-gray-700", isRTL ? "text-right" : "text-left")} style={{ width: '15%' }}>
                      {t('الحالة', 'Status')}
                    </th>
                    <th className={cn("px-6 py-3 text-sm font-medium text-gray-700 text-center")}>
                      {t('الإجراءات', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="border-t hover:bg-gray-50">
                      <td className={cn("px-6 py-4", isRTL ? "text-right" : "text-left")}>
                        <span className="text-sm font-medium text-gray-900">{contract.name}</span>
                      </td>
                      <td className={cn("px-6 py-4", isRTL ? "text-right" : "text-left")}>
                        <span className="text-sm text-gray-600">
                          {contract.partyRole === 'Service Provider' 
                            ? t('مقدم الخدمة', 'Service Provider')
                            : t('متلقي الخدمة', 'Service Recipient')
                          }
                        </span>
                      </td>
                      <td className={cn("px-6 py-4", isRTL ? "text-right" : "text-left")}>
                        <span className="text-sm text-gray-600">
                          {contract.uploadDate.includes('Today') 
                            ? t('اليوم، 2:30 م', contract.uploadDate)
                            : contract.uploadDate.includes('Yesterday')
                            ? t('أمس', contract.uploadDate)
                            : t('منذ يومين', contract.uploadDate)
                          }
                        </span>
                      </td>
                      <td className={cn("px-6 py-4", isRTL ? "text-right" : "text-left")}>
                        <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
                          {contract.riskScore ? (
                            <>
                              <span className={cn("w-2 h-2 rounded-full", getRiskDotColor(contract.riskScore, contract.riskLevel))} />
                              <span className="text-sm font-medium">{contract.riskScore}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className={cn("px-6 py-4", isRTL ? "text-right" : "text-left")}>
                        <span className={cn(
                          "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                          getStatusBadgeClasses(contract.status)
                        )}>
                          {contract.status === 'analyzed' 
                            ? t('تم التحليل', 'Analyzed')
                            : contract.status === 'analyzing'
                            ? t('قيد التحليل', 'Analyzing')
                            : t('تم الرفع', 'Uploaded')
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(contract.id)}
                            disabled={contract.status !== 'analyzed'}
                            className={cn(
                              "flex items-center gap-1 px-3 py-1 text-sm rounded",
                              contract.status === 'analyzed'
                                ? "text-[#0C2836] hover:bg-gray-100"
                                : "text-gray-400 cursor-not-allowed"
                            )}
                          >
                            <Eye className="w-4 h-4" />
                            {t('عرض', 'View')}
                          </button>
                          <button
                            onClick={() => handleDownload(contract.id)}
                            disabled={contract.status !== 'analyzed'}
                            className={cn(
                              "flex items-center gap-1 px-3 py-1 text-sm rounded",
                              contract.status === 'analyzed'
                                ? "text-[#0C2836] hover:bg-gray-100"
                                : "text-gray-400 cursor-not-allowed"
                            )}
                          >
                            <Download className="w-4 h-4" />
                            {t('تنزيل', 'Download')}
                          </button>
                          <button
                            onClick={() => handleDelete(contract.id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('حذف', 'Delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('لم يتم رفع أي عقود بعد', 'No contracts uploaded yet')}
              </h3>
              <button
                onClick={() => setLocation('/dashboard')}
                className="mt-4 px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors"
              >
                {t('رفع عقدك الأول', 'Upload your first contract')}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteContractId} onOpenChange={() => setDeleteContractId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('تأكيد الحذف', 'Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('هل أنت متأكد من حذف هذا العقد؟ لا يمكن التراجع عن هذا الإجراء.', 
                'Are you sure you want to delete this contract? This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('إلغاء', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('حذف', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}