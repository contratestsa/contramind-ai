import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: 'fab fa-linkedin', href: 'https://linkedin.com/company/contramind-ai' },
    { icon: 'fab fa-twitter', href: 'https://x.com/ContraMindAI' },
    { icon: 'fab fa-instagram', href: 'https://www.instagram.com/contramindai/' },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-sky rounded-lg flex items-center justify-center mr-3">
                <span className="text-navy font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold">ContraMind</span>
            </div>
            <p className="text-gray-300 mb-6 font-arabic-body leading-relaxed max-w-md">
              {t('منصة الذكاء الاصطناعي الرائدة لمراجعة وتحليل العقود القانونية في المنطقة العربية', 'The leading AI platform for legal contract review and analysis in the Arab region')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-sky transition-colors"
                >
                  <i className={`${link.icon} text-gray-300 hover:text-navy`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-arabic-heading-medium mb-6">
              {t('روابط سريعة', 'Quick Links')}
            </h3>
            <ul className="space-y-3 font-arabic-body">
              <li>
                <a href="#features" className="text-gray-300 hover:text-sky transition-colors">
                  {t('الميزات', 'Features')}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-sky transition-colors">
                  {t('أسئلة شائعة', 'FAQ')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-sky transition-colors">
                  {t('تواصل معنا', 'Contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-arabic-heading-medium mb-6">
              {t('تواصل معنا', 'Contact Us')}
            </h3>
            <div className="space-y-3 font-arabic-body">
              <p className="text-gray-300">
                <span className="block text-sm">{t('البريد الإلكتروني', 'Email')}</span>
                <a href="mailto:info@contramind.ai" className="text-sky hover:text-sky/80">
                  info@contramind.ai
                </a>
              </p>
              <p className="text-gray-300">
                <span className="block text-sm">{t('الموقع', 'Website')}</span>
                <a href="https://contramind.ai" className="text-sky hover:text-sky/80">
                  contramind.ai
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-arabic-body mb-4 md:mb-0">
              {t('© 2025 ContraMind. جميع الحقوق محفوظة.', '© 2025 ContraMind. All rights reserved.')}
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-sky text-sm transition-colors">
                {t('سياسة الخصوصية', 'Privacy Policy')}
              </a>
              <a href="/terms" className="text-gray-400 hover:text-sky text-sm transition-colors">
                {t('الشروط والأحكام', 'Terms of Service')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}