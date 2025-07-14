import { useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Plus,
  Settings,
  HelpCircle,
  Menu,
  X,
  Send,
  FileText,
  Upload,
  ChevronRight,
  Copy,
  User,
  LogOut,
  Paperclip,
  Search,
  BarChart3,
  Users,
  Bell,
  Tag,
  BookOpen,
  Info,
  MessageSquare,
  ChevronDown,
  Star,
  Globe
} from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';
import iconImage from '@assets/Profile Picture - ContraMind (V001)-1_1752437530152.png';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ProfileDropdown from "@/components/ProfileDropdown";
import { queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  profilePicture?: string;
  onboardingCompleted: boolean;
  companyNameEn?: string;
  companyNameAr?: string;
  country?: string;
  contractRole?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: 'analytics' | 'parties' | 'notifications' | 'tags';
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const { t, language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isRTL = language === 'ar';
  
  // Dynamic sidebar width for layout calculations
  const sidebarWidth = isSidebarCollapsed ? 60 : 260;

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const user = userData?.user || {
    id: 0,
    username: '',
    email: '',
    fullName: '',
    emailVerified: false,
  };

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setLocation('/');
    },
    onError: () => {
      toast({
        title: t('حدث خطأ', 'Error occurred'),
        description: t('فشل تسجيل الخروج', 'Logout failed'),
        variant: "destructive"
      });
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className={cn("flex h-screen bg-[#f9fafb] overflow-hidden", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <div
        className={cn(
          "bg-[#0C2836] flex flex-col transition-all duration-300 z-20 relative",
          isSidebarCollapsed ? "w-[60px]" : "w-[260px]",
          "lg:relative lg:translate-x-0",
          showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "fixed inset-y-0",
          isRTL ? "right-0" : "left-0"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-3 border-b border-[rgba(183,222,232,0.2)]">
          <div className={cn(
            "flex items-center transition-all duration-300",
            isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1"
          )}>
            <img 
              src={logoImage} 
              alt="ContraMind" 
              className="h-10 w-full object-contain"
            />
          </div>
          
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-all duration-200 group relative hidden lg:block"
          >
            <div className="w-5 h-5 relative">
              {/* Hamburger Lines */}
              <div className={cn(
                "absolute inset-0 transition-all duration-300",
                isSidebarCollapsed ? "opacity-0 scale-75" : "opacity-100 scale-100"
              )}>
                <span className="absolute block h-0.5 w-5 bg-[#B7DEE8] transform -translate-y-1.5 top-2 transition-all duration-300" />
                <span className="absolute block h-0.5 w-5 bg-[#B7DEE8] top-2 transition-all duration-300" />
                <span className="absolute block h-0.5 w-5 bg-[#B7DEE8] transform translate-y-1.5 top-2 transition-all duration-300" />
              </div>
              
              {/* ContraMind Icon */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300",
                isSidebarCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}>
                <img 
                  src={iconImage} 
                  alt="ContraMind Icon" 
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="lg:hidden p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-[#B7DEE8]" />
          </button>
        </div>

        {/* New Contract Analysis Button */}
        <div className="p-3 border-b border-[rgba(183,222,232,0.2)]">
          <button
            onClick={() => setLocation('/dashboard')}
            className={cn(
              "w-full flex items-center gap-2 py-2.5 bg-[#B7DEE8] text-[#0C2836] rounded-md hover:bg-[#a5d0db] transition-all duration-200 font-medium shadow-sm hover:shadow-md",
              isSidebarCollapsed ? "justify-center px-2" : "justify-center px-4"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>{t('تحليل عقد جديد', 'New Contract Analysis')}</span>}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation Menu */}
          <nav className="px-3 py-3">
            <div className="space-y-1">
              <button
                onClick={() => setLocation('/analytics')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3",
                  currentPage === 'analytics' && "bg-[rgba(183,222,232,0.1)]"
                )}
                title={isSidebarCollapsed ? t('التحليلات والتقارير', 'Analytics & Reports') : undefined}
              >
                <BarChart3 className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm text-white">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/parties')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3",
                  currentPage === 'parties' && "bg-[rgba(183,222,232,0.1)]"
                )}
                title={isSidebarCollapsed ? t('الأطراف وجهات الاتصال', 'Parties & Contacts') : undefined}
              >
                <Users className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm text-white">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/notifications')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3",
                  currentPage === 'notifications' && "bg-[rgba(183,222,232,0.1)]"
                )}
                title={isSidebarCollapsed ? t('الإشعارات', 'Notifications') : undefined}
              >
                <Bell className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm text-white">{t('الإشعارات', 'Notifications')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/tags')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3",
                  currentPage === 'tags' && "bg-[rgba(183,222,232,0.1)]"
                )}
                title={isSidebarCollapsed ? t('العلامات والفئات', 'Tags & Categories') : undefined}
              >
                <Tag className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm text-white">{t('العلامات والفئات', 'Tags & Categories')}</span>}
              </button>
            </div>

            {/* Settings Section */}
            <div className="mt-6 pt-6 border-t border-[rgba(183,222,232,0.2)]">
              <button
                onClick={() => setLocation('/settings/personal')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('الإعدادات', 'Settings') : undefined}
              >
                <Settings className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm text-white">{t('الإعدادات', 'Settings')}</span>}
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-4">
              <button
                onClick={() => setLocation('/help')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('المساعدة', 'Help') : undefined}
              >
                <HelpCircle className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm text-white">{t('المساعدة', 'Help')}</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* Profile Section */}
        <div className="border-t border-[rgba(183,222,232,0.2)] p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
              isSidebarCollapsed ? "justify-center px-2" : "px-3"
            )}
            title={isSidebarCollapsed ? t('تسجيل الخروج', 'Sign Out') : undefined}
          >
            <LogOut className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
            {!isSidebarCollapsed && <span className="text-sm text-white">{t('تسجيل الخروج', 'Sign Out')}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Toggle - Outside sidebar */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className={cn(
          "lg:hidden fixed top-4 z-50 p-2 bg-[#0C2836] text-white rounded-md shadow-lg",
          isRTL ? "right-4" : "left-4",
          showMobileSidebar && "hidden"
        )}
      >
        <div className="w-5 h-5 relative">
          <span className="absolute block h-0.5 w-5 bg-current transform -translate-y-1.5" />
          <span className="absolute block h-0.5 w-5 bg-current transform top-2" />
          <span className="absolute block h-0.5 w-5 bg-current transform translate-y-1.5 top-4" />
        </div>
      </button>

      {/* Main Content Area */}
      <div className="flex-1 h-screen flex flex-col">
        {/* Top Header Bar */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            
            {/* Language Toggle */}
            <button
              onClick={() => {
                const newLang = language === 'ar' ? 'en' : 'ar';
                setLanguage(newLang);
              }}
              className="mr-8 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200 text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <ProfileDropdown user={user} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
          {children}
        </div>
      </div>
    </div>
  );
}