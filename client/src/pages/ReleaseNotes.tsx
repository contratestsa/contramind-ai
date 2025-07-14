import { useLocation } from "wouter";
import { ArrowLeft, Tag, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ReleaseNotes() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const isRTL = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'web' | 'desktop' | 'mobile'>('all');

  // Sample release data
  const releases = [
    {
      version: '2.4.0',
      date: '2025-07-14',
      type: 'web',
      isLatest: true,
      highlights: [
        t('تحسين واجهة المستخدم العربية', 'Improved Arabic UI support'),
        t('إضافة قائمة مساعدة متطورة', 'Added advanced help menu'),
        t('تحسينات في الأداء', 'Performance improvements')
      ]
    },
    {
      version: '2.3.0',
      date: '2025-07-10',
      type: 'desktop',
      highlights: [
        t('دعم تطبيق سطح المكتب', 'Desktop app support'),
        t('مزامنة البيانات التلقائية', 'Automatic data sync'),
        t('اختصارات لوحة المفاتيح', 'Keyboard shortcuts')
      ]
    },
    {
      version: '2.2.0',
      date: '2025-07-05',
      type: 'mobile',
      highlights: [
        t('تطبيق جوال محسّن', 'Enhanced mobile app'),
        t('وضع عدم الاتصال', 'Offline mode'),
        t('دعم البصمة', 'Biometric support')
      ]
    },
    {
      version: '2.1.0',
      date: '2025-06-28',
      type: 'web',
      highlights: [
        t('نظام المصادقة الموحد', 'Unified authentication system'),
        t('دعم OAuth متعدد', 'Multi-provider OAuth support'),
        t('تحسينات الأمان', 'Security enhancements')
      ]
    },
    {
      version: '2.0.0',
      date: '2025-06-15',
      type: 'web',
      highlights: [
        t('إطلاق منصة ContraMind', 'Launch of ContraMind platform'),
        t('دعم اللغة العربية الكامل', 'Full Arabic language support'),
        t('أدوات تحليل العقود بالذكاء الاصطناعي', 'AI-powered contract analysis tools')
      ]
    }
  ];

  const filteredReleases = filter === 'all' 
    ? releases 
    : releases.filter(release => release.type === filter);

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
              <span>{t('المساعدة', 'Help')} › {t('ملاحظات الإصدار', 'Release Notes')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('ما الجديد', "What's New")}
        </h1>

        {/* Latest Release Callout */}
        <div className="bg-[#B7DEE8]/10 border border-[#B7DEE8]/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#B7DEE8] text-[#0C2836]">
              {t('أحدث إصدار', 'Latest Release')}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('الإصدار', 'Version')} {releases[0].version}
          </h2>
          <p className="text-gray-600">
            {t('تحديثات رئيسية لتحسين تجربة المستخدم', 'Major updates to improve user experience')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-8">
          {(['all', 'web', 'desktop', 'mobile'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === type
                  ? "bg-[#0C2836] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              )}
            >
              {type === 'all' && t('الكل', 'All')}
              {type === 'web' && t('الويب', 'Web')}
              {type === 'desktop' && t('سطح المكتب', 'Desktop')}
              {type === 'mobile' && t('الجوال', 'Mobile')}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {filteredReleases.map((release, index) => (
            <div key={release.version} className="relative">
              {/* Timeline line */}
              {index < filteredReleases.length - 1 && (
                <div className={cn(
                  "absolute top-10 bottom-0 w-0.5 bg-gray-200",
                  isRTL ? "right-4" : "left-4"
                )} />
              )}

              <div className={cn(
                "flex gap-4",
                isRTL && "flex-row-reverse"
              )}>
                {/* Timeline dot */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  release.isLatest ? "bg-[#B7DEE8]" : "bg-gray-300"
                )}>
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
                  <div className={cn(
                    "flex items-start justify-between mb-4",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div>
                      <div className={cn(
                        "flex items-center gap-3 mb-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Tag className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('الإصدار', 'Version')} {release.version}
                        </h3>
                        {release.isLatest && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t('جديد', 'New')}
                          </span>
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 text-sm text-gray-500",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Calendar className="w-4 h-4" />
                        <span>{release.date}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      release.type === 'web' && "bg-blue-100 text-blue-800",
                      release.type === 'desktop' && "bg-purple-100 text-purple-800",
                      release.type === 'mobile' && "bg-green-100 text-green-800"
                    )}>
                      {release.type === 'web' && t('ويب', 'Web')}
                      {release.type === 'desktop' && t('سطح المكتب', 'Desktop')}
                      {release.type === 'mobile' && t('جوال', 'Mobile')}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {release.highlights.map((highlight, i) => (
                      <li key={i} className={cn(
                        "flex items-start gap-2 text-gray-700",
                        isRTL && "flex-row-reverse"
                      )}>
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}