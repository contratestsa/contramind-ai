import { motion } from 'framer-motion';

export default function Footer() {
  const socialLinks = [
    { icon: 'LinkedIn', href: 'https://linkedin.com/company/contramind-ai' },
    { icon: 'Twitter', href: 'https://x.com/ContraMindAI' },
    { icon: 'Instagram', href: 'https://www.instagram.com/contramindai/' },
  ];

  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold mb-4">ContraMind.ai</h3>
            <p className="text-grey max-w-2xl mx-auto">
              أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الاصطناعي
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center space-x-6 mb-8"
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey hover:text-sky transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="border-t border-white/10 pt-8"
          >
            <p className="text-grey text-sm">
              © 2024 ContraMind.ai. جميع الحقوق محفوظة.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}