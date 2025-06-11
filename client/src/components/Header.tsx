import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/CMYK_Logo Design - ContraMind (V001)-10_1749665092141.jpg';

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
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img 
                src={logoImage} 
                alt="ContraMind.ai Logo" 
                className="w-8 h-8"
              />
              <span className="text-2xl font-heading font-bold text-white">
                ContraMind.ai
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8 rtl:space-x-reverse">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-sky transition-colors duration-300 font-medium"
                >
                  {t(item.ar, item.en)}
                </motion.button>
              ))}
            </div>
          </div>

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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={() => window.open('https://calendly.com/contramind-demo', '_blank')}
                className="bg-navy text-white hover:bg-navy/90 rounded-custom shadow-custom hover:shadow-custom-hover"
              >
                {t('احجز عرض توضيحي', 'Book Demo')}
              </Button>
            </motion.div>


          </div>
        </div>


      </nav>
    </motion.header>
  );
}
