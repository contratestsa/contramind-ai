import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { type DashboardData } from '@/mocks/analyticsData';
import { FileText, ChevronDown, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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



export default function AnalyticsReports() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const { toast } = useToast();
  
  // State for column charts data
  const [columnChartsData, setColumnChartsData] = useState<{
    contractTypes: { type: string; count: number }[];
    riskRates: { risk: string; count: number }[];
    paymentLiabilities: { party: string; amount: number }[];
  }>({
    contractTypes: [],
    riskRates: [],
    paymentLiabilities: []
  });

  // Fetch analytics data from API with automatic refresh
  const { data: analyticsData, isLoading, dataUpdatedAt } = useQuery<DashboardData>({
    queryKey: ['/api/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchIntervalInBackground: true, // Continue refreshing even when tab is not active
    staleTime: 0 // Always fetch fresh data
  });
  
  // Fetch column charts data
  const { data: chartsData } = useQuery({
    queryKey: ['/api/contracts/analytics'],
    refetchInterval: 30000
  });
  
  // Update column charts data when fetched
  useEffect(() => {
    if (chartsData) {
      setColumnChartsData(chartsData);
    }
  }, [chartsData]);

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

    // Payment Terms Donut
    const paymentTermsTotal = Object.values(data.paymentTerms || {}).reduce((a, b) => a + b, 0);
    const paymentTermsData = paymentTermsTotal > 0 ? Object.entries(data.paymentTerms || {})
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / paymentTermsTotal) * 100)
      })) : [];

    // Breach Notice Donut
    const breachNoticeTotal = Object.values(data.breachNotice || {}).reduce((a, b) => a + b, 0);
    const breachNoticeData = breachNoticeTotal > 0 ? Object.entries(data.breachNotice || {})
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / breachNoticeTotal) * 100)
      })) : [];

    // Termination Notice Donut
    const terminationNoticeTotal = Object.values(data.terminationNotice || {}).reduce((a, b) => a + b, 0);
    const terminationNoticeData = terminationNoticeTotal > 0 ? Object.entries(data.terminationNotice || {})
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / terminationNoticeTotal) * 100)
      })) : [];

    return {
      contractTypeData,
      executedData,
      languageData,
      internalPartiesData,
      counterpartiesData,
      governingLawData,
      paymentTermsData,
      breachNoticeData,
      terminationNoticeData
    };
  };

  // Show loading state
  if (isLoading || !analyticsData) {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex items-center justify-center">
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
    governingLawData,
    paymentTermsData,
    breachNoticeData,
    terminationNoticeData
  } = processData(analyticsData);

  // Color palettes - using ContraMind brand colors
  const contractTypeColors = ['#B7DEE8', '#92CED9', '#6DBECA', '#48AEBB', '#239EAC', '#0C8E9D', '#0C7E8E', '#0C6E7F', '#0C5E70', '#0C4E61'];
  const executedColors = ['#B7DEE8', '#F87171'];
  const languageColors = ['#B7DEE8', '#0C8E9D', '#0C2836'];
  const internalPartiesColors = ['#B7DEE8', '#92CED9', '#6DBECA', '#48AEBB', '#239EAC', '#0C8E9D', '#0C7E8E', '#0C6E7F', '#0C5E70', '#0C4E61'];
  const counterpartiesColors = ['#B7DEE8', '#92CED9', '#6DBECA', '#48AEBB', '#239EAC', '#0C8E9D', '#0C7E8E', '#0C6E7F', '#0C5E70', '#0C4E61'];
  const governingLawColors = ['#B7DEE8', '#92CED9', '#6DBECA', '#48AEBB', '#239EAC', '#0C8E9D', '#0C7E8E', '#0C6E7F', '#0C5E70', '#0C4E61'];

  return (
    <div className="bg-white">
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
              {/* Re-process button always visible if there are contracts */}
              {analyticsData.uniqueDocs > 0 && (
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

          {/* Notice for missing extraction data */}
          {!analyticsData.hasExtractedData && analyticsData.uniqueDocs > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">
                  {t('بيانات التحليل غير مكتملة', 'Analytics Data Incomplete')}
                </h4>
                <p className="text-sm text-amber-800 mb-3">
                  {t(
                    'لم يتم استخراج البيانات التفصيلية من العقود المحملة بعد. انقر فوق الزر أدناه لمعالجة جميع العقود واستخراج المعلومات للحصول على تحليلات كاملة.',
                    'Detailed data has not been extracted from uploaded contracts yet. Click the button below to process all contracts and extract information for complete analytics.'
                  )}
                </p>
                <Button
                  onClick={() => processContractsMutation.mutate()}
                  disabled={processContractsMutation.isPending}
                  className="bg-[#B7DEE8] hover:bg-[#92CED9] text-[#0C2836]"
                >
                  {processContractsMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0C2836] mr-2"></div>
                      {t('جاري المعالجة...', 'Processing...')}
                    </>
                  ) : (
                    t('معالجة جميع العقود', 'Process All Contracts')
                  )}
                </Button>
              </div>
            </motion.div>
          )}

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
                centerText={`${executedData[0].pct}% Yes`}
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

            {/* Internal Parties Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.25 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('الأطراف الداخلية', 'Internal Parties')}
              </h3>
              <DonutChart 
                data={internalPartiesData} 
                colors={internalPartiesColors} 
                centerText={`${internalPartiesData.length} Depts`}
                showMore={true}
              />
            </motion.div>

            {/* Counterparties Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('الأطراف المقابلة', 'Counterparties')}
              </h3>
              <DonutChart 
                data={counterpartiesData} 
                colors={counterpartiesColors} 
                centerText={`${counterpartiesData.length} Parties`}
                showMore={true}
              />
            </motion.div>

            {/* Governing Law Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.35 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('القانون الحاكم', 'Governing Law')}
              </h3>
              <DonutChart 
                data={governingLawData} 
                colors={governingLawColors} 
                centerText={`${governingLawData.length} Laws`}
                showMore={true}
              />
            </motion.div>

            {/* Payment Terms Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.4 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('شروط الدفع', 'Payment Terms')}
              </h3>
              {paymentTermsData.length > 0 ? (
                <DonutChart 
                  data={paymentTermsData} 
                  colors={contractTypeColors} 
                  centerText={`${paymentTermsData.length} Terms`}
                  showMore={true}
                />
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <p className="text-center">{t('لا توجد بيانات متاحة', 'No data available')}</p>
                </div>
              )}
            </motion.div>

            {/* Breach Notice Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.45 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('إشعار الإخلال', 'Breach Notice')}
              </h3>
              {breachNoticeData.length > 0 ? (
                <DonutChart 
                  data={breachNoticeData} 
                  colors={languageColors} 
                  centerText={`${breachNoticeData.length} Types`}
                  showMore={true}
                />
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <p className="text-center">{t('لا توجد بيانات متاحة', 'No data available')}</p>
                </div>
              )}
            </motion.div>

            {/* Termination Notice Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: 0.5 }}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                {t('إشعار الإنهاء', 'Termination Notice')}
              </h3>
              {terminationNoticeData.length > 0 ? (
                <DonutChart 
                  data={terminationNoticeData} 
                  colors={executedColors} 
                  centerText={`${terminationNoticeData.length} Types`}
                  showMore={true}
                />
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <p className="text-center">{t('لا توجد بيانات متاحة', 'No data available')}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Column Charts Section */}
          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.6 }}
            >
              <h2 className={cn("text-xl font-semibold text-[#0C2836] mb-6", isRTL && "text-right")}>
                {t('تحليلات متقدمة', 'Advanced Analytics')}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contract Type Column Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: 0.65 }}
                  className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
                >
                  <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                    {t('أنواع العقود', 'Contract Types')}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={columnChartsData.contractTypes} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                      <XAxis 
                        dataKey="type" 
                        angle={-45} 
                        textAnchor="end" 
                        tick={{ fill: '#0C2836', fontSize: 12 }}
                        height={80}
                      />
                      <YAxis tick={{ fill: '#0C2836', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#B7DEE8" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Risk Rate Column Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: 0.7 }}
                  className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
                >
                  <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                    {t('معدل المخاطر', 'Risk Rate')}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={columnChartsData.riskRates} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                      <XAxis 
                        dataKey="risk" 
                        tick={{ fill: '#0C2836', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#0C2836', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#FFB800" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Payment Liability Column Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: 0.75 }}
                  className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4"
                >
                  <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", isRTL && "text-right")}>
                    {t('التزامات الدفع', 'Payment Liability')}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={columnChartsData.paymentLiabilities} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                      <XAxis 
                        dataKey="party" 
                        angle={-45} 
                        textAnchor="end" 
                        tick={{ fill: '#0C2836', fontSize: 11 }}
                        height={100}
                      />
                      <YAxis tick={{ fill: '#0C2836', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}