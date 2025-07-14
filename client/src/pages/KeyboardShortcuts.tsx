import { useLocation } from "wouter";
import { ArrowLeft, Command, Search, Plus, Upload, MessageSquare, Settings, LogOut } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function KeyboardShortcuts() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const isRTL = language === 'ar';

  // Keyboard shortcuts data
  const shortcutCategories = [
    {
      category: t('التنقل', 'Navigation'),
      shortcuts: [
        {
          keys: ['Cmd', 'K'],
          keysWindows: ['Ctrl', 'K'],
          description: t('فتح البحث السريع', 'Open quick search'),
          icon: Search
        },
        {
          keys: ['Cmd', 'B'],
          keysWindows: ['Ctrl', 'B'],
          description: t('تبديل الشريط الجانبي', 'Toggle sidebar'),
          icon: null
        },
        {
          keys: ['Cmd', '1'],
          keysWindows: ['Ctrl', '1'],
          description: t('الذهاب إلى لوحة التحكم', 'Go to Dashboard'),
          icon: null
        },
        {
          keys: ['Cmd', '2'],
          keysWindows: ['Ctrl', '2'],
          description: t('الذهاب إلى ملفاتي', 'Go to My Drive'),
          icon: null
        }
      ]
    },
    {
      category: t('الإجراءات', 'Actions'),
      shortcuts: [
        {
          keys: ['Cmd', 'N'],
          keysWindows: ['Ctrl', 'N'],
          description: t('محادثة جديدة', 'New chat'),
          icon: Plus
        },
        {
          keys: ['Cmd', 'U'],
          keysWindows: ['Ctrl', 'U'],
          description: t('رفع عقد', 'Upload contract'),
          icon: Upload
        },
        {
          keys: ['Cmd', 'Enter'],
          keysWindows: ['Ctrl', 'Enter'],
          description: t('إرسال الرسالة', 'Send message'),
          icon: MessageSquare
        },
        {
          keys: ['Esc'],
          keysWindows: ['Esc'],
          description: t('إغلاق النافذة المنبثقة', 'Close modal'),
          icon: null
        }
      ]
    },
    {
      category: t('تحرير النص', 'Text Editing'),
      shortcuts: [
        {
          keys: ['Cmd', 'C'],
          keysWindows: ['Ctrl', 'C'],
          description: t('نسخ', 'Copy'),
          icon: null
        },
        {
          keys: ['Cmd', 'V'],
          keysWindows: ['Ctrl', 'V'],
          description: t('لصق', 'Paste'),
          icon: null
        },
        {
          keys: ['Cmd', 'Z'],
          keysWindows: ['Ctrl', 'Z'],
          description: t('تراجع', 'Undo'),
          icon: null
        },
        {
          keys: ['Cmd', 'Shift', 'Z'],
          keysWindows: ['Ctrl', 'Shift', 'Z'],
          description: t('إعادة', 'Redo'),
          icon: null
        }
      ]
    },
    {
      category: t('إعدادات الحساب', 'Account Settings'),
      shortcuts: [
        {
          keys: ['Cmd', ','],
          keysWindows: ['Ctrl', ','],
          description: t('فتح الإعدادات', 'Open settings'),
          icon: Settings
        },
        {
          keys: ['Cmd', 'Shift', 'Q'],
          keysWindows: ['Ctrl', 'Shift', 'Q'],
          description: t('تسجيل الخروج', 'Sign out'),
          icon: LogOut
        }
      ]
    }
  ];

  // Detect if user is on Mac
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const renderKey = (key: string) => {
    // Replace Cmd with ⌘ symbol for Mac
    if (isMac && key === 'Cmd') {
      return '⌘';
    }
    return key;
  };

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
              <span>{t('المساعدة', 'Help')} › {t('اختصارات لوحة المفاتيح', 'Keyboard Shortcuts')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B7DEE8]/20 rounded-full mb-4">
            <Command className="w-8 h-8 text-[#0C2836]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('اختصارات لوحة المفاتيح', 'Keyboard Shortcuts')}
          </h1>
          <p className="text-gray-600">
            {t('تعلم الاختصارات لتحسين سرعة عملك', 'Learn shortcuts to improve your workflow')}
          </p>
        </div>

        {/* Platform Notice */}
        <div className="bg-[#B7DEE8]/10 border border-[#B7DEE8]/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700 text-center">
            {isMac 
              ? t('أنت تستخدم macOS. الاختصارات المعروضة مخصصة لنظامك.', 'You\'re using macOS. The shortcuts shown are for your system.')
              : t('أنت تستخدم Windows/Linux. الاختصارات المعروضة مخصصة لنظامك.', 'You\'re using Windows/Linux. The shortcuts shown are for your system.')}
          </p>
        </div>

        {/* Shortcuts Grid */}
        <div className="space-y-8">
          {shortcutCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {category.shortcuts.map((shortcut, shortcutIndex) => {
                  const Icon = shortcut.icon;
                  const keys = isMac ? shortcut.keys : shortcut.keysWindows;
                  
                  return (
                    <div key={shortcutIndex} className="px-6 py-4">
                      <div className={cn(
                        "flex items-center justify-between",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className={cn(
                          "flex items-center gap-3",
                          isRTL && "flex-row-reverse"
                        )}>
                          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                          <span className="text-gray-700">{shortcut.description}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1",
                          isRTL && "flex-row-reverse"
                        )}>
                          {keys.map((key, keyIndex) => (
                            <span key={keyIndex} className={cn(
                              "inline-flex items-center justify-center min-w-[32px] px-2 py-1",
                              "bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-700",
                              "shadow-sm"
                            )}>
                              {renderKey(key)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('نصائح للمحترفين', 'Pro Tips')}
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className={cn(
              "flex items-start gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <span className="text-[#0C2836] mt-0.5">•</span>
              <span>
                {t('استخدم Cmd/Ctrl + K للبحث السريع في أي مكان في التطبيق',
                   'Use Cmd/Ctrl + K for quick search anywhere in the app')}
              </span>
            </li>
            <li className={cn(
              "flex items-start gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <span className="text-[#0C2836] mt-0.5">•</span>
              <span>
                {t('اضغط Esc مرتين للخروج من أي وضع تحرير',
                   'Press Esc twice to exit any editing mode')}
              </span>
            </li>
            <li className={cn(
              "flex items-start gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <span className="text-[#0C2836] mt-0.5">•</span>
              <span>
                {t('معظم الأزرار لديها تلميحات تظهر عند التمرير عليها',
                   'Most buttons have tooltips that appear on hover')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}