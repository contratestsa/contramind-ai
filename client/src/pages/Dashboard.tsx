import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutGrid, 
  Folder, 
  CheckSquare, 
  FileBarChart, 
  Settings, 
  HelpCircle, 
  Calendar,
  Bell,
  Inbox,
  ChevronDown,
  Coins
} from "lucide-react";
import { useLocation } from "wouter";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';
import GoogleSheetsSetup from '@/components/GoogleSheetsSetup';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasDropdown?: boolean;
}

function NavItem({ icon, label, isActive, onClick, hasDropdown }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 h-11 text-left transition-colors ${
        isActive 
          ? 'bg-gray-200 text-[#0C2836]' 
          : 'text-gray-700 hover:bg-[#E6E6E6]'
      }`}
    >
      <span className="w-[18px] h-[18px] flex items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {hasDropdown && (
        <ChevronDown className="w-4 h-4 ml-auto text-gray-500" />
      )}
    </button>
  );
}

export default function Dashboard() {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeNav, setActiveNav] = useState('dashboard');
  
  // Fetch Google Sheets connection status
  const { data: sheetsStatus } = useQuery({
    queryKey: ['/api/google-sheets/status'],
    refetchInterval: 30000 // Check every 30 seconds
  });
  
  // Fetch token balance
  const { data: tokenData } = useQuery({
    queryKey: ['/api/tokens/balance'],
    enabled: !!user,
    refetchInterval: 10000 // Update every 10 seconds
  });
  
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      icon: <LayoutGrid className="w-[18px] h-[18px]" />, 
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard' 
    },
    { 
      id: 'repository', 
      icon: <Folder className="w-[18px] h-[18px]" />, 
      label: language === 'ar' ? 'المستودع' : 'Repository' 
    },
    { 
      id: 'tasks', 
      icon: <CheckSquare className="w-[18px] h-[18px]" />, 
      label: language === 'ar' ? 'المهام' : 'Tasks' 
    },
    { 
      id: 'reports', 
      icon: <FileBarChart className="w-[18px] h-[18px]" />, 
      label: language === 'ar' ? 'التقارير' : 'Reports' 
    },
    { 
      id: 'settings', 
      icon: <Settings className="w-[18px] h-[18px]" />, 
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      hasDropdown: true 
    },
  ];

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-[200px] bg-[#F8F9FA] flex flex-col">
        {/* Logo */}
        <div className="p-4">
          <img
            src={logoImage}
            alt="ContraMind"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* My Work Section */}
        <div className="flex-1">
          <div className="bg-[#0C2836] text-white px-4 py-2 text-sm font-semibold">
            {language === 'ar' ? 'عملي' : 'My Work'}
          </div>
          
          <nav className="py-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
                hasDropdown={item.hasDropdown}
              />
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-4">
          <NavItem
            icon={<HelpCircle className="w-[18px] h-[18px]" />}
            label={language === 'ar' ? 'المساعدة' : 'Help'}
          />
          <NavItem
            icon={<Calendar className="w-[18px] h-[18px]" />}
            label={language === 'ar' ? 'جدولة عرض توضيحي' : 'Schedule Demo'}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-[60px] bg-white shadow-sm flex items-center justify-end px-6 gap-4">
          {/* Inbox */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Inbox className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="font-medium"
          >
            {language === 'ar' ? 'EN' : 'AR'}
          </Button>

          {/* Token Counter */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#E8F4F8] border border-[#B7DEE8] rounded-lg">
            <Coins className="w-4 h-4 text-[#0C2836]" />
            <span className="text-sm font-medium text-[#0C2836]">
              {tokenData?.remaining_tokens || 1000} Tokens
            </span>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0C2836] text-white rounded-full flex items-center justify-center font-medium">
              {getUserInitials()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-white">
          <h1 className="text-2xl font-semibold text-[#0C2836]">
            {language === 'ar' ? 'مرحباً بك في لوحة تحكم ContraMind' : 'Welcome to ContraMind Dashboard'}
          </h1>
          
          {/* Google Sheets Connection Status */}
          {sheetsStatus && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              sheetsStatus.connected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                sheetsStatus.connected ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="font-medium">{sheetsStatus.message}</span>
            </div>
          )}
          
          {/* Placeholder content */}
          <div className="mt-6 text-gray-600">
            {activeNav === 'dashboard' && (
              <p>{language === 'ar' ? 'محتوى لوحة التحكم سيظهر هنا' : 'Dashboard content will appear here'}</p>
            )}
            {activeNav === 'repository' && (
              <p>{language === 'ar' ? 'محتوى المستودع سيظهر هنا' : 'Repository content will appear here'}</p>
            )}
            {activeNav === 'tasks' && (
              <p>{language === 'ar' ? 'محتوى المهام سيظهر هنا' : 'Tasks content will appear here'}</p>
            )}
            {activeNav === 'reports' && (
              <p>{language === 'ar' ? 'محتوى التقارير سيظهر هنا' : 'Reports content will appear here'}</p>
            )}
            {activeNav === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#0C2836]">
                  {language === 'ar' ? 'إعدادات قاعدة البيانات' : 'Database Settings'}
                </h2>
                <GoogleSheetsSetup />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}