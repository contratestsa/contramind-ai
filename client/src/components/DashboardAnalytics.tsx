import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { type DashboardData } from '@/mocks/analyticsData';
import { FileText, AlertTriangle, DollarSign, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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
  const { toast } = useToast();
  const [showSeeMore, setShowSeeMore] = useState<{[key: string]: boolean}>({});

  // Fetch analytics data from API
  const { data: analyticsData, isLoading, dataUpdatedAt } = useQuery<DashboardData>({
    queryKey: ['/api/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchIntervalInBackground: true,
    staleTime: 0 // Always fetch fresh data
  });

  // Process contracts mutation
  const processContractsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/contracts/process-all');
      return response.json() as Promise<{message: string, total: number, processed: number, failed: number}>;
    },
    onSuccess: (data) => {
      toast({
        title: t('نجحت معالجة العقود', 'Contracts processed successfully'),
        description: t(`تمت معالجة ${data.processed} من ${data.total} عقد`, `Processed ${data.processed} out of ${data.total} contracts`),
      });
      // Refresh analytics data
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
    },
    onError: (error) => {
      toast({
        title: t('فشلت معالجة العقود', 'Failed to process contracts'),
        description: error.message,
        variant: "destructive"
      });
    }
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
  // 2. Risk Rate - Real data from contracts
  const riskData = [];
  if (analyticsData?.riskLevel) {
    const total = analyticsData.riskLevel.low + analyticsData.riskLevel.medium + analyticsData.riskLevel.high;
    if (total > 0) {
      riskData.push({
        name: 'Low Risk',
        value: analyticsData.riskLevel.low,
        pct: Math.round((analyticsData.riskLevel.low / total) * 100)
      });
      riskData.push({
        name: 'Medium Risk',
        value: analyticsData.riskLevel.medium,
        pct: Math.round((analyticsData.riskLevel.medium / total) * 100)
      });
      riskData.push({
        name: 'High Risk',
        value: analyticsData.riskLevel.high,
        pct: Math.round((analyticsData.riskLevel.high / total) * 100)
      });
    }
  }

  // 3. Payment Liability - Use real payment terms data only
  const paymentData = [
    { name: 'Immediate', value: 0, pct: 0 },
    { name: '30 Days', value: 0, pct: 0 },
    { name: '60+ Days', value: 0, pct: 0 }
  ];

  // Only show data if we have real payment terms from contracts
  if (analyticsData?.paymentTerms && Object.keys(analyticsData.paymentTerms).length > 0) {
    const paymentTotal = Object.values(analyticsData.paymentTerms).reduce((a, b) => a + b, 0);
    Object.entries(analyticsData.paymentTerms).forEach(([term, count]) => {
      const lowerTerm = term.toLowerCase();
      if (lowerTerm.includes('immediate') || lowerTerm.includes('upon') || lowerTerm.includes('receipt')) {
        paymentData[0].value += count;
      } else if (lowerTerm.includes('30')) {
        paymentData[1].value += count;
      } else {
        paymentData[2].value += count;
      }
    });
    
    // Calculate percentages
    paymentData.forEach(item => {
      item.pct = paymentTotal > 0 ? Math.round((item.value / paymentTotal) * 100) : 0;
    });
  }

  // Color palettes
  const contractTypeColors = ['#B7DEE8', '#92CED9', '#6DBECA', '#48AEBB', '#239EAC'];
  const riskColors = ['#22C55E', '#F59E0B', '#EF4444']; // Green, Yellow, Red
  const paymentColors = ['#B7DEE8', '#6DBECA', '#239EAC'];

  // Process data for additional charts
  // Language chart
  const languageData = analyticsData?.language ? Object.entries(analyticsData.language)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / analyticsData.uniqueDocs) * 100)
    })) : [];

  // Executed status chart
  const executedData = analyticsData?.executed ? Object.entries(analyticsData.executed)
    .map(([name, value]) => ({
      name: name === 'yes' ? t('نعم', 'Yes') : t('لا', 'No'),
      value,
      pct: Math.round((value / analyticsData.uniqueDocs) * 100)
    })) : [];

  // Prepare data for bar charts (top 10)
  const internalPartiesData = analyticsData?.internalParties ? Object.entries(analyticsData.internalParties)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value })) : [];

  const counterPartiesData = analyticsData?.counterparties ? Object.entries(analyticsData.counterparties)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value })) : [];

  const governingLawData = analyticsData?.governingLaw ? Object.entries(analyticsData.governingLaw)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value })) : [];

  // Function to toggle see more
  const toggleSeeMore = (chartId: string) => {
    setShowSeeMore(prev => ({ ...prev, [chartId]: !prev[chartId] }));
  };

  return (
    <div className="bg-[var(--bg-main)]">
      <div className="p-6 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold font-space-grotesk text-[var(--text-primary)] mb-2">
                  {t('لوحة التحكم', 'Dashboard')}
                </h1>
                <p className="text-gray-600">{t('نظرة عامة على تحليلات العقود', 'Overview of contract analytics')}</p>
                {dataUpdatedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t('آخر تحديث: ', 'Last updated: ')} 
                    {new Date(dataUpdatedAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </p>
                )}
              </div>
              {/* Re-process button */}
              {analyticsData && analyticsData.uniqueDocs > 0 && (
                <Button
                  onClick={() => processContractsMutation.mutate()}
                  disabled={processContractsMutation.isPending}
                  className="bg-[#B7DEE8] hover:bg-[#92CED9] text-[#0C2836]"
                  size="sm"
                >
                  {processContractsMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0C2836] mr-2"></div>
                      {t('جاري المعالجة...', 'Processing...')}
                    </>
                  ) : (
                    t('إعادة معالجة العقود', 'Re-process Contracts')
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* KPI Header */}
          <div className="text-center py-8 bg-white rounded-2xl border border-[#E6E6E6] shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-[#B7DEE8]" />
              <h1 className="text-5xl font-bold text-[#0C2836]">
                {analyticsData?.uniqueDocs || 0}
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              {t('مستندات فريدة', 'Unique Documents')}
            </p>
          </div>

          {/* First Row - 3 Custom Charts */}
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


        </motion.div>
      </div>
    </div>
  );
}