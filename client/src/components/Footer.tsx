import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: 'fab fa-linkedin', href: 'https://linkedin.com/company/contramind-ai' },
    { icon: 'fab fa-twitter', href: 'https://x.com/ContraMindAI' },
    { icon: 'fab fa-instagram', href: 'https://www.instagram.com/contramindai/' },
  ];

  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="text-center">
            <div className="mb-6">
              <span className="text-2xl font-arabic-heading-bold">ContraMind.ai</span>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto font-arabic-body">
              {t(
                'منصة متخصصة لإدارة ومراجعة العقود',
                'AI-powered legal contract lifecycle platform'
              )}
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <i className={`${social.icon} text-white`} />
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400 font-arabic-body">
                © 2025 ContraMind. {t('جميع الحقوق محفوظة', 'All rights reserved')}
              </div>
              
              <div className="flex space-x-6 rtl:space-x-reverse">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-arabic-body">
                  {t('سياسة الخصوصية', 'Privacy Policy')}
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-arabic-body">
                  {t('شروط الخدمة', 'Terms of Service')}
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-arabic-body">
                  {t('اتصل بنا', 'Contact Us')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}