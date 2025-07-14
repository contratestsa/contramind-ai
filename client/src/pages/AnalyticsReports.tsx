import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, Shield, DollarSign, FileText, Download,
  Calendar, AlertTriangle
} from 'lucide-react';

export default function AnalyticsReports() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { language, t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  // KPI Data - exactly 5 cards as requested
  const kpiData = [
    { label: t('وقت الدورة', 'Cycle-time'), value: '12 days', icon: Clock, trend: -15 },
    { label: t('التجديدات في الوقت', '% On-time renewals'), value: '87%', icon: Calendar, trend: 5 },
    { label: t('الالتزامات النشطة', 'Active obligations'), value: '234', icon: FileText, trend: 0 },
    { label: t('متوسط درجة المخاطر', 'Average risk score'), value: '3.2', icon: Shield, trend: -8 },
    { label: t('الوفورات المحققة', 'Savings captured'), value: '$1.2M', icon: DollarSign, trend: 22 }
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
    <div className="min-h-screen bg-gray-50">
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
              {t('التحليلات والتقارير', 'Analytics & Reports')}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('رؤى شاملة حول أداء العقود', 'Comprehensive insights into contract performance')}
            </p>
          </div>

          {/* KPI Cards - 5 cards as requested */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
              >
                <div className={cn("flex items-center justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                  <kpi.icon className="w-5 h-5 text-[#0C2836]" />
                  {kpi.trend !== 0 && (
                    <span className={cn(
                      "text-xs flex items-center gap-1",
                      kpi.trend > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      <TrendingUp className={cn("w-3 h-3", kpi.trend < 0 && "rotate-180")} />
                      {Math.abs(kpi.trend)}%
                    </span>
                  )}
                </div>
                <p className={cn("text-2xl font-bold text-[#0C2836] mb-1", language === 'ar' && "text-right")}>
                  {kpi.value}
                </p>
                <p className={cn("text-sm text-gray-600", language === 'ar' && "text-right")}>
                  {kpi.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cycle Time Trends */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                <h3 className="text-lg font-semibold text-[#0C2836]">
                  {t('اتجاهات وقت الدورة', 'Cycle Time Trends')}
                </h3>
                <button className="text-[#B7DEE8] hover:text-[#0C2836] transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
              
              {/* Simple bar chart visualization */}
              <div className="space-y-3">
                {cycleTimeData.map((data, index) => (
                  <div key={index} className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <span className="text-sm text-gray-600 w-12">{data.month}</span>
                    <div className="flex-1 flex gap-1">
                      <div className="h-6 bg-[#0C2836] rounded" style={{ width: `${data.nda * 3}px` }} />
                      <div className="h-6 bg-[#1a4158] rounded" style={{ width: `${data.msa * 3}px` }} />
                      <div className="h-6 bg-[#B7DEE8] rounded" style={{ width: `${data.sow * 3}px` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={cn("flex gap-6 mt-4 text-xs", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <div className="w-3 h-3 bg-[#0C2836] rounded" />
                  <span className="text-gray-600">NDA</span>
                </div>
                <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <div className="w-3 h-3 bg-[#1a4158] rounded" />
                  <span className="text-gray-600">MSA</span>
                </div>
                <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <div className="w-3 h-3 bg-[#B7DEE8] rounded" />
                  <span className="text-gray-600">SOW</span>
                </div>
              </div>
            </motion.div>

            {/* Contract Amendments */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                <h3 className="text-lg font-semibold text-[#0C2836]">
                  {t('تعديلات العقود', 'Contract Amendments')}
                </h3>
                <button className="text-[#B7DEE8] hover:text-[#0C2836] transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {amendmentsData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="h-32 bg-gradient-to-t from-[#0C2836] to-[#B7DEE8] rounded-lg mb-2 relative">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg"
                        style={{ height: `${100 - (data.count / 61) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{data.quarter}</p>
                    <p className="text-lg font-semibold text-[#0C2836]">{data.count}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Renewals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.2 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('التجديدات القادمة', 'Upcoming Renewals')}
              </h3>

              <div className="space-y-3">
                {renewalData.map((renewal, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      renewal.status === 'urgent' ? 'bg-red-50' : renewal.status === 'review' ? 'bg-yellow-50' : 'bg-green-50',
                      language === 'ar' && "flex-row-reverse"
                    )}
                  >
                    <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                      <AlertTriangle className={cn(
                        "w-4 h-4",
                        renewal.status === 'urgent' ? 'text-red-600' : renewal.status === 'review' ? 'text-yellow-600' : 'text-green-600'
                      )} />
                      <div className={cn(language === 'ar' && "text-right")}>
                        <p className="text-gray-900 font-medium">
                          {renewal.contracts} {t('عقود', 'contracts')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('خلال', 'Within')} {renewal.days} {t('يوم', 'days')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Clause Usage Analysis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.25 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('تحليل استخدام البنود', 'Clause Usage Analysis')}
              </h3>

              <div className="space-y-3">
                {clauseUsageData.map((clause, index) => (
                  <div key={index} className={cn(language === 'ar' && "text-right")}>
                    <div className={cn("flex items-center justify-between mb-1", language === 'ar' && "flex-row-reverse")}>
                      <p className="text-sm text-gray-900">{clause.clause}</p>
                      <p className="text-sm text-gray-600">{clause.usage}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#0C2836] h-2 rounded-full relative"
                        style={{ width: `${clause.usage}%` }}
                      >
                        {clause.deviation > 10 && (
                          <div className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}