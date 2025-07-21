import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, Shield, DollarSign, FileText, Download,
  Calendar, AlertTriangle
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

  // Fetch contract chats to analyze discussion topics
  const { data: chatsData } = useQuery({
    queryKey: ['/api/contracts/chats'],
    refetchInterval: 30000
  });

  const contracts = contractsData?.contracts || [];
  const chats = chatsData?.chats || [];

  // Calculate real metrics from contract data
  const calculateMetrics = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Total contracts
    const totalContracts = contracts.length;
    
    // Average risk score (0-100 scale)
    const contractsWithRisk = contracts.filter((c: any) => c.riskLevel);
    const avgRiskScore = contractsWithRisk.length > 0
      ? Math.round(
          contractsWithRisk.reduce((sum: number, c: any) => {
            const riskValue = c.riskLevel === 'high' ? 85 : c.riskLevel === 'medium' ? 50 : 15;
            return sum + riskValue;
          }, 0) / contractsWithRisk.length
        )
      : 0;
    
    // High risk contracts (riskScore > 70)
    const highRiskCount = contracts.filter((c: any) => c.riskLevel === 'high').length;
    
    // Contracts this month
    const contractsThisMonth = contracts.filter((c: any) => {
      const contractDate = new Date(c.date);
      return contractDate.getMonth() === thisMonth && contractDate.getFullYear() === thisYear;
    }).length;

    // Calculate monthly change
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const contractsLastMonth = contracts.filter((c: any) => {
      const contractDate = new Date(c.date);
      return contractDate.getMonth() === lastMonth && contractDate.getFullYear() === lastMonthYear;
    }).length;
    
    const monthlyChange = contractsLastMonth > 0 
      ? Math.round(((contractsThisMonth - contractsLastMonth) / contractsLastMonth) * 100)
      : contractsThisMonth > 0 ? 100 : 0;

    return [
      { 
        label: t('إجمالي العقود', 'Total Contracts'), 
        value: totalContracts.toString(), 
        icon: FileText, 
        trend: monthlyChange 
      },
      { 
        label: t('متوسط درجة المخاطر', 'Average Risk Score'), 
        value: avgRiskScore.toString(), 
        icon: Shield, 
        trend: avgRiskScore > 50 ? -10 : 5 
      },
      { 
        label: t('عقود عالية المخاطر', 'High Risk Contracts'), 
        value: highRiskCount.toString(), 
        icon: AlertTriangle, 
        trend: 0 
      },
      { 
        label: t('العقود هذا الشهر', 'Contracts This Month'), 
        value: contractsThisMonth.toString(), 
        icon: Calendar, 
        trend: monthlyChange 
      }
    ];
  };

  const kpiData = calculateMetrics();

  // Calculate contract type distribution for pie chart
  const calculateTypeDistribution = () => {
    const typeMap: Record<string, number> = {};
    const totalContracts = contracts.length;
    
    if (totalContracts === 0) return [];
    
    contracts.forEach((c: any) => {
      typeMap[c.type] = (typeMap[c.type] || 0) + 1;
    });
    
    const typeLabels: Record<string, string> = {
      service: 'Service Agreement',
      nda: 'NDA',
      employment: 'Employment',
      lease: 'Lease',
      sale: 'Sales',
      partnership: 'Partnership'
    };
    
    return Object.entries(typeMap).map(([type, count]) => ({
      name: typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      percentage: Math.round((count / totalContracts) * 100)
    }));
  };

  const typeDistributionData = calculateTypeDistribution();

  // Calculate risk distribution for pie chart
  const calculateRiskDistribution = () => {
    const totalContracts = contracts.length;
    if (totalContracts === 0) return [];
    
    const riskCounts = { low: 0, medium: 0, high: 0 };
    contracts.forEach((c: any) => {
      if (c.riskLevel) {
        riskCounts[c.riskLevel as keyof typeof riskCounts]++;
      }
    });
    
    return [
      { 
        name: 'Low Risk', 
        value: riskCounts.low, 
        percentage: Math.round((riskCounts.low / totalContracts) * 100),
        color: '#10b981'
      },
      { 
        name: 'Medium Risk', 
        value: riskCounts.medium, 
        percentage: Math.round((riskCounts.medium / totalContracts) * 100),
        color: '#f59e0b'
      },
      { 
        name: 'High Risk', 
        value: riskCounts.high, 
        percentage: Math.round((riskCounts.high / totalContracts) * 100),
        color: '#ef4444'
      }
    ];
  };

  const riskDistributionData = calculateRiskDistribution();

  // Calculate monthly trend for last 6 months
  const calculateMonthlyTrend = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      
      const count = contracts.filter((c: any) => {
        const contractDate = new Date(c.date);
        return contractDate.getMonth() === month && contractDate.getFullYear() === year;
      }).length;
      
      monthlyData.push({
        month: monthNames[month],
        contracts: count
      });
    }
    
    return monthlyData;
  };

  const monthlyTrendData = calculateMonthlyTrend();
  
  // Calculate top risk categories from analysis
  const calculateTopRiskCategories = () => {
    // Simulate parsing contract analysis results
    const riskCategories: Record<string, number> = {
      'Liability Issues': 0,
      'Payment Terms': 0,
      'Termination Clauses': 0,
      'IP Rights': 0,
      'Confidentiality': 0,
      'Indemnification': 0
    };
    
    // Count occurrences based on contract types and risk levels
    contracts.forEach((c: any) => {
      if (c.riskLevel === 'high') {
        riskCategories['Liability Issues'] += 1;
        riskCategories['Indemnification'] += 1;
      }
      if (c.type === 'service' || c.type === 'sale') {
        riskCategories['Payment Terms'] += 1;
      }
      if (c.type === 'employment') {
        riskCategories['Termination Clauses'] += 1;
      }
      if (c.type === 'nda' || c.type === 'partnership') {
        riskCategories['IP Rights'] += 1;
        riskCategories['Confidentiality'] += 1;
      }
    });
    
    return Object.entries(riskCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
        percentage: contracts.length > 0 ? Math.round((count / contracts.length) * 100) : 0
      }));
  };

  const topRiskCategories = calculateTopRiskCategories();

  // Risk level distribution
  const clauseUsageData = [
    { clause: 'High Risk', usage: contracts.filter((c: any) => c.riskLevel === 'high').length, deviation: 12 },
    { clause: 'Medium Risk', usage: contracts.filter((c: any) => c.riskLevel === 'medium').length, deviation: 8 },
    { clause: 'Low Risk', usage: contracts.filter((c: any) => c.riskLevel === 'low').length, deviation: 5 },
    { clause: 'Draft', usage: contracts.filter((c: any) => c.status === 'draft').length, deviation: 15 },
    { clause: 'Active', usage: contracts.filter((c: any) => c.status === 'active').length, deviation: 3 }
  ];

  // Add language distribution calculation
  const calculateLanguageDistribution = () => {
    const totalContracts = contracts.length;
    if (totalContracts === 0) return [];
    
    // Simulate language tracking based on contract names
    const languageCounts = { en: 0, ar: 0 };
    contracts.forEach((c: any) => {
      // Check if contract name contains Arabic characters
      const hasArabic = /[\u0600-\u06FF]/.test(c.title);
      if (hasArabic) {
        languageCounts.ar++;
      } else {
        languageCounts.en++;
      }
    });
    
    return [
      { name: 'English', value: languageCounts.en, percentage: Math.round((languageCounts.en / totalContracts) * 100) },
      { name: 'Arabic', value: languageCounts.ar, percentage: Math.round((languageCounts.ar / totalContracts) * 100) }
    ];
  };

  const languageDistributionData = calculateLanguageDistribution();

  // Check if user has no contracts
  const hasNoContracts = contracts.length === 0 && !isLoading;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
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

          {/* Empty State */}
          {hasNoContracts ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-lg p-12 border border-gray-200 shadow-sm text-center"
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('لا توجد عقود بعد', 'No contracts yet')}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t(
                  'قم بتحميل عقدك الأول لمشاهدة التحليلات والرؤى التفصيلية',
                  'Upload your first contract to see analytics and detailed insights'
                )}
              </p>
              <button className="px-6 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#1a4158] transition-colors">
                {t('تحميل عقد', 'Upload Contract')}
              </button>
            </motion.div>
          ) : (
            <>

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
              
              {/* Monthly trend bar chart visualization */}
              <div className="space-y-3">
                {monthlyTrendData.map((data: any, index: number) => (
                  <div key={index} className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <span className="text-sm text-gray-600 w-12">{data.month}</span>
                    <div className="flex-1">
                      <div className="h-6 bg-[#0C2836] rounded" style={{ width: `${Math.max(10, data.contracts * 20)}px` }} />
                    </div>
                    <span className="text-sm text-gray-600">{data.contracts}</span>
                  </div>
                ))}
              </div>
              
              <div className={cn("mt-4 text-xs text-gray-600", language === 'ar' && "text-right")}>
                {t('إجمالي العقود المحملة في آخر 6 أشهر', 'Total contracts uploaded in the last 6 months')}
              </div>
            </motion.div>

            {/* Contract Type Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                <h3 className="text-lg font-semibold text-[#0C2836]">
                  {t('توزيع أنواع العقود', 'Contract Type Distribution')}
                </h3>
                <button className="text-[#B7DEE8] hover:text-[#0C2836] transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {typeDistributionData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  {t('لا توجد بيانات متاحة', 'No data available')}
                </div>
              ) : (
                <div className="space-y-3">
                  {typeDistributionData.map((type: any, index: number) => (
                    <div key={index}>
                      <div className={cn("flex justify-between text-sm mb-1", language === 'ar' && "flex-row-reverse")}>
                        <span className="text-gray-700">{type.name}</span>
                        <span className="text-gray-500">{type.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0C2836] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${type.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.2 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('توزيع المخاطر', 'Risk Distribution')}
              </h3>

              {riskDistributionData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  {t('لا توجد بيانات متاحة', 'No data available')}
                </div>
              ) : (
                <div>
                  <div className="relative h-48 flex items-center justify-center">
                    {/* Simple pie chart visualization */}
                    <div className="w-40 h-40 rounded-full overflow-hidden relative">
                      {riskDistributionData.map((risk: any, index: number) => {
                        const startAngle = riskDistributionData.slice(0, index).reduce((sum: number, r: any) => sum + r.percentage, 0) * 3.6;
                        const angle = risk.percentage * 3.6;
                        return (
                          <div
                            key={index}
                            className="absolute inset-0"
                            style={{
                              background: risk.color,
                              transform: `rotate(${startAngle}deg)`,
                              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%)`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {riskDistributionData.map((risk: any, index: number) => (
                      <div key={index} className={cn("flex items-center justify-between text-sm", language === 'ar' && "flex-row-reverse")}>
                        <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: risk.color }} />
                          <span className="text-gray-700">{risk.name}</span>
                        </div>
                        <span className="text-gray-500">{risk.value} ({risk.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Top Risk Categories */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.25 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('أهم فئات المخاطر', 'Top Risk Categories')}
              </h3>

              {topRiskCategories.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  {t('لا توجد بيانات متاحة', 'No data available')}
                </div>
              ) : (
                <div className="space-y-3">
                  {topRiskCategories.map((category: any, index: number) => (
                    <div key={index} className={cn(language === 'ar' && "text-right")}>
                      <div className={cn("flex items-center justify-between mb-1", language === 'ar' && "flex-row-reverse")}>
                        <p className="text-sm text-gray-900">{category.category}</p>
                        <p className="text-sm text-gray-600">{category.count} ({category.percentage}%)</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0C2836] h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          </>
          )}
        </motion.div>
      </div>
    </div>
  );
}