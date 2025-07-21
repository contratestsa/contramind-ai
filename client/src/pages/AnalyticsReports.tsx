import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { type DashboardData } from '@/mocks/analyticsData';
import { FileText, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Custom tooltip for dark theme
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
const DonutChart = ({ data, colors, centerText, showMore = false }: { 
  data: any[], 
  colors: string[], 
  centerText: string,
  showMore?: boolean 
}) => {
  const [expanded, setExpanded] = useState(false);
  const displayData = expanded ? data : data.slice(0, 10);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-[#0C2836]">{centerText}</span>
      </div>
      
      {/* Legend */}
      <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
        {displayData.map((item, index) => (
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

      {/* See More button */}
      {showMore && data.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-[#B7DEE8] text-xs hover:text-[#0C2836] flex items-center gap-1"
        >
          See {expanded ? 'Less' : 'More'} 
          <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
};

// Horizontal bar chart component
const HorizontalBarChart = ({ data, color }: { data: any[], color: string }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        layout="horizontal"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
        <XAxis type="number" stroke="#0C2836" />
        <YAxis 
          dataKey="name" 
          type="category" 
          stroke="#0C2836"
          tick={{ fontSize: 12 }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function AnalyticsReports() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  // Fetch analytics data from API with automatic refresh
  const { data: analyticsData, isLoading, dataUpdatedAt } = useQuery<DashboardData>({
    queryKey: ['/api/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchIntervalInBackground: true, // Continue refreshing even when tab is not active
    staleTime: 0 // Always fetch fresh data
  });

  // Process data for charts
  const processData = (data: DashboardData) => {
    // Contract Type Donut
    const contractTypeTotal = Object.values(data.contractType).reduce((a, b) => a + b, 0);
    const contractTypeData = Object.entries(data.contractType)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / contractTypeTotal) * 100)
      }));

    // Executed Donut
    const executedTotal = data.executed.yes + data.executed.no;
    const executedData = [
      { name: 'Yes', value: data.executed.yes, pct: Math.round((data.executed.yes / executedTotal) * 100) },
      { name: 'No', value: data.executed.no, pct: Math.round((data.executed.no / executedTotal) * 100) }
    ];

    // Language Donut
    const languageTotal = Object.values(data.language).reduce((a, b) => a + b, 0);
    const languageData = Object.entries(data.language)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / languageTotal) * 100)
      }));

    // Internal Parties Bar (top 10)
    const internalPartiesData = Object.entries(data.internalParties)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }))
      .reverse(); // For horizontal bar, reverse to show highest at top

    // Counterparties Bar (top 10)
    const counterpartiesData = Object.entries(data.counterparties)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }))
      .reverse();

    // Governing Law Bar (top 10)
    const governingLawData = Object.entries(data.governingLaw)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }))
      .reverse();

    return {
      contractTypeData,
      executedData,
      languageData,
      internalPartiesData,
      counterpartiesData,
      governingLawData
    };
  };

  // Show loading state
  if (isLoading || !analyticsData) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#F6F6F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B7DEE8] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('جاري تحميل التحليلات...', 'Loading analytics...')}</p>
        </div>
      </div>
    );
  }

  const {
    contractTypeData,
    executedData,
    languageData,
    internalPartiesData,
    counterpartiesData,
    governingLawData
  } = processData(analyticsData);

  // Color palettes matching the screenshot
  const contractTypeColors = ['#B7DEE8', '#A5D6E4', '#93CED9', '#81C6CF', '#6FBEC5'];
  const executedColors = ['#B7DEE8', '#F08A8A']; // Light blue for Yes, Light red for No
  const languageColors = ['#B7DEE8', '#5BABB9', '#2B4F5E']; // Light blue, medium teal, dark teal

  return (
    <div className="bg-[#F6F6F6]">
      <div className="p-6 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold font-space-grotesk text-[#0C2836] mb-2">
              {t('التحليلات والتقارير', 'Analytics & Reports')}
            </h1>
            <p className="text-gray-600">{t('رؤى عالية المستوى لعقودك', 'High-level insights into your contracts')}</p>
            {dataUpdatedAt && (
              <p className="text-sm text-gray-500 mt-2">
                {t('آخر تحديث: ', 'Last updated: ')} 
                {new Date(dataUpdatedAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </p>
            )}
          </div>

          {/* KPI Header */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-[#B7DEE8]" />
              <h1 className="text-5xl font-bold text-[#0C2836]">
                {analyticsData.uniqueDocs}
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              {t('مستندات فريدة', 'Unique Documents')}
            </p>
          </div>

          {/* Grid 3x2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contract Type Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('نوع العقد', 'Contract Type')}
              </h3>
              <DonutChart 
                data={contractTypeData} 
                colors={contractTypeColors} 
                centerText={`${contractTypeData.length} Types`}
                showMore={true}
              />
            </motion.div>

            {/* Executed Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('منفذ', 'Executed')}
              </h3>
              <DonutChart 
                data={executedData} 
                colors={executedColors} 
                centerText={`${executedData.find(d => d.name === 'Yes')?.pct || 0}% Yes`}
              />
            </motion.div>

            {/* Language Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('اللغة', 'Language')}
              </h3>
              <DonutChart 
                data={languageData} 
                colors={languageColors} 
                centerText={`${languageData.length} Langs`}
              />
            </motion.div>

            {/* Internal Parties Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.25 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('الأطراف الداخلية', 'Internal Parties')}
              </h3>
              <HorizontalBarChart data={internalPartiesData} color="#B7DEE8" />
            </motion.div>

            {/* Counterparties Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('الأطراف المقابلة', 'Counterparties')}
              </h3>
              <HorizontalBarChart data={counterpartiesData} color="#B7DEE8" />
            </motion.div>

            {/* Governing Law Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.35 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('القانون الحاكم', 'Governing Law')}
              </h3>
              <HorizontalBarChart data={governingLawData} color="#B7DEE8" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}