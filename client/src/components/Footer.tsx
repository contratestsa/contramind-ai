import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  const companyLinks = [
    { ar: 'من نحن', en: 'About Us', href: '#' },
    { ar: 'الفريق', en: 'Team', href: '#' },
    { ar: 'الوظائف', en: 'Careers', href: '#' },
    { ar: 'الأخبار', en: 'News', href: '#' },
  ];

  const productLinks = [
    { ar: 'الميزات', en: 'Features', href: '#' },
    { ar: 'الأسعار', en: 'Pricing', href: '#' },
    { ar: 'الأمان', en: 'Security', href: '#' },
    { ar: 'التكامل', en: 'Integrations', href: '#' },
  ];

  const socialLinks = [
    { icon: 'fab fa-linkedin', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fas fa-envelope', href: '#' },
  ];

  const bottomLinks = [
    { ar: 'سياسة الخصوصية', en: 'Privacy Policy', href: '#' },
    { ar: 'شروط الاستخدام', en: 'Terms of Service', href: '#' },
    { ar: 'اتصل بنا', en: 'Contact', href: '#' },
  ];

  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <span className="text-2xl font-heading font-bold">ContraMind.ai</span>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-md">
              {t(
                'أول منصة ذكية لإدارة دورة حياة العقود مصممة خصيصاً لمنطقة الشرق الأوسط وشمال أفريقيا',
                'The first AI-native Contract Lifecycle Management platform designed specifically for the MENA region'
              )}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <i className={`${social.icon} text-white`} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg mb-6">
              {t('الشركة', 'Company')}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t(link.ar, link.en)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold text-lg mb-6">
              {t('المنتج', 'Product')}
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t(link.ar, link.en)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 text-sm">
              {t(
                '© 2025 ContraMind Inc. جميع الحقوق محفوظة.',
                '© 2025 ContraMind Inc. All rights reserved.'
              )}
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse text-sm">
              {bottomLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t(link.ar, link.en)}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
