import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe, Flag, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';
import ContactUs from '@/components/ContactUs';
import AuthModals from '@/components/auth/AuthModals';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { language, setLanguage, t } = useSimpleLanguage();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { key: 'product', ar: 'المنتج', en: 'Product', href: '#product' },
    { key: 'pricing', ar: 'الأسعار', en: 'Pricing', href: '#pricing' },
    { key: 'customers', ar: 'العملاء', en: 'Customers', href: '#customers' },
    { key: 'contact', ar: 'اتصل بنا', en: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-navy shadow-custom sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 lg:h-24 pl-80">
          {/* Logo - Always positioned on the left regardless of language */}
          <div className="flex items-center flex-shrink-0" style={{ position: 'absolute', left: '1rem', zIndex: 10 }}>
            <div className="flex items-center overflow-hidden">
              <img 
                src={logoImage} 
                alt="ContraMind.ai Logo" 
                className="w-72 h-18 object-contain object-left ml-[-9px] mr-[-9px] pt-[-27px] pb-[-27px] mt-[-59px] mb-[-59px] pl-[37px] pr-[37px]"
              />
            </div>
          </div>

          {/* Contact Us & Language Toggle - Always positioned on the right */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Contact Us Icon */}
            <ContactUs />
            
            {/* Authentication - Show user menu if authenticated, otherwise show auth modals */}
            <div className="flex items-center space-x-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium max-w-[120px] truncate">
                        {user.fullName || user.email}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      disabled={isLoggingOut}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? t('جاري تسجيل الخروج...', 'Signing out...') : t('تسجيل الخروج', 'Sign out')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthModals />
              )}
            </div>
            
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white"
              >
                {language === 'ar' ? (
                  <Globe className="w-4 h-4" />
                ) : (
                  <Flag className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'عربي' : 'English'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-grey/20 py-1 min-w-[120px] z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-sky/5 transition-colors ${
                      language === 'en' ? 'bg-sky/10 text-sky font-medium' : 'text-navy'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>English</span>
                    {language === 'en' && (
                      <svg className="w-4 h-4 text-sky ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-sky/5 transition-colors ${
                      language === 'ar' ? 'bg-sky/10 text-sky font-medium' : 'text-navy'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>عربي</span>
                    {language === 'ar' && (
                      <svg className="w-4 h-4 text-sky ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
