import { Button } from '@/components/ui/button';
import { ChevronDown, Globe, Flag } from 'lucide-react';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';
import ContactUs from '@/components/ContactUs';
import AuthModals from '@/components/auth/AuthModals';

export default function Header() {
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
                className="h-12 w-auto max-w-none object-contain" 
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-sky transition-colors duration-200 font-medium"
              >
                {item.ar}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:text-sky hover:bg-sky/10 flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span>العربية</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* Contact Us */}
            <ContactUs>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:text-sky hover:bg-sky/10"
              >
                اتصل بنا
              </Button>
            </ContactUs>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-2">
              <AuthModals 
                triggerLoginButton={
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:text-sky hover:bg-sky/10"
                  >
                    تسجيل الدخول
                  </Button>
                }
                triggerSignupButton={
                  <Button 
                    size="sm"
                    className="bg-sky hover:bg-sky/90 text-navy font-semibold"
                  >
                    إنشاء حساب
                  </Button>
                }
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}