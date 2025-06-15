import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-navy shadow-custom sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden">
              <img 
                src={logoImage} 
                alt="ContraMind.ai Logo" 
                className="w-72 h-18 object-contain object-left ml-[-9px] mr-[-9px] pt-[-27px] pb-[-27px] mt-[-59px] mb-[-59px] pl-[37px] pr-[37px]"
              />
            </div>
          </motion.div>



          {/* Language Toggle & CTA */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switch Toggle */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className={`flex items-center space-x-1.5 transition-colors ${language === 'en' ? 'text-white' : 'text-sky/60'}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 8h20M6 4v16" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="text-xs font-medium">EN</span>
              </div>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:ring-offset-2 focus:ring-offset-navy ${
                  language === 'ar' ? 'bg-sky' : 'bg-sky/30'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center ${
                    language === 'ar' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {language === 'ar' ? (
                    <svg className="w-2.5 h-2.5 text-sky" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  ) : (
                    <svg className="w-2.5 h-2.5 text-sky/60" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/>
                      <path d="M2 8h20" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  )}
                </span>
              </button>
              <div className={`flex items-center space-x-1.5 rtl:space-x-reverse transition-colors ${language === 'ar' ? 'text-white' : 'text-sky/60'}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="text-xs font-medium">عربي</span>
              </div>
            </div>
          </div>
        </div>


      </nav>
    </motion.header>
  );
}
