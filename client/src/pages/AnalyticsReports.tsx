import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, Shield, DollarSign, FileText, Download,
  Calendar, AlertTriangle, ChevronDown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export default function AnalyticsReports() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  // Fetch all contracts for analytics
  const { data: contractsData, isLoading } = useQuery({
    queryKey: ['/api/contracts'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const contracts = contractsData?.contracts || [];

  // Calculate real KPIs from contract data
  const calculateKPIs = () => {
    const now = new Date();
    const activeContracts = contracts.filter((c: any) => c.status === 'active').length;
    const totalContracts = contracts.length;
    
    // Calculate average cycle time (days from creation to signed)
    const signedContracts = contracts.filter((c: any) => c.status === 'signed');
    const cycleTimes = signedContracts.map((c: any) => {
      const created = new Date(c.createdAt);
      const signed = new Date(c.updatedAt);
      return Math.floor((signed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    });
    const avgCycleTime = cycleTimes.length > 0 
      ? Math.round(cycleTimes.reduce((a: number, b: number) => a + b, 0) / cycleTimes.length)
      : 0;

    // Calculate on-time renewals percentage (mock calculation)
    const expiringContracts = contracts.filter((c: any) => {
      const contractDate = new Date(c.date);
      const daysDiff = Math.floor((contractDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 90;
    });
    const onTimePercentage = totalContracts > 0 ? Math.round((expiringContracts.length / totalContracts) * 100) : 0;

    // Calculate average risk score
    const riskScores = { low: 1, medium: 2, high: 3 };
    const contractsWithRisk = contracts.filter((c: any) => c.riskLevel);
    const totalRiskScore = contractsWithRisk.reduce((sum: number, c: any) => 
      sum + (riskScores[c.riskLevel as keyof typeof riskScores] || 0), 0
    );
    const avgRiskScore = contractsWithRisk.length > 0 
      ? (totalRiskScore / contractsWithRisk.length).toFixed(1)
      : '0.0';

    return [
      { label: t('وقت الدورة', 'Cycle-time'), value: `${avgCycleTime} days`, icon: Clock, trend: -15 },
      { label: t('التجديدات في الوقت', '% On-time renewals'), value: `${onTimePercentage}%`, icon: Calendar, trend: 5 },
      { label: t('الالتزامات النشطة', 'Active obligations'), value: activeContracts.toString(), icon: FileText, trend: 0 },
      { label: t('متوسط درجة المخاطر', 'Average risk score'), value: avgRiskScore, icon: Shield, trend: -8 },
      { label: t('إجمالي العقود', 'Total contracts'), value: totalContracts.toString(), icon: DollarSign, trend: 22 }
    ];
  };

  const kpiData = calculateKPIs();

  // Calculate contract type distribution
  const calculateTypeDistribution = () => {
    const typeMap: Record<string, number> = {};
    contracts.forEach((c: any) => {
      typeMap[c.type] = (typeMap[c.type] || 0) + 1;
    });
    
    return Object.entries(typeMap).map(([type, count]) => ({
      month: type.toUpperCase(),
      nda: type === 'nda' ? count : 0,
      msa: type === 'service' ? count : 0,
      sow: type === 'employment' ? count : 0
    }));
  };

  const cycleTimeData = calculateTypeDistribution();

  // Calculate status distribution
  const calculateStatusDistribution = () => {
    const statusMap: Record<string, number> = {};
    contracts.forEach((c: any) => {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;
    });
    
    return Object.entries(statusMap).map(([status, count], index) => ({
      quarter: status.charAt(0).toUpperCase() + status.slice(1),
      count
    }));
  };

  const amendmentsData = calculateStatusDistribution();

  // Calculate upcoming renewals
  const calculateRenewals = () => {
    const now = new Date();
    const renewals = { 30: 0, 60: 0, 90: 0 };
    
    contracts.forEach((c: any) => {
      const contractDate = new Date(c.date);
      const daysDiff = Math.floor((contractDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 0 && daysDiff <= 30) renewals[30]++;
      else if (daysDiff > 30 && daysDiff <= 60) renewals[60]++;
      else if (daysDiff > 60 && daysDiff <= 90) renewals[90]++;
    });
    
    return [
      { days: 90, contracts: renewals[90], status: 'upcoming' },
      { days: 60, contracts: renewals[60], status: 'review' },
      { days: 30, contracts: renewals[30], status: 'urgent' }
    ];
  };

  const renewalData = calculateRenewals();

  // Risk level distribution
  const clauseUsageData = [
    { clause: 'High Risk', usage: contracts.filter((c: any) => c.riskLevel === 'high').length, deviation: 12 },
    { clause: 'Medium Risk', usage: contracts.filter((c: any) => c.riskLevel === 'medium').length, deviation: 8 },
    { clause: 'Low Risk', usage: contracts.filter((c: any) => c.riskLevel === 'low').length, deviation: 5 },
    { clause: 'Draft', usage: contracts.filter((c: any) => c.status === 'draft').length, deviation: 15 },
    { clause: 'Active', usage: contracts.filter((c: any) => c.status === 'active').length, deviation: 3 }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0C2836]">
      <div className="p-6 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className={cn("mb-6", language === 'ar' && "text-right")}>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('التحليلات والتقارير', 'Analytics & Reports')}
            </h1>
            <p className="text-gray-400 text-base">
              {t('رؤى شاملة حول أداء العقود', 'Comprehensive insights into contract performance')}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-[#1a4158] rounded-lg p-4 mb-6">
            <div className={cn(
              "flex flex-wrap gap-3 items-center",
              isRTL && "flex-row-reverse"
            )}>
              {/* Date Picker */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] border border-[#B7DEE8]/20 rounded-md text-white hover:bg-[#0C2836]/80 transition-colors">
                <Calendar className="w-4 h-4 text-[#B7DEE8]" />
                <span>{t('تاريخ الرفع: أي وقت', 'Upload Date: Any time')}</span>
                <ChevronDown className="w-4 h-4 text-[#B7DEE8]" />
              </button>

              {/* Contract Type Dropdown */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] border border-[#B7DEE8]/20 rounded-md text-white hover:bg-[#0C2836]/80 transition-colors">
                <span>{t('نوع العقد: أي قيمة', 'Contract Type: is any value')}</span>
                <ChevronDown className="w-4 h-4 text-[#B7DEE8]" />
              </button>

              {/* Internal Parties Dropdown */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] border border-[#B7DEE8]/20 rounded-md text-white hover:bg-[#0C2836]/80 transition-colors">
                <span>{t('الأطراف الداخلية: أي قيمة', 'Internal Parties: is any value')}</span>
                <ChevronDown className="w-4 h-4 text-[#B7DEE8]" />
              </button>

              {/* Counterparties Dropdown */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] border border-[#B7DEE8]/20 rounded-md text-white hover:bg-[#0C2836]/80 transition-colors">
                <span>{t('الأطراف المقابلة: أي قيمة', 'Counterparties: is any value')}</span>
                <ChevronDown className="w-4 h-4 text-[#B7DEE8]" />
              </button>

              {/* More Filters Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#B7DEE8] text-[#0C2836] rounded-md hover:bg-[#B7DEE8]/90 transition-colors font-medium">
                <span>{t('المزيد +3', 'More +3')}</span>
              </button>
            </div>
          </div>

          {/* KPI Cards - 5 cards as requested */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className="bg-[#1a4158] rounded-lg p-6 border border-[#B7DEE8]/20 shadow-sm"
              >
                <div className={cn("flex items-center justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                  <kpi.icon className="w-5 h-5 text-[#B7DEE8]" />
                  {kpi.trend !== 0 && (
                    <span className={cn(
                      "text-xs flex items-center gap-1",
                      kpi.trend > 0 ? "text-green-400" : "text-red-400"
                    )}>
                      <TrendingUp className={cn("w-3 h-3", kpi.trend < 0 && "rotate-180")} />
                      {Math.abs(kpi.trend)}%
                    </span>
                  )}
                </div>
                <p className={cn("text-2xl font-bold text-white mb-1", language === 'ar' && "text-right")}>
                  {kpi.value}
                </p>
                <p className={cn("text-sm text-gray-400", language === 'ar' && "text-right")}>
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
              className="bg-[#1a4158] rounded-lg p-6 border border-[#B7DEE8]/20 shadow-sm"
            >
              <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                <h3 className="text-lg font-semibold text-white">
                  {t('اتجاهات وقت الدورة', 'Cycle Time Trends')}
                </h3>
                <button className="text-[#B7DEE8] hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
              
              {/* Simple bar chart visualization */}
              <div className="space-y-3">
                {cycleTimeData.map((data, index) => (
                  <div key={index} className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <span className="text-sm text-gray-400 w-12">{data.month}</span>
                    <div className="flex-1 flex gap-1">
                      <div className="h-6 bg-[#B7DEE8] rounded" style={{ width: `${data.nda * 3}px` }} />
                      <div className="h-6 bg-[#7ABCCC] rounded" style={{ width: `${data.msa * 3}px` }} />
                      <div className="h-6 bg-[#4D8FA1] rounded" style={{ width: `${data.sow * 3}px` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={cn("flex gap-6 mt-4 text-xs", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <div className="w-3 h-3 bg-[#B7DEE8] rounded" />
                  <span className="text-gray-400">NDA</span>
                </div>
                <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <div className="w-3 h-3 bg-[#7ABCCC] rounded" />
                  <span className="text-gray-400">MSA</span>
                </div>
                <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <div className="w-3 h-3 bg-[#4D8FA1] rounded" />
                  <span className="text-gray-400">SOW</span>
                </div>
              </div>
            </motion.div>

            {/* Contract Amendments */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="bg-[#1a4158] rounded-lg p-6 border border-[#B7DEE8]/20 shadow-sm"
            >
              <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                <h3 className="text-lg font-semibold text-white">
                  {t('تعديلات العقود', 'Contract Amendments')}
                </h3>
                <button className="text-[#B7DEE8] hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {amendmentsData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="h-32 bg-gradient-to-t from-[#4D8FA1] to-[#B7DEE8] rounded-lg mb-2 relative">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#0C2836] rounded-t-lg"
                        style={{ height: `${100 - (data.count / 61) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400">{data.quarter}</p>
                    <p className="text-lg font-semibold text-white">{data.count}</p>
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
              className="bg-[#1a4158] rounded-lg p-6 border border-[#B7DEE8]/20 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-white mb-4", language === 'ar' && "text-right")}>
                {t('التجديدات القادمة', 'Upcoming Renewals')}
              </h3>

              <div className="space-y-3">
                {renewalData.map((renewal, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      renewal.status === 'urgent' ? 'bg-red-900/20 border-red-400/30' : 
                      renewal.status === 'review' ? 'bg-yellow-900/20 border-yellow-400/30' : 
                      'bg-green-900/20 border-green-400/30',
                      language === 'ar' && "flex-row-reverse"
                    )}
                  >
                    <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                      <AlertTriangle className={cn(
                        "w-4 h-4",
                        renewal.status === 'urgent' ? 'text-red-400' : 
                        renewal.status === 'review' ? 'text-yellow-400' : 
                        'text-green-400'
                      )} />
                      <div className={cn(language === 'ar' && "text-right")}>
                        <p className="text-white font-medium">
                          {renewal.contracts} {t('عقود', 'contracts')}
                        </p>
                        <p className="text-sm text-gray-400">
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
              className="bg-[#1a4158] rounded-lg p-6 border border-[#B7DEE8]/20 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-white mb-4", language === 'ar' && "text-right")}>
                {t('تحليل استخدام البنود', 'Clause Usage Analysis')}
              </h3>

              <div className="space-y-3">
                {clauseUsageData.map((clause, index) => (
                  <div key={index} className={cn(language === 'ar' && "text-right")}>
                    <div className={cn("flex items-center justify-between mb-1", language === 'ar' && "flex-row-reverse")}>
                      <p className="text-sm text-white">{clause.clause}</p>
                      <p className="text-sm text-gray-400">{clause.usage}%</p>
                    </div>
                    <div className="w-full bg-[#0C2836] rounded-full h-2">
                      <div 
                        className="bg-[#B7DEE8] h-2 rounded-full relative"
                        style={{ width: `${clause.usage}%` }}
                      >
                        {clause.deviation > 10 && (
                          <div className="absolute -right-1 -top-1 w-4 h-4 bg-red-400 rounded-full" />
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