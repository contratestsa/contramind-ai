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
                className="w-72 h-18 object-contain object-left"
              />
            </div>
          </motion.div>



          {/* Language Toggle & CTA */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden sm:flex items-center bg-grey rounded-full p-1"
            >
              <Button
                variant={language === 'ar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('ar')}
                className={
                  language === 'ar'
                    ? 'rounded-full bg-navy text-white hover:bg-navy/90'
                    : 'rounded-full text-navy hover:bg-sky/20'
                }
              >
                العربية
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={
                  language === 'en'
                    ? 'rounded-full bg-navy text-white hover:bg-navy/90'
                    : 'rounded-full text-navy hover:bg-sky/20'
                }
              >
                English
              </Button>
            </motion.div>




          </div>
        </div>


      </nav>
    </motion.header>
  );
}
