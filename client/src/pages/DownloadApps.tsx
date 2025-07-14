import { useLocation } from "wouter";
import { ArrowLeft, Download, Monitor, Smartphone, QrCode, Square } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { SiApple, SiLinux } from "react-icons/si";

export default function DownloadApps() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setLocation('/dashboard')}
              className={cn(
                "flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",
                isRTL && "flex-row-reverse"
              )}
            >
              <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
              <span>{t('المساعدة', 'Help')} › {t('تطبيق سطح المكتب', 'Desktop App')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B7DEE8]/20 rounded-full mb-6">
            <Monitor className="w-8 h-8 text-[#0C2836]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('تطبيق سطح المكتب', 'Desktop App')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('قم بتثبيت ContraMind على جهاز الكمبيوتر الخاص بك للحصول على تجربة أسرع وأكثر سلاسة',
               'Install ContraMind on your desktop for a faster, native experience')}
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* macOS Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <SiApple className="w-8 h-8 text-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900">macOS</h3>
              </div>
              <span className="text-sm text-gray-500">v2.4.0</span>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t('متطلبات النظام: macOS 11.0 أو أحدث', 'System Requirements: macOS 11.0 or later')}
            </p>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-opacity-90 transition-colors mb-4">
              <Download className="w-5 h-5" />
              <span>{t('تحميل .dmg', 'Download .dmg')}</span>
            </button>

            {/* QR Code */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {t('امسح الرمز للتحميل السريع', 'Scan for quick download')}
              </p>
            </div>
          </div>

          {/* Windows Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Square className="w-8 h-8 text-[#0078D4]" />
                <h3 className="text-xl font-semibold text-gray-900">Windows</h3>
              </div>
              <span className="text-sm text-gray-500">v2.4.0</span>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t('متطلبات النظام: Windows 10 أو أحدث', 'System Requirements: Windows 10 or later')}
            </p>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-opacity-90 transition-colors mb-4">
              <Download className="w-5 h-5" />
              <span>{t('تحميل .exe', 'Download .exe')}</span>
            </button>

            {/* QR Code */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {t('امسح الرمز للتحميل السريع', 'Scan for quick download')}
              </p>
            </div>
          </div>
        </div>

        {/* Linux Teaser Section */}
        <div className="bg-[#B7DEE8]/10 border border-[#B7DEE8]/30 rounded-lg p-8 text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SiLinux className="w-8 h-8 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Linux</h3>
          </div>
          <p className="text-gray-700 mb-2">
            {t('قريباً على Linux', 'Coming to Linux soon')}
          </p>
          <p className="text-sm text-gray-600">
            {t('نحن نعمل على إصدار Linux. انضم إلى قائمة الانتظار للحصول على إشعار عند توفره.',
               'We\'re working on a Linux release. Join the waitlist to be notified when it\'s available.')}
          </p>
        </div>

        {/* System Requirements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('المتطلبات العامة للنظام', 'General System Requirements')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {t('الحد الأدنى من المتطلبات', 'Minimum Requirements')}
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• {t('معالج: Intel Core i3 أو ما يعادله', 'Processor: Intel Core i3 or equivalent')}</li>
                <li>• {t('الذاكرة: 4 جيجابايت رام', 'Memory: 4GB RAM')}</li>
                <li>• {t('التخزين: 500 ميجابايت مساحة متاحة', 'Storage: 500MB available space')}</li>
                <li>• {t('الإنترنت: اتصال إنترنت للمزامنة', 'Internet: Internet connection for sync')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {t('المتطلبات الموصى بها', 'Recommended Requirements')}
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• {t('معالج: Intel Core i5 أو أحدث', 'Processor: Intel Core i5 or newer')}</li>
                <li>• {t('الذاكرة: 8 جيجابايت رام', 'Memory: 8GB RAM')}</li>
                <li>• {t('التخزين: 1 جيجابايت مساحة متاحة', 'Storage: 1GB available space')}</li>
                <li>• {t('الشاشة: 1920×1080 دقة أو أعلى', 'Display: 1920×1080 resolution or higher')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile App Teaser */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Smartphone className="w-5 h-5" />
            <span className="text-sm">
              {t('هل تبحث عن تطبيق الجوال؟', 'Looking for the mobile app?')}
              <button 
                onClick={() => setLocation('/mobile-apps')}
                className="ml-2 text-[#0C2836] hover:underline"
              >
                {t('انقر هنا', 'Click here')}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}