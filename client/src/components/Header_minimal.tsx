import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Globe, Flag } from 'lucide-react';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';
import ContactUs from '@/components/ContactUs';
import AuthModals from '@/components/auth/AuthModals';

export default function Header() {
  // Simple local state without external hooks
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simple translation function
  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

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

  return (
    <header className="relative z-50">
      <nav className="bg-navy border-b border-sky/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section - Always on the left with absolute positioning */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
              <img 
                src={logoImage} 
                alt="ContraMind.ai"
                className="w-72 h-18 object-contain object-left ml-[-9px] mr-[-9px] pt-[-27px] pb-[-27px] mt-[-59px] mb-[-59px] pl-[37px] pr-[37px]"
              />
            </div>
          </div>

          {/* Contact Us & Language Toggle - Always positioned on the right */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Contact Us Icon */}
            <ContactUs />
            
            {/* Authentication Modals */}
            <div className="flex items-center space-x-2">
              <AuthModals />
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