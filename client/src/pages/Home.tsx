import { motion } from "framer-motion";
import { useLanguage } from "../hooks/useLanguage";

export default function Home() {
  const { t, language, dir } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${dir}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/api/placeholder/120/40"
                alt="ContraMind"
                className="h-8 w-auto"
              />
            </div>
            {/* Removed Sign In button */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-5xl md:text-6xl font-bold text-gray-900 mb-8 ${
                language === "ar" ? "font-arabic" : ""
              }`}
            >
              {language === "ar" 
                ? "أول منصة ذكية لإدارة العقود بالذكاء الاصطناعي"
                : "The First AI-Native Contract Intelligence Platform"
              }
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl text-gray-600 mb-12 max-w-3xl mx-auto ${
                language === "ar" ? "font-arabic" : ""
              }`}
            >
              {language === "ar"
                ? "حوّل عقودك المعقدة إلى رؤى واضحة. اكتشف المخاطر، وفهم الالتزامات، واتخذ قرارات أفضل بثقة."
                : "Transform complex contracts into clear insights. Discover risks, understand obligations, and make better decisions with confidence."
              }
            </motion.p>

            {/* Removed Waitlist Form */}

            {/* Launch Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16"
            >
              <p className={`text-sm text-gray-500 ${language === "ar" ? "font-arabic" : ""}`}>
                {language === "ar" 
                  ? "الإطلاق المتوقع: يوليو 2025"
                  : "Expected Launch: July 2025"
                }
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className={`text-gray-500 text-sm ${language === "ar" ? "font-arabic" : ""}`}>
              {language === "ar"
                ? "© 2025 ContraMind. جميع الحقوق محفوظة."
                : "© 2025 ContraMind. All rights reserved."
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}