import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Bell, Clock, Calendar, AlertTriangle, CheckCircle,
  Info, Settings2, Check, X, Filter, Download
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Notifications() {
  const { language, t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'alerts'>('all');

  // Mock notification data
  const notifications = [
    {
      id: 1,
      type: 'renewal',
      title: 'Contract Renewal Due',
      message: 'Service Agreement with Tech Solutions expires in 30 days',
      time: '2 hours ago',
      read: false,
      priority: 'high',
      icon: Calendar
    },
    {
      id: 2,
      type: 'approval',
      title: 'Approval Required',
      message: 'NDA with Innovation Partners needs your approval',
      time: '5 hours ago',
      read: false,
      priority: 'high',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'milestone',
      title: 'Milestone Reached',
      message: 'Q4 contract value target achieved: $2.5M',
      time: '1 day ago',
      read: true,
      priority: 'normal',
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'risk',
      title: 'Risk Alert',
      message: 'Clause deviation detected in Employment Contract #234',
      time: '2 days ago',
      read: true,
      priority: 'medium',
      icon: AlertTriangle
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New AI model deployed for contract analysis',
      time: '3 days ago',
      read: true,
      priority: 'low',
      icon: Info
    }
  ];

  const filteredNotifications = notifications.filter(n => {
    if (selectedTab === 'unread') return !n.read;
    if (selectedTab === 'alerts') return n.priority === 'high' || n.priority === 'medium';
    return true;
  });

  // Notification preferences
  const preferences = [
    { key: 'renewals', label: t('التجديدات', 'Renewals'), enabled: true },
    { key: 'approvals', label: t('الموافقات', 'Approvals'), enabled: true },
    { key: 'risks', label: t('التنبيهات', 'Risk Alerts'), enabled: false },
    { key: 'milestones', label: t('الإنجازات', 'Milestones'), enabled: true },
    { key: 'system', label: t('تحديثات النظام', 'System Updates'), enabled: false }
  ];

  return (
    <DashboardLayout currentPage="notifications">
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
              {t('ابق على اطلاع بأحدث التحديثات والتنبيهات', 'Stay updated with the latest updates and alerts')}
            </p>
          </div>

          {/* Tabs and Actions */}
          <div className={cn("flex flex-col md:flex-row justify-between gap-4 mb-4", language === 'ar' && "md:flex-row-reverse")}>
            {/* Tabs */}
            <div className={cn("flex gap-2 bg-gray-100 p-1 rounded-lg", language === 'ar' && "flex-row-reverse")}>
              <button
                onClick={() => setSelectedTab('all')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-150",
                  selectedTab === 'all' 
                    ? "bg-white text-[#0C2836] shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {t('الكل', 'All')} ({notifications.length})
              </button>
              <button
                onClick={() => setSelectedTab('unread')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-150",
                  selectedTab === 'unread' 
                    ? "bg-white text-[#0C2836] shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {t('غير مقروء', 'Unread')} ({notifications.filter(n => !n.read).length})
              </button>
              <button
                onClick={() => setSelectedTab('alerts')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-150",
                  selectedTab === 'alerts' 
                    ? "bg-white text-[#0C2836] shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {t('التنبيهات', 'Alerts')} ({notifications.filter(n => n.priority === 'high' || n.priority === 'medium').length})
              </button>
            </div>

            {/* Actions */}
            <div className={cn("flex gap-2", language === 'ar' && "flex-row-reverse")}>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <Filter className="w-4 h-4" />
                <span>{t('تصفية', 'Filter')}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <Download className="w-4 h-4" />
                <span>{t('تصدير', 'Export')}</span>
              </button>
              <button className="px-4 py-2 text-sm text-[#0C2836] hover:text-[#B7DEE8] transition-colors duration-150">
                {t('تحديد الكل كمقروء', 'Mark all as read')}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className={cn(
                  "bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-150",
                  !notification.read && "border-l-4 border-[#B7DEE8]"
                )}
              >
                <div className={cn("flex items-start gap-4", language === 'ar' && "flex-row-reverse")}>
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    notification.priority === 'high' && "bg-red-100",
                    notification.priority === 'medium' && "bg-yellow-100",
                    notification.priority === 'normal' && "bg-blue-100",
                    notification.priority === 'low' && "bg-gray-100"
                  )}>
                    <notification.icon className={cn(
                      "w-5 h-5",
                      notification.priority === 'high' && "text-red-600",
                      notification.priority === 'medium' && "text-yellow-600",
                      notification.priority === 'normal' && "text-blue-600",
                      notification.priority === 'low' && "text-gray-600"
                    )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className={cn("flex items-start justify-between", language === 'ar' && "flex-row-reverse")}>
                      <div className={cn(language === 'ar' && "text-right")}>
                        <h4 className={cn(
                          "text-sm font-semibold text-[#0C2836]",
                          !notification.read && "text-[#0C2836]"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className={cn("flex items-center gap-2 mt-2", language === 'ar' && "flex-row-reverse")}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                      </div>
                      <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                        {!notification.read && (
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                            <Check className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Notification Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.2 }}
            className="bg-white rounded-lg p-4 shadow-sm mt-6"
          >
            <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
              <h3 className="text-lg font-semibold text-[#0C2836]">
                {t('تفضيلات الإشعارات', 'Notification Preferences')}
              </h3>
              <Settings2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {preferences.map((pref) => (
                <div key={pref.key} className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                  <span className="text-sm text-gray-700">{pref.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B7DEE8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B7DEE8]"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">
                    {notifications.filter(n => !n.read).length}
                  </p>
                  <p className="text-sm text-gray-600">{t('غير مقروء', 'Unread')}</p>
                </div>
                <Bell className="w-8 h-8 text-[#B7DEE8]" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">
                    {notifications.filter(n => n.priority === 'high').length}
                  </p>
                  <p className="text-sm text-gray-600">{t('عاجل', 'Urgent')}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">
                    {notifications.filter(n => n.type === 'approval').length}
                  </p>
                  <p className="text-sm text-gray-600">{t('بانتظار الموافقة', 'Pending Approval')}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">
                    {notifications.filter(n => n.type === 'renewal').length}
                  </p>
                  <p className="text-sm text-gray-600">{t('التجديدات القادمة', 'Upcoming Renewals')}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#B7DEE8]" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}