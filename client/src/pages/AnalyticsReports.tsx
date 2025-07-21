import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Shield, 
  Activity,
  CheckCircle,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AnalyticsReports() {
  const { language, t } = useLanguage();
  const [dateFilter, setDateFilter] = useState('last30days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  // Fetch contracts data
  const { data: contractsData = { contracts: [] }, refetch: refetchContracts } = useQuery<{ contracts: any[] }>({
    queryKey: ['/api/contracts'],
    enabled: true,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch chat data
  const { data: chatsData = { chats: [] }, refetch: refetchChats } = useQuery<{ chats: any[] }>({
    queryKey: ['/api/contracts/chats'],
    enabled: true,
    refetchInterval: 30000
  });

  const contracts = contractsData.contracts || [];
  const hasNoContracts = contracts.length === 0;

  // Calculate metrics from real data
  const totalContracts = contracts.length;
  const avgRiskScore = contracts.length > 0 
    ? Math.round(contracts.reduce((acc: number, c: any) => acc + (c.riskLevel || 0), 0) / contracts.length)
    : 0;
  const activeContracts = contracts.filter((c: any) => c.status === 'active').length;
  const highRiskContracts = contracts.filter((c: any) => c.riskLevel > 70).length;
  
  // Calculate compliance rate (contracts with low risk)
  const complianceRate = contracts.length > 0
    ? Math.round((contracts.filter((c: any) => c.riskLevel <= 30).length / contracts.length) * 100)
    : 0;

  // Calculate contracts this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const contractsThisMonth = contracts.filter((c: any) => 
    new Date(c.createdAt) >= firstDayOfMonth
  ).length;

  // Prepare contract type distribution data
  const contractTypes = contracts.reduce((acc: any, c: any) => {
    const type = c.type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const contractTypeData = Object.entries(contractTypes).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value as number / totalContracts) * 100)
  }));

  // Risk distribution data
  const riskDistribution = {
    low: contracts.filter((c: any) => c.riskLevel <= 30).length,
    medium: contracts.filter((c: any) => c.riskLevel > 30 && c.riskLevel <= 70).length,
    high: contracts.filter((c: any) => c.riskLevel > 70).length
  };

  const riskDistributionData = [
    { name: t('منخفض', 'Low'), value: riskDistribution.low, color: '#10B981', percentage: Math.round((riskDistribution.low / totalContracts) * 100) || 0 },
    { name: t('متوسط', 'Medium'), value: riskDistribution.medium, color: '#F59E0B', percentage: Math.round((riskDistribution.medium / totalContracts) * 100) || 0 },
    { name: t('مرتفع', 'High'), value: riskDistribution.high, color: '#EF4444', percentage: Math.round((riskDistribution.high / totalContracts) * 100) || 0 }
  ];

  // Monthly trend data
  const monthlyTrendData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' });
    const count = contracts.filter((c: any) => {
      const contractDate = new Date(c.createdAt);
      return contractDate.getMonth() === date.getMonth() && 
             contractDate.getFullYear() === date.getFullYear();
    }).length;
    monthlyTrendData.push({ month: monthName, count });
  }

  // Common risk areas data
  const riskAreas = [
    { name: t('المسؤولية', 'Liability'), count: 0 },
    { name: t('شروط الدفع', 'Payment Terms'), count: 0 },
    { name: t('الإنهاء', 'Termination'), count: 0 },
    { name: t('حقوق الملكية الفكرية', 'IP Rights'), count: 0 }
  ];

  // Simulate risk areas based on contract types and risk levels
  contracts.forEach((c: any) => {
    if (c.riskLevel > 50) {
      // Randomly assign risk areas for demo (in production, this would come from actual analysis)
      const riskIndex = Math.floor(Math.random() * 4);
      riskAreas[riskIndex].count++;
    }
  });

  // Recent contracts for the table
  const recentContracts = contracts.slice(0, 5).map((c: any) => ({
    id: c.id,
    name: c.title,
    date: new Date(c.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
    riskScore: c.riskLevel,
    status: c.status,
    type: c.type
  }));

  // Metric cards data
  const metricCards = [
    {
      title: t('إجمالي العقود', 'Total Contracts'),
      value: totalContracts.toString(),
      change: contractsThisMonth > 0 ? `+${contractsThisMonth}` : '0',
      changeLabel: t('هذا الشهر', 'this month'),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: t('متوسط درجة المخاطر', 'Average Risk Score'),
      value: avgRiskScore.toString(),
      subtitle: avgRiskScore <= 30 ? t('منخفض', 'Low') : avgRiskScore <= 70 ? t('متوسط', 'Medium') : t('مرتفع', 'High'),
      icon: Shield,
      color: avgRiskScore <= 30 ? 'text-green-600' : avgRiskScore <= 70 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: t('العقود النشطة', 'Active Contracts'),
      value: activeContracts.toString(),
      percentage: totalContracts > 0 ? Math.round((activeContracts / totalContracts) * 100) : 0,
      percentageLabel: t('من الإجمالي', 'of total'),
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: t('معدل الامتثال', 'Compliance Rate'),
      value: `${complianceRate}%`,
      trend: complianceRate >= 80 ? 'up' : 'down',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  // Export functionality
  const handleExport = () => {
    // In production, this would generate a real report
    const reportData = {
      date: new Date().toISOString(),
      totalContracts,
      avgRiskScore,
      activeContracts,
      complianceRate,
      contractTypes: contractTypeData,
      riskDistribution: riskDistributionData,
      monthlyTrend: monthlyTrendData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const pieChartColors = ['#0C2836', '#1a4158', '#2d5a7b', '#4d7ea8', '#B7DEE8'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        showMobile={showMobile}
        setShowMobile={setShowMobile}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4", language === 'ar' && "md:flex-row-reverse")}>
              <div className={cn(language === 'ar' && "text-right")}>
                <h1 className="text-2xl font-bold text-[#0C2836]">
                  {t('التحليلات والتقارير', 'Analytics & Reports')}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t('رؤى شاملة حول أداء العقود', 'Comprehensive insights into contract performance')}
                </p>
              </div>
              
              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                {/* Date Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                      language === 'ar' && "flex-row-reverse"
                    )}
                  >
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {dateFilter === 'last30days' ? t('آخر 30 يوم', 'Last 30 days') :
                       dateFilter === 'last90days' ? t('آخر 90 يوم', 'Last 90 days') :
                       t('كل الوقت', 'All time')}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {showDateDropdown && (
                    <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                      <button
                        onClick={() => {
                          setDateFilter('last30days');
                          setShowDateDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                      >
                        {t('آخر 30 يوم', 'Last 30 days')}
                      </button>
                      <button
                        onClick={() => {
                          setDateFilter('last90days');
                          setShowDateDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                      >
                        {t('آخر 90 يوم', 'Last 90 days')}
                      </button>
                      <button
                        onClick={() => {
                          setDateFilter('alltime');
                          setShowDateDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                      >
                        {t('كل الوقت', 'All time')}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#1a4158] transition-colors",
                    language === 'ar' && "flex-row-reverse"
                  )}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{t('تصدير', 'Export')}</span>
                </button>
              </div>
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
                <button 
                  onClick={() => window.location.href = '/chat'}
                  className="px-6 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#1a4158] transition-colors"
                >
                  {t('تحميل عقد', 'Upload Contract')}
                </button>
              </motion.div>
            ) : (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metricCards.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.05 }}
                      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                    >
                      <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                        <card.icon className={cn("w-8 h-8", card.color)} />
                        {card.trend && (
                          <div className={cn("flex items-center gap-1", card.trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                            {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                      <h3 className={cn("text-2xl font-bold text-gray-900", language === 'ar' && "text-right")}>
                        {card.value}
                      </h3>
                      <p className={cn("text-sm text-gray-600 mt-1", language === 'ar' && "text-right")}>
                        {card.title}
                      </p>
                      {card.change && (
                        <p className={cn("text-xs text-gray-500 mt-2", language === 'ar' && "text-right")}>
                          <span className="text-green-600 font-medium">{card.change}</span> {card.changeLabel}
                        </p>
                      )}
                      {card.subtitle && (
                        <p className={cn("text-xs mt-2", card.color, language === 'ar' && "text-right")}>
                          {card.subtitle}
                        </p>
                      )}
                      {card.percentage !== undefined && (
                        <p className={cn("text-xs text-gray-500 mt-2", language === 'ar' && "text-right")}>
                          <span className="font-medium">{card.percentage}%</span> {card.percentageLabel}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contract Type Distribution */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.2 }}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                      {t('توزيع أنواع العقود', 'Contract Types')}
                    </h3>
                    {contractTypeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={contractTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percentage }) => `${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {contractTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-gray-500">
                        {t('لا توجد بيانات متاحة', 'No data available')}
                      </div>
                    )}
                  </motion.div>

                  {/* Risk Distribution */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.25 }}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                      {t('توزيع مستويات المخاطر', 'Risk Levels')}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                      <p className="text-2xl font-bold text-[#0C2836]">{totalContracts}</p>
                      <p className="text-sm text-gray-600">{t('إجمالي العقود', 'Total Contracts')}</p>
                    </div>
                  </motion.div>

                  {/* Monthly Trend */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.3 }}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                      {t('اتجاه حجم العقود', 'Contract Volume Trend')}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#0C2836" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Common Risk Areas */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.35 }}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                      {t('مجالات المخاطر الشائعة', 'Common Risk Areas')}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={riskAreas} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0C2836" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* Recent Activity Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: 0.4 }}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className={cn("p-6 border-b border-gray-200", language === 'ar' && "text-right")}>
                    <h3 className="text-lg font-semibold text-[#0C2836]">
                      {t('تحليل العقود الأخيرة', 'Recent Contract Analysis')}
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", language === 'ar' && "text-right")}>
                            {t('اسم العقد', 'Contract Name')}
                          </th>
                          <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", language === 'ar' && "text-right")}>
                            {t('التاريخ', 'Date')}
                          </th>
                          <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", language === 'ar' && "text-right")}>
                            {t('درجة المخاطر', 'Risk Score')}
                          </th>
                          <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", language === 'ar' && "text-right")}>
                            {t('الحالة', 'Status')}
                          </th>
                          <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", language === 'ar' && "text-right")}>
                            {t('الإجراء', 'Action')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentContracts.map((contract: any) => (
                          <tr key={contract.id} className="hover:bg-gray-50">
                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", language === 'ar' && "text-right")}>
                              {contract.name}
                            </td>
                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-600", language === 'ar' && "text-right")}>
                              {contract.date}
                            </td>
                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm", language === 'ar' && "text-right")}>
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                contract.riskScore <= 30 ? "bg-green-100 text-green-800" :
                                contract.riskScore <= 70 ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              )}>
                                {contract.riskScore}
                              </span>
                            </td>
                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-600", language === 'ar' && "text-right")}>
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                contract.status === 'active' ? "bg-green-100 text-green-800" :
                                contract.status === 'draft' ? "bg-gray-100 text-gray-800" :
                                "bg-blue-100 text-blue-800"
                              )}>
                                {contract.status === 'active' ? t('نشط', 'Active') :
                                 contract.status === 'draft' ? t('مسودة', 'Draft') :
                                 t('قيد المراجعة', 'Under Review')}
                              </span>
                            </td>
                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm", language === 'ar' && "text-right")}>
                              <button
                                onClick={() => window.location.href = `/contracts/${contract.id}`}
                                className="text-[#0C2836] hover:text-[#1a4158] font-medium"
                              >
                                {t('عرض', 'View')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      {t(`عرض 1 إلى ${Math.min(5, totalContracts)} من ${totalContracts} نتيجة`, 
                        `Showing 1 to ${Math.min(5, totalContracts)} of ${totalContracts} results`)}
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                        {t('السابق', 'Previous')}
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                        {t('التالي', 'Next')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}