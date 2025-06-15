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
              <span className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-white' : 'text-sky/60'}`}>
                EN
              </span>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky/20 transition-colors focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2 focus:ring-offset-navy"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    language === 'ar' ? 'translate-x-6 rtl:translate-x-1' : 'translate-x-1 rtl:translate-x-6'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${language === 'ar' ? 'text-white' : 'text-sky/60'}`}>
                العربية
              </span>
            </div>
          </div>
        </div>


      </nav>
    </motion.header>
  );
}
