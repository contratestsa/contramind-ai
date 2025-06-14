import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();



  const socialLinks = [
    { icon: 'fab fa-linkedin', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fas fa-envelope', href: '#' },
  ];



  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
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

          </div>
        </motion.div>
      </div>
    </footer>
  );
}
