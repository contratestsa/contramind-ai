import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Menu, Settings, HelpCircle, LogOut, ChevronRight,
  TrendingUp, Clock, Shield, DollarSign, FileText, Download,
  Calendar, AlertTriangle, BarChart2, Activity, Send
} from 'lucide-react';
import logoImage from "@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png";

export default function AnalyticsReports() {
  const [, setLocation] = useLocation();
  const { user, isLoading, logout } = useAuth();
  const { language, t } = useLanguage();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  // KPI Data
  const kpiData = [
    { label: t('متوسط وقت الدورة', 'Avg Cycle Time'), value: '12 days', icon: Clock, trend: -15 },
    { label: t('التجديدات في الوقت', 'On-Time Renewals'), value: '87%', icon: Calendar, trend: 5 },
    { label: t('الالتزامات النشطة', 'Active Obligations'), value: '234', icon: FileText, trend: 0 },
    { label: t('متوسط درجة المخاطر', 'Avg Risk Score'), value: '3.2', icon: Shield, trend: -8 },
    { label: t('الوفورات المحققة', 'Savings Captured'), value: '$1.2M', icon: DollarSign, trend: 22 }
  ];

  // Mock data for charts
  const cycleTimeData = [
    { month: 'Jan', nda: 8, msa: 15, sow: 22 },
    { month: 'Feb', nda: 7, msa: 14, sow: 20 },
    { month: 'Mar', nda: 9, msa: 16, sow: 19 },
    { month: 'Apr', nda: 6, msa: 12, sow: 18 },
    { month: 'May', nda: 7, msa: 13, sow: 17 },
    { month: 'Jun', nda: 5, msa: 11, sow: 16 }
  ];

  const amendmentsData = [
    { quarter: 'Q1', count: 45 },
    { quarter: 'Q2', count: 52 },
    { quarter: 'Q3', count: 38 },
    { quarter: 'Q4', count: 61 }
  ];

  const renewalData = [
    { days: 90, contracts: 12, status: 'upcoming' },
    { days: 60, contracts: 8, status: 'review' },
    { days: 30, contracts: 5, status: 'urgent' }
  ];

  const clauseUsageData = [
    { clause: 'Limitation of Liability', usage: 89, deviation: 12 },
    { clause: 'Indemnification', usage: 76, deviation: 8 },
    { clause: 'Termination', usage: 95, deviation: 5 },
    { clause: 'Payment Terms', usage: 82, deviation: 15 },
    { clause: 'Confidentiality', usage: 91, deviation: 3 }
  ];

  return (
    <div className="min-h-screen bg-[#0C2836] flex">
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
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg bg-[rgba(183,222,232,0.1)] text-white",
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
            onClick={() => setLocation('/notifications')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
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
          <span className="text-white font-medium">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>
          <div className="w-9" />
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className={cn("mb-8", language === 'ar' && "text-right")}>
              <h1 className="text-2xl font-semibold text-white mb-2">
                {t('التحليلات والتقارير', 'Analytics & Reports')}
              </h1>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">
                {t('رؤى شاملة حول أداء العقود', 'Comprehensive insights into contract performance')}
              </p>
            </div>

            {/* KPI Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {kpiData.map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.05 }}
                  className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4 border border-[rgba(183,222,232,0.1)]"
                >
                  <div className={cn("flex items-center justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                    <kpi.icon className="w-5 h-5 text-[#B7DEE8]" />
                    <div className={cn("flex items-center gap-1", kpi.trend > 0 ? "text-green-400" : kpi.trend < 0 ? "text-blue-400" : "text-gray-400")}>
                      <TrendingUp className={cn("w-3 h-3", kpi.trend < 0 && "rotate-180")} />
                      <span className="text-xs">{Math.abs(kpi.trend)}%</span>
                    </div>
                  </div>
                  <div className={cn(language === 'ar' && "text-right")}>
                    <p className="text-white text-xl font-semibold">{kpi.value}</p>
                    <p className="text-[rgba(255,255,255,0.7)] text-xs">{kpi.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trend Dashboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Cycle Time Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(183,222,232,0.1)]"
              >
                <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                  <h3 className="text-white font-medium">{t('وقت الدورة حسب نوع العقد', 'Cycle Time by Contract Type')}</h3>
                  <button className="text-[#B7DEE8] hover:text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-48 flex items-end justify-between gap-2">
                  {cycleTimeData.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-1">
                        <div className="bg-[#B7DEE8] rounded" style={{ height: `${month.sow * 2}px` }} />
                        <div className="bg-[rgba(183,222,232,0.7)] rounded" style={{ height: `${month.msa * 2}px` }} />
                        <div className="bg-[rgba(183,222,232,0.4)] rounded" style={{ height: `${month.nda * 2}px` }} />
                      </div>
                      <span className="text-[rgba(255,255,255,0.5)] text-xs">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className={cn("flex gap-4 mt-4 text-xs", language === 'ar' && "flex-row-reverse")}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[rgba(183,222,232,0.4)] rounded" />
                    <span className="text-[rgba(255,255,255,0.7)]">NDA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[rgba(183,222,232,0.7)] rounded" />
                    <span className="text-[rgba(255,255,255,0.7)]">MSA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#B7DEE8] rounded" />
                    <span className="text-[rgba(255,255,255,0.7)]">SOW</span>
                  </div>
                </div>
              </motion.div>

              {/* Amendments Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(183,222,232,0.1)]"
              >
                <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                  <h3 className="text-white font-medium">{t('التعديلات لكل ربع', 'Amendments per Quarter')}</h3>
                  <button className="text-[#B7DEE8] hover:text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-48 flex items-end justify-between gap-4">
                  {amendmentsData.map((quarter, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-[#B7DEE8] rounded transition-all duration-300 hover:bg-[rgba(183,222,232,0.9)]"
                        style={{ height: `${quarter.count * 3}px` }}
                      />
                      <span className="text-white font-semibold">{quarter.count}</span>
                      <span className="text-[rgba(255,255,255,0.5)] text-xs">{quarter.quarter}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Renewal & Expiry Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(183,222,232,0.1)] mb-8"
            >
              <h3 className="text-white font-medium mb-4">{t('رادار التجديد والانتهاء', 'Renewal & Expiry Radar')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renewalData.map((item, index) => (
                  <div key={index} className={cn(
                    "p-4 rounded-lg border",
                    item.status === 'urgent' ? "bg-red-900/20 border-red-500/50" :
                    item.status === 'review' ? "bg-yellow-900/20 border-yellow-500/50" :
                    "bg-green-900/20 border-green-500/50"
                  )}>
                    <div className={cn("flex items-center justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-white font-semibold">{item.days} {t('يوم', 'days')}</span>
                      <span className={cn(
                        "text-sm",
                        item.status === 'urgent' ? "text-red-400" :
                        item.status === 'review' ? "text-yellow-400" :
                        "text-green-400"
                      )}>{item.contracts} {t('عقود', 'contracts')}</span>
                    </div>
                    <div className={cn("flex gap-2", language === 'ar' && "flex-row-reverse")}>
                      <button className="flex-1 px-3 py-1 bg-[rgba(183,222,232,0.1)] rounded text-[#B7DEE8] text-xs hover:bg-[rgba(183,222,232,0.2)] transition-colors">
                        {t('تجديد', 'Renew')}
                      </button>
                      <button className="flex-1 px-3 py-1 bg-[rgba(183,222,232,0.1)] rounded text-[#B7DEE8] text-xs hover:bg-[rgba(183,222,232,0.2)] transition-colors">
                        {t('مفاوضة', 'Negotiate')}
                      </button>
                      <button className="flex-1 px-3 py-1 bg-[rgba(183,222,232,0.1)] rounded text-[#B7DEE8] text-xs hover:bg-[rgba(183,222,232,0.2)] transition-colors">
                        {t('إنهاء', 'Terminate')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Clause Usage & Deviation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(183,222,232,0.1)] mb-8"
            >
              <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                <h3 className="text-white font-medium">{t('استخدام البنود والانحراف', 'Clause Usage & Deviation')}</h3>
                <button className="text-[#B7DEE8] hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {clauseUsageData.map((clause, index) => (
                  <div key={index} className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <div className="flex-1">
                      <div className={cn("flex items-center justify-between mb-1", language === 'ar' && "flex-row-reverse")}>
                        <span className="text-[rgba(255,255,255,0.9)] text-sm">{clause.clause}</span>
                        <span className="text-[rgba(255,255,255,0.5)] text-xs">{clause.usage}%</span>
                      </div>
                      <div className="w-full bg-[rgba(183,222,232,0.1)] rounded-full h-2">
                        <div 
                          className="bg-[#B7DEE8] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${clause.usage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className={cn(
                        "text-xs",
                        clause.deviation > 10 ? "text-red-400" : "text-green-400"
                      )}>{clause.deviation}%</span>
                      <p className="text-[rgba(255,255,255,0.5)] text-xs">{t('انحراف', 'deviation')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Export & Scheduling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(183,222,232,0.1)]"
            >
              <h3 className="text-white font-medium mb-4">{t('التصدير والجدولة', 'Export & Scheduling')}</h3>
              <div className={cn("flex flex-wrap gap-4", language === 'ar' && "flex-row-reverse")}>
                <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(183,222,232,0.1)] rounded-lg text-[#B7DEE8] hover:bg-[rgba(183,222,232,0.2)] transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{t('تصدير PDF', 'Export PDF')}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(183,222,232,0.1)] rounded-lg text-[#B7DEE8] hover:bg-[rgba(183,222,232,0.2)] transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{t('تصدير Excel', 'Export Excel')}</span>
                </button>
                <div className={cn("flex items-center gap-3 ml-auto", language === 'ar' && "mr-auto ml-0")}>
                  <span className="text-[rgba(255,255,255,0.7)] text-sm">{t('إرسال ملخص أسبوعي', 'Email weekly digest')}</span>
                  <button className="w-12 h-6 bg-[rgba(183,222,232,0.2)] rounded-full relative transition-colors hover:bg-[rgba(183,222,232,0.3)]">
                    <div className="w-5 h-5 bg-[#B7DEE8] rounded-full absolute top-0.5 left-0.5 transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAB */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#B7DEE8] rounded-full shadow-lg flex items-center justify-center hover:bg-[rgba(183,222,232,0.9)] transition-colors">
          <span className="text-[#0C2836] text-2xl">+</span>
        </button>
      </div>
    </div>
  );
}