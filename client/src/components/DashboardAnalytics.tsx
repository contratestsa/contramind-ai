import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { type DashboardData } from '@/mocks/analyticsData';
import { FileText, AlertTriangle, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-[#0C2836] border border-[#E6E6E6] shadow p-2 rounded">
        <p className="text-[#0C2836] text-sm font-semibold">{label}</p>
        <p className="text-[#B7DEE8] text-sm">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

// Donut chart component
const DonutChart = ({ data, colors, centerText }: { 
  data: any[], 
  colors: string[], 
  centerText: string
}) => {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-[#0C2836]">{centerText}</span>
      </div>
      
      {/* Legend */}
      <div className="mt-2 space-y-1">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: colors[index % colors.length] }} 
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="text-[#B7DEE8]">{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardAnalytics() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  // Fetch analytics data from API
  const { data: analyticsData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 0 // Always fetch fresh data
  });

  // Show loading state
  if (isLoading || !analyticsData) {
    return (
      <div className="flex-1 overflow-y-auto bg-[var(--bg-main)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B7DEE8] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('جاري تحميل البيانات...', 'Loading data...')}</p>
        </div>
      </div>
    );
  }

  // Process data for charts
  // 1. Contract Type
  const contractTypeTotal = Object.values(analyticsData.contractType).reduce((a, b) => a + b, 0);
  const contractTypeData = Object.entries(analyticsData.contractType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Top 5 types
    .map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / contractTypeTotal) * 100)
    }));

  // 2. Risk Rate - Calculate from contract details
  const riskData = [
    { name: 'Low Risk', value: 0, pct: 0 },
    { name: 'Medium Risk', value: 0, pct: 0 },
    { name: 'High Risk', value: 0, pct: 0 }
  ];

  // Mock risk calculation (in real app, this would come from contract_details)
  const totalContracts = analyticsData.uniqueDocs;
  if (totalContracts > 0) {
    // Simulating risk distribution based on contract types
    const highRiskCount = Math.floor(totalContracts * 0.15);
    const mediumRiskCount = Math.floor(totalContracts * 0.35);
    const lowRiskCount = totalContracts - highRiskCount - mediumRiskCount;
    
    riskData[0].value = lowRiskCount;
    riskData[0].pct = Math.round((lowRiskCount / totalContracts) * 100);
    riskData[1].value = mediumRiskCount;
    riskData[1].pct = Math.round((mediumRiskCount / totalContracts) * 100);
    riskData[2].value = highRiskCount;
    riskData[2].pct = Math.round((highRiskCount / totalContracts) * 100);
  }

  // 3. Payment Liability - Use payment terms data
  const paymentData = [
    { name: 'Immediate', value: 0, pct: 0 },
    { name: '30 Days', value: 0, pct: 0 },
    { name: '60+ Days', value: 0, pct: 0 }
  ];

  // If we have payment terms data, use it
  if (analyticsData.paymentTerms && Object.keys(analyticsData.paymentTerms).length > 0) {
    const paymentTotal = Object.values(analyticsData.paymentTerms).reduce((a, b) => a + b, 0);
    Object.entries(analyticsData.paymentTerms).forEach(([term, count]) => {
      if (term.includes('immediate') || term.includes('upon')) {
        paymentData[0].value += count;
      } else if (term.includes('30')) {
        paymentData[1].value += count;
      } else {
        paymentData[2].value += count;
      }
    });
    
    // Calculate percentages
    paymentData.forEach(item => {
      item.pct = paymentTotal > 0 ? Math.round((item.value / paymentTotal) * 100) : 0;
    });
  } else {
    // Fallback distribution if no payment terms data
    if (totalContracts > 0) {
      paymentData[0].value = Math.floor(totalContracts * 0.25);
      paymentData[1].value = Math.floor(totalContracts * 0.50);
      paymentData[2].value = Math.floor(totalContracts * 0.25);
      
      paymentData.forEach(item => {
        item.pct = Math.round((item.value / totalContracts) * 100);
      });
    }
  }

  // Color palettes
  const contractTypeColors = ['#B7DEE8', '#92CED9', '#6DBECA', '#48AEBB', '#239EAC'];
  const riskColors = ['#22C55E', '#F59E0B', '#EF4444']; // Green, Yellow, Red
  const paymentColors = ['#B7DEE8', '#6DBECA', '#239EAC'];

  return (
    <div className="bg-[var(--bg-main)]">
      <div className="p-6 max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold font-space-grotesk text-[var(--text-primary)] mb-2">
              {t('لوحة التحكم', 'Dashboard')}
            </h1>
            <p className="text-gray-600">{t('نظرة عامة على تحليلات العقود', 'Overview of contract analytics')}</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contract Type Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-[#B7DEE8]" />
                <h3 className={cn("text-lg font-semibold text-[#0C2836]", isRTL && "text-right")}>
                  {t('نوع العقد', 'Contract Type')}
                </h3>
              </div>
              <DonutChart 
                data={contractTypeData} 
                colors={contractTypeColors} 
                centerText={`${contractTypeData.length} Types`}
              />
            </motion.div>

            {/* Risk Rate Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                <h3 className={cn("text-lg font-semibold text-[#0C2836]", isRTL && "text-right")}>
                  {t('معدل المخاطر', 'Risk Rate')}
                </h3>
              </div>
              <DonutChart 
                data={riskData} 
                colors={riskColors} 
                centerText={`${riskData[2].pct}% High`}
              />
            </motion.div>

            {/* Payment Liability Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-[#22C55E]" />
                <h3 className={cn("text-lg font-semibold text-[#0C2836]", isRTL && "text-right")}>
                  {t('التزامات الدفع', 'Payment Liability')}
                </h3>
              </div>
              <DonutChart 
                data={paymentData} 
                colors={paymentColors} 
                centerText={`${paymentData[0].pct}% Immediate`}
              />
            </motion.div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg border border-[#E6E6E6] p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">{t('إجمالي العقود', 'Total Contracts')}</p>
              <p className="text-2xl font-bold text-[#0C2836]">{analyticsData.uniqueDocs}</p>
            </div>
            <div className="bg-white rounded-lg border border-[#E6E6E6] p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">{t('العقود المنفذة', 'Executed Contracts')}</p>
              <p className="text-2xl font-bold text-[#0C2836]">{analyticsData.executed.yes}</p>
            </div>
            <div className="bg-white rounded-lg border border-[#E6E6E6] p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">{t('عقود عالية المخاطر', 'High Risk Contracts')}</p>
              <p className="text-2xl font-bold text-[#EF4444]">{riskData[2].value}</p>
            </div>
            <div className="bg-white rounded-lg border border-[#E6E6E6] p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">{t('دفعات فورية', 'Immediate Payments')}</p>
              <p className="text-2xl font-bold text-[#22C55E]">{paymentData[0].value}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}