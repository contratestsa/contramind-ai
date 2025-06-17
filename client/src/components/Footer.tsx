import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';

export default function Footer() {
  const { t } = useSimpleLanguage();

  const socialLinks = [
    { icon: 'fab fa-linkedin', href: 'https://linkedin.com/company/contramind-ai' },
    { icon: 'fab fa-twitter', href: 'https://x.com/ContraMindAI' },
    { icon: 'fab fa-instagram', href: 'https://www.instagram.com/contramindai/' },
  ];

  return (
    <footer className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-arabic-heading-bold text-white mb-4">
              ContraMind.ai
            </h3>
            <p className="text-gray-400 font-arabic-body leading-relaxed mb-6 max-w-md">
              {t(
                'أول منصة ذكاء اصطناعي قانونية مصممة خصيصاً لمنطقة الشرق الأوسط وشمال أفريقيا مع دعم كامل للغة العربية.',
                'The first legal AI platform specifically designed for the MENA region with full Arabic language support.'
              )}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-sky hover:text-white transition-all duration-300"
                >
                  <i className={link.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-arabic-heading-bold text-white mb-4">
              {t('المنتج', 'Product')}
            </h4>
            <ul className="space-y-3">
              {[
                { ar: 'المميزات', en: 'Features' },
                { ar: 'الأسعار', en: 'Pricing' },
                { ar: 'التحديثات', en: 'Updates' },
                { ar: 'الدعم', en: 'Support' },
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-arabic-body">
                    {t(item.ar, item.en)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-arabic-heading-bold text-white mb-4">
              {t('الشركة', 'Company')}
            </h4>
            <ul className="space-y-3">
              {[
                { ar: 'من نحن', en: 'About Us' },
                { ar: 'الوظائف', en: 'Careers' },
                { ar: 'المدونة', en: 'Blog' },
                { ar: 'اتصل بنا', en: 'Contact' },
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 font-arabic-body">
                    {t(item.ar, item.en)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 font-arabic-body text-sm mb-4 md:mb-0">
            {t(
              '© 2024 ContraMind.ai. جميع الحقوق محفوظة.',
              '© 2024 ContraMind.ai. All rights reserved.'
            )}
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-arabic-body">
              {t('سياسة الخصوصية', 'Privacy Policy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-arabic-body">
              {t('شروط الاستخدام', 'Terms of Service')}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-arabic-body">
              {t('ملفات تعريف الارتباط', 'Cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}