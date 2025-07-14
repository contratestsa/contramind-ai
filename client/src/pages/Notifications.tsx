import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Menu, Settings, HelpCircle, LogOut, Bell, Clock,
  AlertCircle, CheckCircle, X, Mail, Smartphone, MessageSquare,
  FileText, BarChart2, Activity, AlertTriangle, Calendar, Eye,
  BellOff, Filter, Check
} from 'lucide-react';
import logoImage from "@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png";

export default function Notifications() {
  const [, setLocation] = useLocation();
  const { user, isLoading, logout } = useAuth();
  const { language, t } = useLanguage();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('action');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#343541]">
        <div className="text-white">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  // Mock notifications data
  const actionRequiredNotifications = [
    {
      id: 1,
      type: 'approval',
      title: 'Contract Approval Required',
      titleAr: 'مطلوب الموافقة على العقد',
      description: 'MSA-2024-001 with Tech Solutions Inc. needs your approval',
      descriptionAr: 'MSA-2024-001 مع شركة الحلول التقنية يحتاج موافقتك',
      slaTimer: '2h 15m',
      priority: 'high',
      timestamp: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'signature',
      title: 'Signature Required',
      titleAr: 'مطلوب التوقيع',
      description: 'Amendment #3 for Global Services LLC is ready for signature',
      descriptionAr: 'التعديل رقم 3 للخدمات العالمية جاهز للتوقيع',
      slaTimer: '5h 30m',
      priority: 'medium',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'draft',
      title: 'Draft Ready for Review',
      titleAr: 'المسودة جاهزة للمراجعة',
      description: 'NDA draft for Innovation Partners has been prepared',
      descriptionAr: 'تم إعداد مسودة اتفاقية عدم الإفصاح لشركاء الابتكار',
      slaTimer: '1d 4h',
      priority: 'low',
      timestamp: '3 hours ago',
      read: true
    }
  ];

  const upcomingDeadlines = [
    {
      id: 4,
      type: 'renewal',
      title: 'Contract Renewal Due',
      titleAr: 'موعد تجديد العقد',
      description: 'Service Agreement SA-2023-015 expires in 30 days',
      descriptionAr: 'اتفاقية الخدمة SA-2023-015 تنتهي خلال 30 يوم',
      dueDate: '2024-02-15',
      daysRemaining: 30,
      escalated: false,
      timestamp: 'Yesterday',
      read: true
    },
    {
      id: 5,
      type: 'obligation',
      title: 'Delivery Obligation',
      titleAr: 'التزام التسليم',
      description: 'Quarterly report due for Project Alpha',
      descriptionAr: 'التقرير الربعي مستحق لمشروع ألفا',
      dueDate: '2024-01-20',
      daysRemaining: 5,
      escalated: false,
      timestamp: '2 days ago',
      read: true
    },
    {
      id: 6,
      type: 'audit',
      title: 'Compliance Audit',
      titleAr: 'تدقيق الامتثال',
      description: 'Annual security audit scheduled',
      descriptionAr: 'تدقيق الأمان السنوي مجدول',
      dueDate: '2024-01-16',
      daysRemaining: 1,
      escalated: true,
      timestamp: 'Just now',
      read: false
    }
  ];

  const systemAlerts = [
    {
      id: 7,
      type: 'integration',
      title: 'Integration Alert',
      titleAr: 'تنبيه التكامل',
      description: 'Salesforce sync failed - authentication error',
      descriptionAr: 'فشل مزامنة Salesforce - خطأ في المصادقة',
      timestamp: '5 minutes ago',
      muted: false,
      read: false
    },
    {
      id: 8,
      type: 'permission',
      title: 'Permission Change',
      titleAr: 'تغيير الصلاحيات',
      description: 'John Smith was granted admin access to Legal Templates',
      descriptionAr: 'تم منح جون سميث صلاحيات المسؤول لقوالب القانونية',
      timestamp: '2 hours ago',
      muted: false,
      read: true
    },
    {
      id: 9,
      type: 'system',
      title: 'System Maintenance',
      titleAr: 'صيانة النظام',
      description: 'Scheduled maintenance on Jan 20, 2024 at 2:00 AM',
      descriptionAr: 'صيانة مجدولة في 20 يناير 2024 الساعة 2:00 صباحًا',
      timestamp: '1 day ago',
      muted: true,
      read: true
    }
  ];

  const getNotificationsByTab = () => {
    switch (activeTab) {
      case 'action':
        return actionRequiredNotifications;
      case 'deadlines':
        return upcomingDeadlines;
      case 'system':
        return systemAlerts;
      default:
        return [];
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
      case 'renewal':
        return CheckCircle;
      case 'signature':
        return FileText;
      case 'draft':
      case 'obligation':
        return FileText;
      case 'audit':
        return AlertCircle;
      case 'integration':
      case 'permission':
      case 'system':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const notifications = getNotificationsByTab();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-[260px] h-screen bg-[#0C2836] flex flex-col fixed z-50 transition-transform duration-300",
        language === 'ar' ? "right-0" : "left-0",
        showMobileSidebar ? "translate-x-0" : language === 'ar' ? "translate-x-full" : "-translate-x-full",
        !showMobileSidebar && "lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-[rgba(183,222,232,0.1)]">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="w-full h-12 object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setLocation('/dashboard')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white", 
              language === 'ar' && "flex-row-reverse")}
          >
            <ArrowLeft className={cn("w-4 h-4 text-[#B7DEE8]", language === 'ar' && "rotate-180")} />
            <span className="text-sm">{t('العودة للوحة التحكم', 'Back to Dashboard')}</span>
          </button>
          
          <button
            onClick={() => setLocation('/analytics')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <BarChart2 className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>
          </button>

          <button
            onClick={() => setLocation('/parties')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <FileText className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>
          </button>

          <button
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg bg-[rgba(183,222,232,0.1)] text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <AlertTriangle className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الإشعارات', 'Notifications')}</span>
          </button>

          <button
            onClick={() => setLocation('/tags')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <Activity className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('العلامات والفئات', 'Tags & Categories')}</span>
          </button>
        </nav>

        {/* Bottom Items */}
        <div className="p-4 border-t border-[rgba(183,222,232,0.1)] space-y-2">
          <button
            onClick={() => setLocation('/settings/personal')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <Settings className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الإعدادات', 'Settings')}</span>
          </button>
          <button
            onClick={() => setLocation('/help')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <HelpCircle className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('المساعدة', 'Help')}</span>
          </button>
          <button
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <LogOut className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('تسجيل الخروج', 'Logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1", language === 'ar' ? "lg:mr-[260px]" : "lg:ml-[260px]")}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#40414F] border-b border-[#565869]">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 hover:bg-[#565869] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-medium">{t('الإشعارات', 'Notifications')}</span>
          <div className="w-9" />
        </div>

        {/* Main Content - Scrollable Column Shell */}
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className={cn("mb-4", language === 'ar' && "text-right")}>
              <h1 className="text-2xl font-bold text-[#0C2836] mb-2">
                {t('الإشعارات', 'Notifications')}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('إدارة الإشعارات والتنبيهات', 'Manage notifications and alerts')}
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg p-1 shadow-sm mb-4">
              <div className={cn("flex", language === 'ar' && "flex-row-reverse")}>
                {[
                  { id: 'action', label: t('إجراء مطلوب', 'Action Required'), count: actionRequiredNotifications.filter(n => !n.read).length },
                  { id: 'deadlines', label: t('المواعيد القادمة', 'Upcoming Deadlines'), count: upcomingDeadlines.filter(n => !n.read).length },
                  { id: 'system', label: t('تنبيهات النظام', 'System Alerts'), count: systemAlerts.filter(n => !n.read).length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 relative",
                      activeTab === tab.id
                        ? "bg-[#B7DEE8] text-[#0C2836]"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={cn(
                        "absolute top-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
                        language === 'ar' ? "left-2" : "right-2"
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const isAction = activeTab === 'action';
                const isDeadline = activeTab === 'deadlines';
                const isSystem = activeTab === 'system';

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    className={cn(
                      "bg-white rounded-lg p-4 shadow-sm border transition-all duration-150",
                      !notification.read ? "border-[#B7DEE8]" : "border-gray-200",
                      isAction && notification.priority === 'high' && "border-red-300 bg-red-50",
                      isDeadline && notification.escalated && "border-yellow-300 bg-yellow-50"
                    )}
                  >
                    <div className={cn("flex items-start gap-4", language === 'ar' && "flex-row-reverse")}>
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        !notification.read ? "bg-[#f0f9ff]" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          !notification.read ? "text-[#0C2836]" : "text-gray-500"
                        )} />
                      </div>

                      <div className="flex-1">
                        <div className={cn("flex items-start justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                          <div className={cn(language === 'ar' && "text-right")}>
                            <h3 className={cn(
                              "font-medium",
                              !notification.read ? "text-gray-900" : "text-gray-700"
                            )}>
                              {language === 'ar' ? notification.titleAr : notification.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {language === 'ar' ? notification.descriptionAr : notification.description}
                            </p>
                          </div>

                          <div className={cn("flex items-center gap-2 ml-4", language === 'ar' && "mr-4 ml-0 flex-row-reverse")}>
                            {isAction && (
                              <div className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                                notification.priority === 'high' ? "bg-red-100 text-red-800" :
                                notification.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              )}>
                                <Clock className="w-3 h-3" />
                                <span>{notification.slaTimer}</span>
                              </div>
                            )}
                            {isDeadline && (
                              <div className={cn(
                                "px-2 py-1 rounded text-xs font-medium",
                                notification.daysRemaining <= 1 ? "bg-red-100 text-red-800" :
                                notification.daysRemaining <= 7 ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              )}>
                                {notification.daysRemaining}d
                              </div>
                            )}
                            {isSystem && notification.muted && (
                              <BellOff className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        <div className={cn("flex items-center justify-between mt-3", language === 'ar' && "flex-row-reverse")}>
                          <span className="text-gray-500 text-xs">{notification.timestamp}</span>
                          
                          <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                            {isAction && (
                              <>
                                <button className="px-3 py-1 bg-[#0C2836] text-white rounded text-xs font-medium hover:bg-[#1a4158] transition-colors duration-150">
                                  {notification.type === 'approval' ? t('موافقة', 'Approve') :
                                   notification.type === 'signature' ? t('توقيع', 'Sign') :
                                   t('مراجعة', 'Review')}
                                </button>
                                <button className="px-3 py-1 border border-[#B7DEE8] text-[#0C2836] rounded text-xs hover:bg-[#f0f9ff] transition-colors duration-150">
                                  {t('تأجيل', 'Snooze')}
                                </button>
                              </>
                            )}
                            {isDeadline && (
                              <button className="px-3 py-1 border border-[#B7DEE8] text-[#0C2836] rounded text-xs hover:bg-[#f0f9ff] transition-colors duration-150">
                                {t('عرض العقد', 'View Contract')}
                              </button>
                            )}
                            {isSystem && !notification.muted && (
                              <button className="px-3 py-1 border border-[#B7DEE8] text-[#0C2836] rounded text-xs hover:bg-[#f0f9ff] transition-colors duration-150">
                                {t('كتم لمدة 7 أيام', 'Mute 7 days')}
                              </button>
                            )}
                            {!notification.read && (
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                <Eye className="w-4 h-4 text-[#0C2836]" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Preference Center */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm mt-6"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('إعدادات الإشعارات', 'Notification Preferences')}
              </h3>
              
              <div className="space-y-4">
                {[
                  { id: 'email', icon: Mail, label: t('البريد الإلكتروني', 'Email'), value: emailNotifs, setter: setEmailNotifs },
                  { id: 'inapp', icon: Bell, label: t('داخل التطبيق', 'In-App'), value: inAppNotifs, setter: setInAppNotifs },
                  { id: 'slack', icon: MessageSquare, label: 'Slack', value: slackNotifs, setter: setSlackNotifs },
                  { id: 'push', icon: Smartphone, label: t('إشعارات الدفع', 'Push Notifications'), value: pushNotifs, setter: setPushNotifs }
                ].map((pref) => (
                  <div key={pref.id} className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                      <pref.icon className="w-4 h-4 text-[#0C2836]" />
                      <span className="text-gray-700 text-sm">{pref.label}</span>
                    </div>
                    <button
                      onClick={() => pref.setter(!pref.value)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-150",
                        pref.value ? "bg-[#B7DEE8]" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm",
                        pref.value ? "translate-x-6" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className={cn("text-gray-500 text-xs", language === 'ar' && "text-right")}>
                  {t('سجل القراءة/غير المقروءة محفوظ لأغراض التدقيق', 'Read/unread audit log is maintained for compliance purposes')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAB */}
        <button className={cn(
          "fixed bottom-8 w-14 h-14 bg-[#0C2836] rounded-full shadow-lg flex items-center justify-center hover:bg-[#1a4158] transition-colors duration-150",
          language === 'ar' ? "left-8" : "right-8"
        )}>
          <span className="text-white text-2xl">+</span>
        </button>
      </div>
    </div>
  );
}