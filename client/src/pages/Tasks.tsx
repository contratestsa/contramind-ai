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
  LogOut,
  Globe,
  ChevronRight,
  User,
  Building,
  Menu,
  Clock,
  Edit,
  Eye,
  AlertCircle,
  FileCheck,
  Users,
  Calendar,
  MessageSquare,
  Filter
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

interface ContractTask {
  id: string;
  contractName: string;
  contractNameAr: string;
  parties: string[];
  status: 'draft' | 'under-review' | 'pending-approval' | 'revision-requested';
  daysInRevision: number;
  assignedTo: string;
  progress: number;
  deadline?: string;
  lastActivity: string;
  revisionCount: number;
  priority: 'high' | 'medium' | 'low';
  comments?: number;
}

export default function Tasks() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(location.startsWith('/settings'));
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const isRTL = language === 'ar';

  // Mock contract tasks data
  const contractTasks: ContractTask[] = [
    {
      id: '1',
      contractName: 'Service Agreement - Tech Solutions',
      contractNameAr: 'اتفاقية خدمات - حلول تقنية',
      parties: ['ContraMind', 'Tech Solutions Ltd'],
      status: 'under-review',
      daysInRevision: 3,
      assignedTo: 'Ahmed Mohammed',
      progress: 65,
      deadline: '2025-07-15',
      lastActivity: '2 hours ago',
      revisionCount: 2,
      priority: 'high',
      comments: 5
    },
    {
      id: '2',
      contractName: 'Distribution Agreement - Global Exports',
      contractNameAr: 'اتفاقية توزيع - صادرات عالمية',
      parties: ['ContraMind', 'Global Exports Inc'],
      status: 'revision-requested',
      daysInRevision: 7,
      assignedTo: 'Sarah Abdullah',
      progress: 40,
      deadline: '2025-07-18',
      lastActivity: '5 hours ago',
      revisionCount: 3,
      priority: 'medium',
      comments: 12
    },
    {
      id: '3',
      contractName: 'Employment Contract - Senior Developer',
      contractNameAr: 'عقد عمل - مطور أول',
      parties: ['ContraMind', 'John Smith'],
      status: 'pending-approval',
      daysInRevision: 1,
      assignedTo: 'Legal Team',
      progress: 90,
      lastActivity: '30 minutes ago',
      revisionCount: 1,
      priority: 'low'
    },
    {
      id: '4',
      contractName: 'Partnership Agreement - Innovation Hub',
      contractNameAr: 'اتفاقية شراكة - مركز الابتكار',
      parties: ['ContraMind', 'Innovation Hub MENA'],
      status: 'draft',
      daysInRevision: 10,
      assignedTo: 'Mohammed Al-Rashid',
      progress: 25,
      deadline: '2025-07-20',
      lastActivity: '1 day ago',
      revisionCount: 0,
      priority: 'high',
      comments: 8
    }
  ];

  // Fetch user data
  const { data: userData, isLoading } = useQuery<{ user: User }>({
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

  const getStatusBadge = (status: ContractTask['status']) => {
    const statusConfig = {
      'draft': { 
        color: 'bg-gray-100 text-gray-700', 
        label: { ar: 'مسودة', en: 'Draft' } 
      },
      'under-review': { 
        color: 'bg-blue-100 text-blue-700', 
        label: { ar: 'قيد المراجعة', en: 'Under Review' } 
      },
      'pending-approval': { 
        color: 'bg-yellow-100 text-yellow-700', 
        label: { ar: 'في انتظار الموافقة', en: 'Pending Approval' } 
      },
      'revision-requested': { 
        color: 'bg-orange-100 text-orange-700', 
        label: { ar: 'مطلوب مراجعة', en: 'Revision Requested' } 
      }
    };

    const config = statusConfig[status];
    return (
      <Badge className={cn("font-normal", config.color)}>
        {t(config.label.ar, config.label.en)}
      </Badge>
    );
  };

  const getPriorityIcon = (priority: ContractTask['priority']) => {
    if (priority === 'high') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (priority === 'medium') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  const filteredTasks = contractTasks.filter(task => {
    if (filterCategory !== 'all') {
      if (filterCategory === 'under-revision' && !['draft', 'under-review', 'revision-requested'].includes(task.status)) return false;
      if (filterCategory === 'pending-review' && task.status !== 'pending-approval') return false;
      if (filterCategory === 'upcoming-deadlines' && !task.deadline) return false;
    }
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    return true;
  });

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
        "w-[200px] h-screen bg-[#F8F9FA] fixed z-50 transition-transform duration-300 md:translate-x-0 shadow-2xl",
        showMobileSidebar ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full",
        isRTL ? "right-0 shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.1)]" : "left-0 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.1)]"
      )}>
        {/* Logo */}
        <div className="h-[80px] flex items-center bg-[#0C2836]">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* My Work Section */}
        <div className="bg-white text-[#0C2836] px-5 py-3 border-b border-gray-200">
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
                    } else if (item.path === '/dashboard' || item.path === '/repository' || item.path === '/tasks') {
                      setLocation(item.path);
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
                    item.path === '/tasks' && "bg-[#E6E6E6]"
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
      <div className={cn("flex-1", isRTL ? "md:mr-[200px]" : "md:ml-[200px]")}>
        {/* Top Header */}
        <header className="h-[60px] bg-white shadow-sm flex items-center justify-between px-4 md:px-6" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {/* Breadcrumb */}
          <div className={cn("text-xs md:text-sm text-gray-600 flex items-center", isRTL ? "text-right" : "text-left")}>
            {/* Mobile hamburger menu */}
            <button
              className={cn("p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden", isRTL ? "ml-2" : "mr-2")}
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-[#0C2836] font-medium">{t('المهام', 'Tasks')}</span>
          </div>

          {/* Right side items */}
          <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
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
                  <div className={cn("p-3 border-b border-[#E6E6E6]", isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm font-normal text-gray-800">
                      {t('تم طلب مراجعة للعقد', 'Contract revision requested')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('قبل ساعتين', '2 hours ago')}
                    </p>
                  </div>
                  
                  <div className={cn("p-3", isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm font-normal text-gray-800">
                      {t('عقد جديد بانتظار المراجعة', 'New contract pending review')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
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
          {/* Page Title and Stats */}
          <div className="mb-6">
            <h1 className={cn("text-2xl font-bold text-[#0C2836] mb-4", isRTL ? "text-right" : "text-left")}>
              {t('إدارة المهام', 'Task Management')}
            </h1>
            
            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm text-gray-600">{t('قيد المراجعة', 'Under Revision')}</p>
                    <p className="text-xl font-semibold text-[#0C2836]">4</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm text-gray-600">{t('في انتظار الموافقة', 'Pending Approval')}</p>
                    <p className="text-xl font-semibold text-[#0C2836]">1</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm text-gray-600">{t('عالية الأولوية', 'High Priority')}</p>
                    <p className="text-xl font-semibold text-[#0C2836]">2</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm text-gray-600">{t('مكتملة هذا الأسبوع', 'Completed This Week')}</p>
                    <p className="text-xl font-semibold text-[#0C2836]">7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={cn("flex flex-col md:flex-row gap-4 mb-6", isRTL ? "md:flex-row-reverse" : "")}>
            <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t('تصفية:', 'Filter:')}</span>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className={cn("w-[200px]", isRTL ? "text-right" : "text-left")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('جميع المهام', 'All Tasks')}</SelectItem>
                <SelectItem value="under-revision">{t('قيد المراجعة', 'Under Revision')}</SelectItem>
                <SelectItem value="pending-review">{t('في انتظار المراجعة', 'Pending Review')}</SelectItem>
                <SelectItem value="upcoming-deadlines">{t('مواعيد قريبة', 'Upcoming Deadlines')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className={cn("w-[200px]", isRTL ? "text-right" : "text-left")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('جميع الحالات', 'All Statuses')}</SelectItem>
                <SelectItem value="draft">{t('مسودة', 'Draft')}</SelectItem>
                <SelectItem value="under-review">{t('قيد المراجعة', 'Under Review')}</SelectItem>
                <SelectItem value="pending-approval">{t('في انتظار الموافقة', 'Pending Approval')}</SelectItem>
                <SelectItem value="revision-requested">{t('مطلوب مراجعة', 'Revision Requested')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Cards */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                <div className={cn("flex flex-col md:flex-row justify-between gap-4", isRTL ? "md:flex-row-reverse" : "")}>
                  {/* Left side - Contract Info */}
                  <div className="flex-1">
                    <div className={cn("flex items-start gap-3 mb-3", isRTL ? "flex-row-reverse" : "")}>
                      {getPriorityIcon(task.priority)}
                      <div className="flex-1">
                        <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-1", isRTL ? "text-right" : "text-left")}>
                          {t(task.contractNameAr, task.contractName)}
                        </h3>
                        <div className={cn("flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2", isRTL ? "flex-row-reverse" : "")}>
                          <Users className="w-4 h-4" />
                          <span>{task.parties.join(' • ')}</span>
                        </div>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className={cn("flex justify-between items-center mb-1", isRTL ? "flex-row-reverse" : "")}>
                        <span className="text-sm text-gray-600">{t('التقدم', 'Progress')}</span>
                        <span className="text-sm font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    
                    {/* Task Meta */}
                    <div className={cn("flex flex-wrap gap-4 text-sm text-gray-600", isRTL ? "flex-row-reverse" : "")}>
                      <div className={cn("flex items-center gap-1", isRTL ? "flex-row-reverse" : "")}>
                        <User className="w-4 h-4" />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className={cn("flex items-center gap-1", isRTL ? "flex-row-reverse" : "")}>
                        <Clock className="w-4 h-4" />
                        <span>{t(`منذ ${task.daysInRevision} أيام`, `${task.daysInRevision} days in revision`)}</span>
                      </div>
                      {task.deadline && (
                        <div className={cn("flex items-center gap-1", isRTL ? "flex-row-reverse" : "")}>
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className={cn("flex items-center gap-1", isRTL ? "flex-row-reverse" : "")}>
                        <Edit className="w-4 h-4" />
                        <span>{t(`${task.revisionCount} مراجعات`, `${task.revisionCount} revisions`)}</span>
                      </div>
                      {task.comments && (
                        <div className={cn("flex items-center gap-1", isRTL ? "flex-row-reverse" : "")}>
                          <MessageSquare className="w-4 h-4" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side - Actions */}
                  <div className={cn("flex gap-2", isRTL ? "flex-row-reverse" : "")}>
                    <button
                      onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t('عرض العقد قريباً', 'View contract coming soon') })}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline">{t('عرض', 'View')}</span>
                    </button>
                    <button
                      onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t('متابعة التحرير قريباً', 'Continue editing coming soon') })}
                      className="px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#0A1F2B] transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden md:inline">{t('متابعة التحرير', 'Continue Editing')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className={cn("text-center py-12", isRTL ? "text-right" : "text-left")}>
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">{t('لا توجد مهام مطابقة للفلاتر المحددة', 'No tasks match the selected filters')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}