import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { type DashboardData } from "@/mocks/analyticsData";
import { FileText, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function AnalyticsReports() {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";
  const { toast } = useToast();

  // Fetch analytics data from API with automatic refresh
  const {
    data: analyticsData,
    isLoading,
    dataUpdatedAt,
  } = useQuery<DashboardData>({
    queryKey: ["/api/analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchIntervalInBackground: true, // Continue refreshing even when tab is not active
    staleTime: 0, // Always fetch fresh data
  });

  // Process contracts mutation
  const processContractsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/contracts/process-all");
      return response.json() as Promise<{
        message: string;
        total: number;
        processed: number;
        failed: number;
      }>;
    },
    onSuccess: (data) => {
      toast({
        title: t("نجحت معالجة العقود", "Contracts processed successfully"),
        description: t(
          `تمت معالجة ${data.processed} من ${data.total} عقد`,
          `Processed ${data.processed} out of ${data.total} contracts`,
        ),
      });
      // Refresh analytics data
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
    },
    onError: (error) => {
      toast({
        title: t("فشلت معالجة العقود", "Failed to process contracts"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Show loading state
  if (isLoading || !analyticsData) {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B7DEE8] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {t("جاري تحميل التحليلات...", "Loading analytics...")}
          </p>
        </div>
      </div>
    );
  }

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
                  {t("التحليلات والتقارير", "Analytics & Reports")}
                </h1>
                <p className="text-gray-600">
                  {t(
                    "رؤى عالية المستوى لعقودك",
                    "High-level insights into your contracts",
                  )}
                </p>
                {dataUpdatedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t("آخر تحديث: ", "Last updated: ")}
                    {new Date(dataUpdatedAt).toLocaleTimeString(
                      language === "ar" ? "ar-SA" : "en-US",
                    )}
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
                      {t("جاري المعالجة...", "Processing...")}
                    </>
                  ) : (
                    t("إعادة معالجة العقود", "Re-process Contracts")
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
              {t("مستندات فريدة", "Unique Documents")}
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
                  {t("بيانات التحليل غير مكتملة", "Analytics Data Incomplete")}
                </h4>
                <p className="text-sm text-amber-800 mb-3">
                  {t(
                    "لم يتم استخراج البيانات التفصيلية من العقود المحملة بعد. انقر فوق الزر أدناه لمعالجة جميع العقود واستخراج المعلومات للحصول على تحليلات كاملة.",
                    "Detailed data has not been extracted from uploaded contracts yet. Click the button below to process all contracts and extract information for complete analytics.",
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
                      {t("جاري المعالجة...", "Processing...")}
                    </>
                  ) : (
                    t("معالجة جميع العقود", "Process All Contracts")
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
