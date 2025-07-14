import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, Monitor, Apple, Download } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { FaWindows } from "react-icons/fa";

export default function DesktopApp() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const pageVariants = {
    initial: { opacity: 0, x: isRTL ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 20 : -20 }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0C2836]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.15 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className={cn("flex items-center space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
            <li>
              <Link href="/help" className="text-[#B7DEE8] hover:text-white transition-colors duration-150">
                {t('المساعدة', 'Help')}
              </Link>
            </li>
            <li className="text-[#B7DEE8]/60">›</li>
            <li className="text-white">
              {t('تطبيق سطح المكتب', 'Desktop App')}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.15 }}
          className="text-center mb-16"
        >
          <Monitor className="w-20 h-20 mx-auto mb-6 text-[#B7DEE8]" />
          <h1 className="text-4xl font-bold text-white mb-6">
            {t('تطبيق ContraMind لسطح المكتب', 'ContraMind Desktop App')}
          </h1>
          <p className="text-xl text-[#B7DEE8]/80 max-w-2xl mx-auto">
            {t(
              'قم بتثبيت ContraMind على جهاز الكمبيوتر الخاص بك للحصول على تجربة أسرع وأصلية.',
              'Install ContraMind on your desktop for a faster, native experience.'
            )}
          </p>
        </motion.div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* macOS Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.15 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-[#B7DEE8]/20 hover:border-[#B7DEE8]/40 transition-colors duration-150"
          >
            <div className={cn("flex items-start justify-between mb-6", isRTL && "flex-row-reverse")}>
              <div>
                <Apple className="w-12 h-12 text-[#B7DEE8] mb-4" />
                <h3 className={cn("text-2xl font-bold text-white mb-2", isRTL && "text-right")}>
                  macOS
                </h3>
                <p className={cn("text-[#B7DEE8]/60 text-sm", isRTL && "text-right")}>
                  {t('الإصدار 2.1.0', 'Version 2.1.0')} • 89 MB
                </p>
              </div>
              <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-[#B7DEE8]/40 text-xs">QR Code</span>
              </div>
            </div>
            <button className="w-full bg-[#B7DEE8] text-[#0C2836] font-semibold py-3 px-6 rounded-lg hover:bg-[#B7DEE8]/90 transition-colors duration-150 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              {t('تحميل لنظام macOS', 'Download for macOS')}
            </button>
          </motion.div>

          {/* Windows Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.15 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-[#B7DEE8]/20 hover:border-[#B7DEE8]/40 transition-colors duration-150"
          >
            <div className={cn("flex items-start justify-between mb-6", isRTL && "flex-row-reverse")}>
              <div>
                <FaWindows className="w-12 h-12 text-[#B7DEE8] mb-4" />
                <h3 className={cn("text-2xl font-bold text-white mb-2", isRTL && "text-right")}>
                  Windows
                </h3>
                <p className={cn("text-[#B7DEE8]/60 text-sm", isRTL && "text-right")}>
                  {t('الإصدار 2.1.0', 'Version 2.1.0')} • 95 MB
                </p>
              </div>
              <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-[#B7DEE8]/40 text-xs">QR Code</span>
              </div>
            </div>
            <button className="w-full bg-[#B7DEE8] text-[#0C2836] font-semibold py-3 px-6 rounded-lg hover:bg-[#B7DEE8]/90 transition-colors duration-150 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              {t('تحميل لنظام Windows', 'Download for Windows')}
            </button>
          </motion.div>
        </div>

        {/* Linux Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.15 }}
          className="bg-[#B7DEE8]/10 border border-[#B7DEE8]/20 rounded-lg p-6 text-center mb-16"
        >
          <p className="text-white text-lg mb-4">
            {t('دعم Linux قريباً', 'Linux support coming soon')} — {t('اشترك للحصول على التحديثات', 'sign up for updates')}
          </p>
          <button className="bg-transparent border border-[#B7DEE8] text-[#B7DEE8] px-6 py-2 rounded-lg hover:bg-[#B7DEE8]/10 transition-colors duration-150">
            {t('أبلغني عند التوفر', 'Notify me when available')}
          </button>
        </motion.div>

        {/* System Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-[#B7DEE8]/20"
        >
          <h2 className={cn("text-2xl font-bold text-white mb-6", isRTL && "text-right")}>
            {t('متطلبات النظام', 'System Requirements')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* macOS Requirements */}
            <div>
              <h3 className={cn("text-lg font-semibold text-[#B7DEE8] mb-4 flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Apple className="w-5 h-5" />
                macOS
              </h3>
              <ul className={cn("space-y-2 text-white/80", isRTL && "text-right")}>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('macOS 10.15 (Catalina) أو أحدث', 'macOS 10.15 (Catalina) or later')}</span>
                </li>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('معالج Intel أو Apple Silicon', 'Intel or Apple Silicon processor')}</span>
                </li>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('4 جيجابايت من ذاكرة الوصول العشوائي', '4 GB of RAM')}</span>
                </li>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('500 ميجابايت من المساحة المتاحة', '500 MB of available space')}</span>
                </li>
              </ul>
            </div>

            {/* Windows Requirements */}
            <div>
              <h3 className={cn("text-lg font-semibold text-[#B7DEE8] mb-4 flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <FaWindows className="w-5 h-5" />
                Windows
              </h3>
              <ul className={cn("space-y-2 text-white/80", isRTL && "text-right")}>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('Windows 10 الإصدار 1903 أو أحدث', 'Windows 10 version 1903 or later')}</span>
                </li>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('معالج 64 بت', '64-bit processor')}</span>
                </li>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('4 جيجابايت من ذاكرة الوصول العشوائي', '4 GB of RAM')}</span>
                </li>
                <li className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <span className="text-[#B7DEE8] mt-1">•</span>
                  <span>{t('500 ميجابايت من المساحة المتاحة', '500 MB of available space')}</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}