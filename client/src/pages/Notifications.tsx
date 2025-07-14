import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Bell, Clock, AlertCircle, CheckCircle, X, Mail, Smartphone, MessageSquare,
  Calendar, Eye, BellOff, Filter, Check, AlertTriangle
} from 'lucide-react';

export default function Notifications() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('action');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const isRTL = language === 'ar';

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
      case 'signature':
        return <CheckCircle className="w-5 h-5 text-[#0C2836]" />;
      case 'draft':
        return <Bell className="w-5 h-5 text-[#B7DEE8]" />;
      case 'renewal':
      case 'obligation':
        return <Calendar className="w-5 h-5 text-[#0C2836]" />;
      case 'audit':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'integration':
      case 'permission':
      case 'system':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const tabs = [
    { id: 'action', label: t('يتطلب إجراء', 'Action Required'), count: actionRequiredNotifications.filter(n => !n.read).length },
    { id: 'deadlines', label: t('المواعيد النهائية', 'Upcoming Deadlines'), count: upcomingDeadlines.filter(n => !n.read).length },
    { id: 'system', label: t('تنبيهات النظام', 'System Alerts'), count: systemAlerts.filter(n => !n.read).length }
  ];

  return (
    <motion.div 
      className="flex-1 overflow-y-auto bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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
              {t('إدارة التنبيهات والمواعيد النهائية', 'Manage alerts and deadlines')}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className={cn("flex border-b border-gray-200", language === 'ar' && "flex-row-reverse")}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                    activeTab === tab.id
                      ? "text-[#0C2836] bg-gray-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <div className={cn("flex items-center justify-center gap-2", language === 'ar' && "flex-row-reverse")}>
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0C2836]" />
                  )}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-200">
              {getNotificationsByTab().map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className={cn(
                    "p-4 hover:bg-gray-50 transition-colors",
                    !notification.read && "bg-blue-50"
                  )}
                >
                  <div className={cn("flex items-start gap-3", language === 'ar' && "flex-row-reverse")}>
                    {getNotificationIcon(notification.type)}
                    
                    <div className="flex-1 min-w-0">
                      <div className={cn("flex items-start justify-between gap-4", language === 'ar' && "flex-row-reverse")}>
                        <div className={cn(language === 'ar' && "text-right")}>
                          <h3 className="text-gray-900 font-medium">
                            {language === 'ar' ? notification.titleAr : notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-0.5">
                            {language === 'ar' ? notification.descriptionAr : notification.description}
                          </p>
                          
                          {/* SLA Timer or Due Date */}
                          <div className={cn("flex items-center gap-4 mt-2", language === 'ar' && "flex-row-reverse")}>
                            {notification.slaTimer && (
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className={cn(
                                  "text-xs font-medium",
                                  notification.priority === 'high' ? "text-red-600" :
                                  notification.priority === 'medium' ? "text-yellow-600" :
                                  "text-gray-600"
                                )}>
                                  {t('متبقي', 'SLA')}: {notification.slaTimer}
                                </span>
                              </div>
                            )}
                            
                            {notification.daysRemaining !== undefined && (
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className={cn(
                                  "text-xs font-medium",
                                  notification.daysRemaining <= 1 ? "text-red-600" :
                                  notification.daysRemaining <= 7 ? "text-yellow-600" :
                                  "text-gray-600"
                                )}>
                                  {notification.daysRemaining} {t('يوم متبقي', 'days remaining')}
                                </span>
                              </div>
                            )}
                            
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                          </div>
                        </div>

                        <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                          {!notification.read && (
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          {notification.muted !== undefined && (
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              {notification.muted ? (
                                <BellOff className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Bell className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          )}
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
              {t('تفضيلات الإشعارات', 'Notification Preferences')}
            </h3>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                  <Mail className="w-5 h-5 text-[#0C2836]" />
                  <div className={cn(language === 'ar' && "text-right")}>
                    <p className="text-gray-900 font-medium">{t('إشعارات البريد الإلكتروني', 'Email Notifications')}</p>
                    <p className="text-gray-600 text-sm">{t('تلقي التحديثات المهمة عبر البريد الإلكتروني', 'Receive important updates via email')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    emailNotifs ? "bg-[#0C2836]" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      emailNotifs ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* In-App Notifications */}
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                  <Bell className="w-5 h-5 text-[#0C2836]" />
                  <div className={cn(language === 'ar' && "text-right")}>
                    <p className="text-gray-900 font-medium">{t('إشعارات داخل التطبيق', 'In-App Notifications')}</p>
                    <p className="text-gray-600 text-sm">{t('عرض الإشعارات في التطبيق', 'Show notifications within the app')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInAppNotifs(!inAppNotifs)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    inAppNotifs ? "bg-[#0C2836]" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      inAppNotifs ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* Slack Integration */}
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                  <MessageSquare className="w-5 h-5 text-[#0C2836]" />
                  <div className={cn(language === 'ar' && "text-right")}>
                    <p className="text-gray-900 font-medium">{t('تكامل Slack', 'Slack Integration')}</p>
                    <p className="text-gray-600 text-sm">{t('إرسال التنبيهات إلى قناة Slack', 'Send alerts to Slack channel')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSlackNotifs(!slackNotifs)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    slackNotifs ? "bg-[#0C2836]" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      slackNotifs ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                  <Smartphone className="w-5 h-5 text-[#0C2836]" />
                  <div className={cn(language === 'ar' && "text-right")}>
                    <p className="text-gray-900 font-medium">{t('إشعارات الدفع', 'Push Notifications')}</p>
                    <p className="text-gray-600 text-sm">{t('تلقي التنبيهات على جهازك المحمول', 'Receive alerts on mobile device')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPushNotifs(!pushNotifs)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    pushNotifs ? "bg-[#0C2836]" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      pushNotifs ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}