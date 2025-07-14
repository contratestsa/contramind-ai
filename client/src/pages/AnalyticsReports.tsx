import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, Shield, DollarSign, FileText,
  Calendar, BarChart2, Activity
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalyticsReports() {
  const { language, t } = useLanguage();

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
    <DashboardLayout currentPage="analytics">
      {/* Main Content - 16px vertical rhythm */}
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

            {/* KPI Ribbon - exactly 5 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {kpiData.map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <div className={cn("flex items-center justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                    <kpi.icon className="w-5 h-5 text-[#0C2836]" />
                    {kpi.trend !== 0 && (
                      <div className={cn("flex items-center gap-1", kpi.trend > 0 ? "text-green-600" : "text-red-600")}>
                        <TrendingUp className={cn("w-3 h-3", kpi.trend < 0 && "rotate-180")} />
                        <span className="text-xs font-medium">{kpi.trend > 0 ? '+' : ''}{kpi.trend}%</span>
                      </div>
                    )}
                  </div>
                  <div className={cn(language === 'ar' && "text-right")}>
                    <p className="text-2xl font-bold text-[#0C2836] mb-1">{kpi.value}</p>
                    <p className="text-sm text-gray-600">{kpi.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trend Charts - 3 charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Line Chart - Cycle Time */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <h3 className={cn("text-base font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                  {t('وقت الدورة حسب نوع العقد', 'Cycle-time by contract type')}
                </h3>
                <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  <span className="text-sm">{t('خط بياني', 'Line Chart')}</span>
                </div>
              </motion.div>

              {/* Bar Chart - Amendments */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <h3 className={cn("text-base font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                  {t('التعديلات لكل ربع', 'Amendments per quarter')}
                </h3>
                <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded">
                  <BarChart2 className="w-6 h-6 mr-2" />
                  <span className="text-sm">{t('رسم بياني شريطي', 'Bar Chart')}</span>
                </div>
              </motion.div>

              {/* Heat Map - Risk vs Counterparty */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.15 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <h3 className={cn("text-base font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                  {t('مستوى المخاطر مقابل الطرف المقابل', 'Risk level vs counter-party')}
                </h3>
                <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded">
                  <Activity className="w-6 h-6 mr-2" />
                  <span className="text-sm">{t('خريطة حرارية', 'Heat-map')}</span>
                </div>
              </motion.div>
            </div>

            {/* Renewal Radar - 3 tiles */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.2 }}
              className="mb-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('رادار التجديد', 'Renewal Radar')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[90, 60, 30].map((days) => (
                  <div key={days} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className={cn("flex items-center justify-between mb-3", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-2xl font-bold text-[#0C2836]">{Math.floor(Math.random() * 10 + 5)}</span>
                      <Calendar className="w-5 h-5 text-[#B7DEE8]" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {t(`عقود تنتهي خلال ${days} يوم`, `Contracts expiring in ${days} days`)}
                    </p>
                    <div className={cn("flex gap-2", language === 'ar' && "flex-row-reverse")}>
                      <button className="flex-1 px-2 py-1 text-xs bg-[#B7DEE8] text-[#0C2836] rounded hover:bg-[#a5d0db] transition-colors duration-150">
                        {t('تجديد', 'Renew')}
                      </button>
                      <button className="flex-1 px-2 py-1 text-xs border border-[#B7DEE8] text-[#0C2836] rounded hover:bg-[#f0f9ff] transition-colors duration-150">
                        {t('تفاوض', 'Renegotiate')}
                      </button>
                      <button className="flex-1 px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors duration-150">
                        {t('إنهاء', 'Terminate')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Clause Deviation Table */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.25 }}
              className="bg-white rounded-lg p-4 shadow-sm mb-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('انحراف البنود', 'Clause Deviation')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className={cn("px-4 py-2 text-xs font-medium text-gray-600 uppercase", language === 'ar' ? "text-right" : "text-left")}>
                        {t('البند', 'Clause')}
                      </th>
                      <th className={cn("px-4 py-2 text-xs font-medium text-gray-600 uppercase", language === 'ar' ? "text-right" : "text-left")}>
                        {t('عدد المرات', 'Frequency')}
                      </th>
                      <th className={cn("px-4 py-2 text-xs font-medium text-gray-600 uppercase", language === 'ar' ? "text-right" : "text-left")}>
                        {t('٪ الانحراف', '% Deviation')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {['Limitation of Liability', 'Payment Terms', 'Termination', 'Indemnification', 'Confidentiality', 
                      'Intellectual Property', 'Warranty', 'Force Majeure', 'Governing Law', 'Dispute Resolution'].map((clause, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className={cn("px-4 py-2 text-sm", language === 'ar' ? "text-right" : "text-left")}>{clause}</td>
                        <td className={cn("px-4 py-2 text-sm", language === 'ar' ? "text-right" : "text-left")}>{Math.floor(Math.random() * 50 + 10)}</td>
                        <td className={cn("px-4 py-2 text-sm", language === 'ar' ? "text-right" : "text-left")}>
                          <span className={Math.random() > 0.5 ? "text-red-600" : "text-green-600"}>
                            {Math.floor(Math.random() * 30 + 5)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Export & Schedule Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('التصدير والجدولة', 'Export & Schedule')}
              </h3>
              <div className={cn("flex flex-col md:flex-row items-center gap-4", language === 'ar' && "md:flex-row-reverse")}>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] text-white rounded hover:bg-[#1a4158] transition-colors duration-150">
                  <Download className="w-4 h-4" />
                  {t('تنزيل PDF', 'Download PDF')}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] text-white rounded hover:bg-[#1a4158] transition-colors duration-150">
                  <FileText className="w-4 h-4" />
                  {t('تنزيل Excel', 'Download Excel')}
                </button>
                <div className={cn("flex items-center gap-2 ml-auto", language === 'ar' ? "mr-auto ml-0" : "")}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#B7DEE8] rounded focus:ring-[#B7DEE8]" />
                    <span className="text-sm text-gray-700">{t('إرسال ملخص أسبوعي بالبريد', 'Email weekly digest')}</span>
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAB */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#B7DEE8] rounded-full shadow-lg flex items-center justify-center hover:bg-[rgba(183,222,232,0.9)] transition-colors">
          <span className="text-[#0C2836] text-2xl">+</span>
        </button>
    </DashboardLayout>
  );
}