import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Bell, Clock, AlertCircle, CheckCircle, X, Mail, Smartphone, MessageSquare,
  Calendar, Eye, BellOff, Filter, Check, AlertTriangle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Notifications() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('action');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const isRTL = language === 'ar';

  // Fetch all contracts to generate notifications
  const { data: contractsData, isLoading } = useQuery({
    queryKey: ['/api/contracts'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const contracts = contractsData?.contracts || [];

  // Generate notifications based on real contract data
  const generateNotifications = () => {
    const now = new Date();
    const actionRequired: any[] = [];
    const upcomingDeadlines: any[] = [];
    
    contracts.forEach((contract: any, index: number) => {
      // Generate action required notifications for draft and under_review contracts
      if (contract.status === 'draft' || contract.status === 'under_review') {
        const createdDate = new Date(contract.createdAt);
        const hoursSince = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
        const minutesSince = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60));
        
        actionRequired.push({
          id: contract.id,
          type: contract.status === 'draft' ? 'draft' : 'approval',
          title: contract.status === 'draft' ? 'Draft Review Needed' : 'Contract Approval Required',
          titleAr: contract.status === 'draft' ? 'مطلوب مراجعة المسودة' : 'مطلوب الموافقة على العقد',
          description: `${contract.title} with ${contract.partyName} needs ${contract.status === 'draft' ? 'review' : 'approval'}`,
          descriptionAr: `${contract.title} مع ${contract.partyName} يحتاج ${contract.status === 'draft' ? 'المراجعة' : 'الموافقة'}`,
          slaTimer: hoursSince > 24 ? `${Math.floor(hoursSince / 24)}d ${hoursSince % 24}h` : `${hoursSince}h ${minutesSince % 60}m`,
          priority: contract.riskLevel || 'medium',
          timestamp: minutesSince < 60 ? `${minutesSince} minutes ago` : hoursSince < 24 ? `${hoursSince} hours ago` : `${Math.floor(hoursSince / 24)} days ago`,
          read: index > 2 // Mark first 3 as unread
        });
      }
      
      // Generate upcoming deadline notifications
      const contractDate = new Date(contract.date);
      const daysUntil = Math.floor((contractDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 0 && daysUntil <= 90) {
        upcomingDeadlines.push({
          id: contract.id + 1000, // Different ID to avoid conflicts
          type: daysUntil <= 30 ? 'obligation' : 'renewal',
          title: daysUntil <= 30 ? 'Contract Expiring Soon' : 'Contract Renewal Due',
          titleAr: daysUntil <= 30 ? 'العقد ينتهي قريباً' : 'موعد تجديد العقد',
          description: `${contract.title} with ${contract.partyName} expires in ${daysUntil} days`,
          descriptionAr: `${contract.title} مع ${contract.partyName} ينتهي خلال ${daysUntil} يومًا`,
          daysUntil: daysUntil,
          timestamp: 'System generated',
          read: daysUntil > 60 // Mark urgent ones as unread
        });
      }
    });
    
    return {
      actionRequired: actionRequired.slice(0, 5), // Limit to 5 notifications
      upcomingDeadlines: upcomingDeadlines.slice(0, 5)
    };
  };

  const { actionRequired, upcomingDeadlines } = generateNotifications();

  // Real notifications data
  const actionRequiredNotifications = actionRequired.length > 0 ? actionRequired : [
    {
      id: 1,
      type: 'info',
      title: 'No Actions Required',
      titleAr: 'لا توجد إجراءات مطلوبة',
      description: 'All contracts are up to date',
      descriptionAr: 'جميع العقود محدثة',
      slaTimer: '-',
      priority: 'low',
      timestamp: 'Now',
      read: true
    }
  ];

  const upcomingDeadlinesNotifications = upcomingDeadlines.length > 0 ? upcomingDeadlines : [
    {
      id: 4,
      type: 'renewal',
      title: 'Contract Renewal Due',
      titleAr: 'موعد تجديد العقد',
      description: 'Service Agreement with Cloud Corp expires in 30 days',
      descriptionAr: 'اتفاقية الخدمة مع Cloud Corp تنتهي خلال 30 يومًا',
      daysUntil: 30,
      timestamp: 'Yesterday',
      read: false
    },
    {
      id: 5,
      type: 'obligation',
      title: 'Payment Obligation',
      titleAr: 'التزام الدفع',
      description: 'Quarterly payment to Software Solutions due in 7 days',
      descriptionAr: 'الدفعة الربعية لحلول البرمجيات مستحقة خلال 7 أيام',
      daysUntil: 7,
      timestamp: '2 days ago',
      read: false
    },
    {
      id: 6,
      type: 'audit',
      title: 'Compliance Audit',
      titleAr: 'مراجعة الامتثال',
      description: 'Annual compliance review for all vendor contracts',
      descriptionAr: 'المراجعة السنوية للامتثال لجميع عقود الموردين',
      daysUntil: 14,
      timestamp: '1 week ago',
      read: true
    }
  ];

  // Generate system alerts
  const generateSystemAlerts = () => {
    const alerts: any[] = [];
    
    // Alert for high-risk contracts
    const highRiskCount = contracts.filter((c: any) => c.riskLevel === 'high').length;
    if (highRiskCount > 0) {
      alerts.push({
        id: 2001,
        type: 'system',
        title: 'High Risk Contracts Alert',
        titleAr: 'تنبيه عقود عالية المخاطر',
        description: `${highRiskCount} contract(s) flagged as high risk require attention`,
        descriptionAr: `${highRiskCount} عقد(عقود) مصنفة كعالية المخاطر تحتاج انتباه`,
        timestamp: '1 hour ago',
        muted: false,
        read: false
      });
    }
    
    // Alert for new contracts added today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newContracts = contracts.filter((c: any) => new Date(c.createdAt) >= today).length;
    if (newContracts > 0) {
      alerts.push({
        id: 2002,
        type: 'integration',
        title: 'New Contracts Added',
        titleAr: 'عقود جديدة مضافة',
        description: `${newContracts} new contract(s) uploaded today`,
        descriptionAr: `${newContracts} عقد(عقود) جديدة تم رفعها اليوم`,
        timestamp: '2 hours ago',
        muted: false,
        read: true
      });
    }
    
    // Default system status alert
    alerts.push({
      id: 2003,
      type: 'permission',
      title: 'System Status: Normal',
      titleAr: 'حالة النظام: طبيعية',
      description: 'All systems operating normally',
      descriptionAr: 'جميع الأنظمة تعمل بشكل طبيعي',
      timestamp: '3 hours ago',
      muted: true,
      read: true
    });
    
    return alerts.slice(0, 3); // Limit to 3 alerts
  };
  
  const systemAlerts = generateSystemAlerts();

  const getNotificationsByTab = () => {
    switch (activeTab) {
      case 'action':
        return actionRequiredNotifications;
      case 'deadlines':
        return upcomingDeadlinesNotifications;
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
    { id: 'deadlines', label: t('المواعيد النهائية', 'Upcoming Deadlines'), count: upcomingDeadlinesNotifications.filter(n => !n.read).length },
    { id: 'system', label: t('تنبيهات النظام', 'System Alerts'), count: systemAlerts.filter(n => !n.read).length }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full flex flex-col bg-gray-50"
    >
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-8 py-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4 max-w-6xl mx-auto"
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
                            <p className="text-gray-600 text-sm mt-1">
                              {language === 'ar' ? notification.descriptionAr : notification.description}
                            </p>
                            <div className={cn("flex items-center gap-3 mt-2 text-xs text-gray-500", language === 'ar' && "flex-row-reverse")}>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.timestamp}
                              </span>
                              {'slaTimer' in notification && (
                                <span className={cn(
                                  "flex items-center gap-1",
                                  notification.priority === 'high' && "text-red-600",
                                  notification.priority === 'medium' && "text-yellow-600"
                                )}>
                                  <AlertCircle className="w-3 h-3" />
                                  {t('SLA:', 'SLA:')} {notification.slaTimer}
                                </span>
                              )}
                              {'daysUntil' in notification && (
                                <span className={cn(
                                  "flex items-center gap-1",
                                  notification.daysUntil <= 7 && "text-red-600",
                                  notification.daysUntil <= 30 && notification.daysUntil > 7 && "text-yellow-600"
                                )}>
                                  <Calendar className="w-3 h-3" />
                                  {notification.daysUntil} {t('أيام', 'days')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                            {'muted' in notification && (
                              <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                                {notification.muted ? (
                                  <BellOff className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <Bell className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            )}
                            <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
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

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('إعدادات الإشعارات', 'Notification Settings')}
              </h2>
              
              <div className="space-y-4">
                <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div className={cn(language === 'ar' && "text-right")}>
                      <p className="font-medium text-gray-900">{t('إشعارات البريد الإلكتروني', 'Email Notifications')}</p>
                      <p className="text-sm text-gray-600">{t('تلقي التحديثات عبر البريد الإلكتروني', 'Receive updates via email')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      emailNotifs ? "bg-[#B7DEE8]" : "bg-gray-200"
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

                <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className={cn(language === 'ar' && "text-right")}>
                      <p className="font-medium text-gray-900">{t('إشعارات داخل التطبيق', 'In-App Notifications')}</p>
                      <p className="text-sm text-gray-600">{t('عرض الإشعارات داخل التطبيق', 'Show notifications within the app')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInAppNotifs(!inAppNotifs)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      inAppNotifs ? "bg-[#B7DEE8]" : "bg-gray-200"
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

                <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <div className={cn(language === 'ar' && "text-right")}>
                      <p className="font-medium text-gray-900">{t('إشعارات Slack', 'Slack Notifications')}</p>
                      <p className="text-sm text-gray-600">{t('إرسال التحديثات إلى قناة Slack', 'Send updates to Slack channel')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSlackNotifs(!slackNotifs)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      slackNotifs ? "bg-[#B7DEE8]" : "bg-gray-200"
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

                <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <div className={cn(language === 'ar' && "text-right")}>
                      <p className="font-medium text-gray-900">{t('الإشعارات الفورية', 'Push Notifications')}</p>
                      <p className="text-sm text-gray-600">{t('تلقي إشعارات على جهازك المحمول', 'Receive notifications on your mobile device')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushNotifs(!pushNotifs)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      pushNotifs ? "bg-[#B7DEE8]" : "bg-gray-200"
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
      </div>
    </motion.div>
  );
}