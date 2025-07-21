import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { 
  Plus, Search, ChevronRight, BarChart3, Users, Bell, Tag,
  Settings, HelpCircle, LogOut, X
} from 'lucide-react';
import logoImage from "@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png";
import iconImage from "@assets/Profile Picture - ContraMind (V001)-1_1752437530152.png";
import { useRecentContracts } from '@/hooks/useRecentContracts';

interface Contract {
  id: number;
  title: string;
  partyName: string;
  createdAt: string;
  date: string;
  riskLevel?: string;
}

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  showMobile: boolean;
  setShowMobile: (show: boolean) => void;
  activePage?: string;
  onNewContract?: () => void;
}

export default function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  showMobile,
  setShowMobile,
  activePage,
  onNewContract
}: DashboardSidebarProps) {
  const [location, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const [contractSearchQuery, setContractSearchQuery] = useState('');
  const isRTL = language === 'ar';

  // Fetch recent contracts with persistence
  const { recent: recentContracts, isLoading, touch } = useRecentContracts(5);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setLocation('/');
  };

  useEffect(() => {
    // Close mobile sidebar when route changes
    setShowMobile(false);
  }, [location, setShowMobile]);

  return (
    <>
      {/* Mobile Overlay */}
      {showMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobile(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-[#0C2836] text-white flex flex-col transition-all duration-300 shadow-xl",
        isCollapsed ? "w-[60px]" : "w-[260px]",
        showMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
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
              isCollapsed ? "w-0 opacity-0" : "flex-1"
            )}
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-colors flex-shrink-0 relative w-9 h-9 flex items-center justify-center"
          >
            {/* Hamburger Menu */}
            <div className={cn(
              "w-5 h-5 absolute transition-all duration-300",
              isCollapsed ? "opacity-0 scale-75" : "opacity-100 scale-100"
            )}>
              <span className="absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out origin-center translate-y-0" />
              <span className="absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out top-2" />
              <span className="absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out origin-center top-4 translate-y-0" />
            </div>
            
            {/* ContraMind Icon */}
            <img 
              src={iconImage} 
              alt="ContraMind" 
              className={cn(
                "w-6 h-6 object-contain absolute transition-all duration-300",
                isCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
            />
          </button>
        </div>

        {/* New Contract Analysis Button */}
        <div className="p-3 border-b border-[rgba(183,222,232,0.2)]">
          <button
            onClick={onNewContract}
            className={cn(
              "w-full flex items-center gap-2 py-2.5 bg-[#B7DEE8] text-[#0C2836] rounded-md hover:bg-[#a5d0db] transition-all duration-200 font-medium shadow-sm hover:shadow-md",
              isCollapsed ? "justify-center px-2" : "justify-center px-4"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>{t('تحليل عقد جديد', 'New Contract Analysis')}</span>}
          </button>
        </div>

        {/* Contract Search Box */}
        {!isCollapsed && (
          <div className="p-3 border-b border-[rgba(183,222,232,0.2)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(183,222,232,0.6)]" />
              <input
                type="text"
                value={contractSearchQuery}
                onChange={(e) => setContractSearchQuery(e.target.value)}
                placeholder={t('البحث في محادثات العقود...', 'Search contract chats...')}
                className="w-full pl-10 pr-3 py-2 bg-[rgba(183,222,232,0.1)] text-white placeholder-[rgba(183,222,232,0.6)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Contracts */}
          {!isCollapsed && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#B7DEE8] uppercase tracking-wider">
                  {t('العقود الأخيرة', 'Recent Contracts')}
                </h3>
                <button 
                  onClick={() => setLocation('/dashboard/contracts')}
                  className="text-xs text-[#B7DEE8] hover:text-[#a5d0db] transition-colors">
                  {t('عرض الكل', 'View All')}
                </button>
              </div>
              <div className="space-y-1">
                {recentContracts.length === 0 ? (
                  <p className="text-xs text-[rgba(183,222,232,0.6)] italic p-2">
                    {t('لا توجد عقود حديثة', 'No recent contracts')}
                  </p>
                ) : (
                  recentContracts.slice(0, 5).map((contract) => (
                    <button
                      key={contract.id}
                      onClick={() => {
                        touch(contract.id); // Touch contract to update last viewed
                        setLocation(`/dashboard?contract=${contract.id}`);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{contract.title}</span>
                        <ChevronRight className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
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
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="px-3 pb-3">
            <div className="space-y-1">
              <button
                onClick={() => setLocation('/dashboard/analytics')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  activePage === 'analytics' && "bg-[rgba(183,222,232,0.1)]",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isCollapsed ? t('التحليلات والتقارير', 'Analytics & Reports') : undefined}
              >
                <BarChart3 className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/dashboard/parties')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  activePage === 'parties' && "bg-[rgba(183,222,232,0.1)]",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isCollapsed ? t('الأطراف وجهات الاتصال', 'Parties & Contacts') : undefined}
              >
                <Users className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/dashboard/notifications')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  activePage === 'notifications' && "bg-[rgba(183,222,232,0.1)]",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isCollapsed ? t('الإشعارات', 'Notifications') : undefined}
              >
                <Bell className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{t('الإشعارات', 'Notifications')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/dashboard/tags')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  activePage === 'tags' && "bg-[rgba(183,222,232,0.1)]",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isCollapsed ? t('العلامات والفئات', 'Tags & Categories') : undefined}
              >
                <Tag className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{t('العلامات والفئات', 'Tags & Categories')}</span>}
              </button>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-[rgba(183,222,232,0.1)]" />

            {/* Settings & Help */}
            <div className="space-y-1">
              <button
                onClick={() => setLocation('/settings/personal')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isCollapsed ? t('الإعدادات', 'Settings') : undefined}
              >
                <Settings className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{t('الإعدادات', 'Settings')}</span>}
              </button>

              <button
                onClick={() => setLocation('/help')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isCollapsed ? t('مركز المساعدة', 'Help Center') : undefined}
              >
                <HelpCircle className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{t('مركز المساعدة', 'Help Center')}</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="border-t border-[rgba(183,222,232,0.1)] p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
              isCollapsed ? "justify-center px-2" : "px-3"
            )}
            title={isCollapsed ? t('تسجيل الخروج', 'Log Out') : undefined}
          >
            <LogOut className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">{t('تسجيل الخروج', 'Log Out')}</span>}
          </button>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setShowMobile(false)}
          className="lg:hidden absolute top-3 right-3 p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}