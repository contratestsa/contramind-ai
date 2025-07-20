import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar, Tag, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type FilterType = 'all' | 'web' | 'desktop' | 'mobile' | 'agreement';

interface Release {
  version: string;
  date: string;
  type: 'web' | 'desktop' | 'mobile' | 'agreement';
  tags?: string[];
  highlights: { ar: string; en: string }[];
  isLatest?: boolean;
}

export default function ReleaseNotes() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const pageVariants = {
    initial: { opacity: 0, x: isRTL ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 20 : -20 }
  };

  const releases: Release[] = [
    {
      version: "v1.0.1",
      date: "2025-07-20",
      type: "web",
      tags: ["Agreement"],
      isLatest: true,
      highlights: [
        { ar: "تحديث الشروط والأحكام لسياسة الاسترداد الجديدة", en: "Updated Terms & Conditions for new refund policy" },
        { ar: "إضافة قسم حول الامتثال لحفظ البيانات", en: "Added section on data-retention compliance" }
      ]
    },
    {
      version: "2.5.0",
      date: "2025-01-10",
      type: "web",
      highlights: [
        { ar: "تحسينات كبيرة في سرعة تحليل العقود", en: "Major improvements in contract analysis speed" },
        { ar: "واجهة مستخدم جديدة للوحة التحكم", en: "New dashboard user interface" },
        { ar: "دعم تصدير التقارير بصيغة PDF", en: "Support for exporting reports in PDF format" }
      ]
    },
    {
      version: "2.1.0",
      date: "2024-12-15",
      type: "desktop",
      highlights: [
        { ar: "إطلاق تطبيق سطح المكتب لنظامي macOS و Windows", en: "Desktop app launch for macOS and Windows" },
        { ar: "المزامنة التلقائية مع الحساب السحابي", en: "Automatic sync with cloud account" },
        { ar: "وضع العمل دون اتصال", en: "Offline mode functionality" }
      ]
    },
    {
      version: "2.4.2",
      date: "2024-11-28",
      type: "web",
      highlights: [
        { ar: "إصلاحات للأخطاء وتحسينات في الأداء", en: "Bug fixes and performance improvements" },
        { ar: "تحسين دعم اللغة العربية في التحليل", en: "Enhanced Arabic language support in analysis" },
        { ar: "واجهة برمجة تطبيقات جديدة للمطورين", en: "New API endpoints for developers" }
      ]
    },
    {
      version: "1.0.0",
      date: "2024-10-01",
      type: "mobile",
      highlights: [
        { ar: "إطلاق تطبيق الهاتف المحمول التجريبي", en: "Beta mobile app launch" },
        { ar: "عرض العقود والتحليلات على الهاتف", en: "View contracts and analyses on mobile" },
        { ar: "الإشعارات الفورية للتحديثات المهمة", en: "Push notifications for important updates" }
      ]
    },
    {
      version: "2.3.0",
      date: "2024-09-15",
      type: "web",
      highlights: [
        { ar: "ميزة التعاون الجماعي على العقود", en: "Team collaboration features for contracts" },
        { ar: "سجل المراجعات وتتبع التغييرات", en: "Audit log and change tracking" },
        { ar: "تكامل مع أدوات الإنتاجية الشائعة", en: "Integration with popular productivity tools" }
      ]
    }
  ];

  const filteredReleases = releases.filter(release => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'agreement') {
      return release.tags?.some(tag => 
        tag.toLowerCase() === 'agreement' || tag.toLowerCase() === 'policy'
      ) || false;
    }
    return release.type === activeFilter;
  });

  const filterButtons: { value: FilterType; label: { ar: string; en: string } }[] = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'web', label: { ar: 'الويب', en: 'Web' } },
    { value: 'desktop', label: { ar: 'سطح المكتب', en: 'Desktop' } },
    { value: 'mobile', label: { ar: 'الهاتف المحمول', en: 'Mobile' } },
    { value: 'agreement', label: { ar: 'الاتفاقية', en: 'Agreement' } }
  ];

  const scrollToLatest = () => {
    const latestElement = document.getElementById('latest-release');
    if (latestElement) {
      latestElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
      <div className="max-w-4xl mx-auto px-6 py-12">
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
              {t('ملاحظات الإصدار', 'Release Notes')}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.15 }}
          className="mb-12"
        >
          <h1 className={cn("text-4xl font-bold text-white mb-4", isRTL && "text-right")}>
            {t('ما الجديد', "What's New")}
          </h1>
          <p className={cn("text-lg text-[#B7DEE8]/80", isRTL && "text-right")}>
            {t('تابع آخر التحديثات والميزات الجديدة في ContraMind', 'Keep track of the latest updates and new features in ContraMind')}
          </p>
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.15 }}
          className={cn("flex gap-3 mb-8 flex-wrap", isRTL && "flex-row-reverse")}
        >
          {filterButtons.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveFilter(filter.value);
                }
              }}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] focus:ring-offset-2 focus:ring-offset-[#0C2836]",
                activeFilter === filter.value
                  ? "bg-[#B7DEE8] text-[#0C2836]"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              role="tab"
              aria-selected={activeFilter === filter.value}
              tabIndex={0}
            >
              {filter.label[language]}
            </button>
          ))}
        </motion.div>

        {/* Latest Release Badge */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.15 }}
          onClick={scrollToLatest}
          className="fixed bottom-8 right-8 bg-[#B7DEE8] text-[#0C2836] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 flex items-center gap-2 font-semibold z-10"
        >
          <Sparkles className="w-5 h-5" />
          {t('أحدث إصدار', 'Latest Release')}
        </motion.button>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className={cn(
            "absolute top-0 bottom-0 w-0.5 bg-[#B7DEE8]/20",
            isRTL ? "right-8" : "left-8"
          )} />

          {/* Releases */}
          <div className="space-y-12">
            {filteredReleases.map((release, index) => (
              <motion.div
                key={release.version}
                id={release.isLatest ? 'latest-release' : undefined}
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.15 }}
                className={cn("relative flex gap-8", isRTL && "flex-row-reverse")}
              >
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute w-4 h-4 rounded-full border-4 border-[#0C2836]",
                  release.isLatest ? "bg-[#B7DEE8]" : "bg-[#B7DEE8]/40",
                  isRTL ? "right-6" : "left-6"
                )} />

                {/* Spacer */}
                <div className="w-16 flex-shrink-0" />

                {/* Content */}
                <div className="flex-1">
                  <div className={cn(
                    "bg-white/5 backdrop-blur-sm rounded-lg p-6 border",
                    release.isLatest ? "border-[#B7DEE8]/40" : "border-[#B7DEE8]/20",
                    "hover:border-[#B7DEE8]/60 transition-colors duration-150"
                  )}>
                    {/* Header */}
                    <div className={cn("flex items-start justify-between mb-4", isRTL && "flex-row-reverse")}>
                      <div>
                        <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                          <h3 className="text-2xl font-bold text-white">v{release.version}</h3>
                          {release.isLatest && (
                            <span className="bg-[#B7DEE8] text-[#0C2836] text-xs font-bold px-2 py-1 rounded">
                              {t('الأحدث', 'LATEST')}
                            </span>
                          )}
                        </div>
                        <div className={cn("flex items-center gap-4 text-sm", isRTL && "flex-row-reverse")}>
                          <span className={cn("flex items-center gap-1 text-[#B7DEE8]/60", isRTL && "flex-row-reverse")}>
                            <Calendar className="w-4 h-4" />
                            {new Date(release.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className={cn("flex items-center gap-1 text-[#B7DEE8]/60", isRTL && "flex-row-reverse")}>
                            <Tag className="w-4 h-4" />
                            {release.type === 'web' && t('ويب', 'Web')}
                            {release.type === 'desktop' && t('سطح المكتب', 'Desktop')}
                            {release.type === 'mobile' && t('الهاتف المحمول', 'Mobile')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <ul className={cn("space-y-3", isRTL && "text-right")}>
                      {release.highlights.map((highlight, idx) => (
                        <li key={idx} className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                          <ChevronRight className={cn("w-5 h-5 text-[#B7DEE8] mt-0.5 flex-shrink-0", isRTL && "rotate-180")} />
                          <span className="text-white/80">{highlight[language]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}