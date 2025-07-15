import { useState, useEffect, ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { 
  Plus, Search, ChevronRight, BarChart3, Users, Bell, Tag,
  Settings, HelpCircle, LogOut, X, Menu, Globe
} from 'lucide-react';
import logoImage from "@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png";
import iconImage from "@assets/Profile Picture - ContraMind (V001)-1_1752437530152.png";
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ProfileDropdown from '@/components/ProfileDropdown';
import { motion, AnimatePresence } from 'framer-motion';

interface Contract {
  id: number;
  title: string;
  partyName: string;
  date: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  profilePicture?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { language, t, setLanguage } = useLanguage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [contractSearchQuery, setContractSearchQuery] = useState('');
  const isRTL = language === 'ar';

  // Get user data
  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ['/api/auth/me'],
  });

  const user = userData?.user;

  // Fetch recent contracts
  const { data: recentContracts = [] } = useQuery<Contract[]>({
    queryKey: ['/api/contracts/recent'],
    refetchInterval: 30000,
    select: (data: any) => data?.contracts || []
  });

  const handleLogout = async () => {
    await apiRequest('/api/auth/logout', {
      method: 'POST'
    });
    setLocation('/');
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setShowMobileSidebar(false);
    console.log('SIDEBAR PERSISTENCE FIXED');
  }, [location]);

  // Navigation items
  const navItems = [
    { path: '/analytics', icon: BarChart3, label: t('التحليلات والتقارير', 'Analytics & Reports') },
    { path: '/parties', icon: Users, label: t('الأطراف وجهات الاتصال', 'Parties & Contacts') },
    { path: '/notifications', icon: Bell, label: t('الإشعارات', 'Notifications') },
    { path: '/tags', icon: Tag, label: t('العلامات والفئات', 'Tags & Categories') },
  ];

  return (
    <div className={cn("relative flex h-screen bg-gradient-to-br from-[#0C2836] to-[#1a3a4a] overflow-hidden", isRTL && "flex-row-reverse")}>
      {/* Mobile Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-[#0C2836] text-white flex flex-col transition-all duration-300 shadow-xl",
        isSidebarCollapsed ? "w-[60px]" : "w-[260px]",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "fixed lg:relative inset-y-0 z-40",
        isRTL && "lg:order-2"
      )}>
        {/* Logo and Hamburger */}
        <div className="flex items-center justify-between p-3 border-b border-[rgba(183,222,232,0.2)]">
          <img 
            src={logoImage} 
            alt="ContraMind" 
            className={cn(
              "h-10 object-contain transition-all duration-300",
              isSidebarCollapsed ? "w-0 opacity-0" : "flex-1"
            )}
          />
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-colors relative group"
          >
            <AnimatePresence mode="wait">
              {isSidebarCollapsed ? (
                <motion.img
                  key="logo"
                  src={iconImage}
                  alt="ContraMind Icon"
                  className="w-5 h-5 rounded"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.div
                  key="hamburger"
                  className="w-5 h-5 relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="absolute block h-0.5 w-5 bg-current transform -translate-y-1.5" />
                  <span className="absolute block h-0.5 w-5 bg-current transform top-2" />
                  <span className="absolute block h-0.5 w-5 bg-current transform translate-y-1.5 top-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* New Contract Button */}
          <div className="p-3 pb-0">
            <Link href="/dashboard">
              <button className={cn(
                "w-full bg-[#B7DEE8] text-[#0C2836] py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 font-medium",
                isSidebarCollapsed ? "px-2" : "px-4"
              )}>
                <Plus className="w-4 h-4 flex-shrink-0" />
                {!isSidebarCollapsed && t('تحليل عقد جديد', 'New Contract Analysis')}
              </button>
            </Link>
          </div>

          {/* Contract Search */}
          {!isSidebarCollapsed && (
            <div className="px-3 py-3">
              <div className="relative">
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(183,222,232,0.4)]",
                  isRTL ? "right-3" : "left-3"
                )} />
                <input
                  type="text"
                  value={contractSearchQuery}
                  onChange={(e) => setContractSearchQuery(e.target.value)}
                  placeholder={t('ابحث في محادثات العقود...', 'Search contract chats...')}
                  className={cn(
                    "w-full bg-[rgba(183,222,232,0.1)] border border-[rgba(183,222,232,0.2)] rounded-lg py-2 text-sm placeholder-[rgba(183,222,232,0.4)] focus:outline-none focus:border-[#B7DEE8]",
                    isRTL ? "pr-10 pl-3 text-right" : "pl-10 pr-3"
                  )}
                />
              </div>
            </div>
          )}

          {/* Recent Contracts */}
          {!isSidebarCollapsed && (
            <div className="px-3 pb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-[rgba(183,222,232,0.6)] uppercase tracking-wider">
                  {t('العقود الحديثة', 'Recent Contracts')}
                </h3>
                <Link href="/dashboard">
                  <a className="text-xs text-[#B7DEE8] hover:text-white transition-colors">
                    {t('عرض الكل', 'View All')}
                  </a>
                </Link>
              </div>
              <div className="space-y-1">
                {recentContracts.length === 0 ? (
                  <p className="text-xs text-[rgba(183,222,232,0.4)] italic py-2">
                    {t('لا توجد محادثات مؤرشفة', 'No archived chats')}
                  </p>
                ) : (
                  recentContracts.map((contract) => (
                    <button
                      key={contract.id}
                      className="w-full text-left p-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-[rgba(183,222,232,0.4)] group-hover:text-white flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{contract.title}</p>
                          <div className="flex items-center gap-2 text-xs text-[rgba(183,222,232,0.6)] mt-0.5">
                            <span>{contract.partyName}</span>
                            <span>•</span>
                            <span>{new Date(contract.date).toLocaleDateString()}</span>
                            <span className="ml-auto">
                              {contract.riskLevel === 'low' && '🟢'}
                              {contract.riskLevel === 'medium' && '🟡'}
                              {contract.riskLevel === 'high' && '🔴'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="px-3 pb-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <a className={cn(
                      "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                      isActive && "bg-[rgba(183,222,232,0.1)]",
                      isSidebarCollapsed ? "justify-center px-2" : "px-3"
                    )}
                    title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                      {!isSidebarCollapsed && <span className="text-sm">{item.label}</span>}
                    </a>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-[rgba(183,222,232,0.1)]" />

            {/* Settings & Help */}
            <div className="space-y-1">
              <Link href="/settings/personal">
                <a className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('الإعدادات', 'Settings') : undefined}
                >
                  <Settings className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm">{t('الإعدادات', 'Settings')}</span>}
                </a>
              </Link>

              <Link href="/help">
                <a className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('مركز المساعدة', 'Help Center') : undefined}
                >
                  <HelpCircle className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm">{t('مركز المساعدة', 'Help Center')}</span>}
                </a>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="border-t border-[rgba(183,222,232,0.1)] p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
              isSidebarCollapsed ? "justify-center px-2" : "px-3"
            )}
            title={isSidebarCollapsed ? t('تسجيل الخروج', 'Log Out') : undefined}
          >
            <LogOut className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
            {!isSidebarCollapsed && <span className="text-sm">{t('تسجيل الخروج', 'Log Out')}</span>}
          </button>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setShowMobileSidebar(false)}
          className="lg:hidden absolute top-3 right-3 p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className={cn(
          "lg:hidden fixed top-4 z-50 p-2 bg-[#0C2836] text-white rounded-md shadow-lg",
          isRTL ? "right-4" : "left-4",
          showMobileSidebar && "hidden"
        )}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content Area */}
      <div className="flex-1 h-screen flex flex-col">
        {/* Top Header Bar */}
        <div className="flex-shrink-0 bg-[#0C2836] px-4 py-3 relative z-40">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            
            {/* Language Toggle */}
            <button
              onClick={() => {
                const newLang = language === 'ar' ? 'en' : 'ar';
                setLanguage(newLang);
              }}
              className="mr-8 px-3 py-1.5 bg-[rgba(183,222,232,0.1)] hover:bg-[rgba(183,222,232,0.2)] rounded-md transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
            
            {/* Profile Dropdown */}
            {user && (
              <div className="relative z-50">
                <ProfileDropdown user={user} />
              </div>
            )}
          </div>
        </div>

        {/* Content Area with children */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}