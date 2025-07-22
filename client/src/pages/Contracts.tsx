import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, CheckCircle, AlertCircle, Filter, Search, ChevronDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface Contract {
  id: number;
  title: string;
  partyName: string;
  uploadedAt: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  contractType: string;
  executionDate?: string;
  expiryDate?: string;
  value?: string;
}

export default function Contracts() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch contracts data
  const { data: contractsData, isLoading } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
    queryFn: async () => {
      const response = await fetch("/api/contracts");
      if (!response.ok) throw new Error("Failed to fetch contracts");
      const data = await response.json();
      return data.contracts || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Filter contracts based on search and filters
  const filteredContracts = contractsData?.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.partyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.contractType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired':
      case 'terminated':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'expired':
      case 'terminated':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B7DEE8]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('العقود', 'Contracts')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('إدارة ومراجعة جميع العقود', 'Manage and review all contracts')}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className={cn(
                "absolute top-3 w-4 h-4 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )} />
              <input
                type="text"
                placeholder={t('ابحث عن العقود...', 'Search contracts...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] focus:border-transparent",
                  isRTL && "pl-4 pr-10"
                )}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
                "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>{t('تصفية', 'Filter')}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('الحالة', 'Status')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B7DEE8]"
                  >
                    <option value="all">{t('الكل', 'All')}</option>
                    <option value="active">{t('نشط', 'Active')}</option>
                    <option value="draft">{t('مسودة', 'Draft')}</option>
                    <option value="expired">{t('منتهي', 'Expired')}</option>
                    <option value="terminated">{t('ملغى', 'Terminated')}</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('النوع', 'Type')}
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B7DEE8]"
                  >
                    <option value="all">{t('الكل', 'All')}</option>
                    <option value="service">{t('خدمات', 'Service')}</option>
                    <option value="sales">{t('مبيعات', 'Sales')}</option>
                    <option value="employment">{t('توظيف', 'Employment')}</option>
                    <option value="nda">{t('اتفاقية سرية', 'NDA')}</option>
                    <option value="other">{t('أخرى', 'Other')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contracts Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FileText className="w-5 h-5 text-[#B7DEE8]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {contract.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contract.partyName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contract.status)}
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      getStatusColor(contract.status)
                    )}>
                      {contract.status === 'active' && t('نشط', 'Active')}
                      {contract.status === 'draft' && t('مسودة', 'Draft')}
                      {contract.status === 'expired' && t('منتهي', 'Expired')}
                      {contract.status === 'terminated' && t('ملغى', 'Terminated')}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{t('النوع:', 'Type:')}</span> {contract.contractType}
                  </div>

                  {/* Dates */}
                  {contract.executionDate && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{t('تاريخ التنفيذ:', 'Execution Date:')}</span> {new Date(contract.executionDate).toLocaleDateString()}
                    </div>
                  )}
                  {contract.expiryDate && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{t('تاريخ الانتهاء:', 'Expiry Date:')}</span> {new Date(contract.expiryDate).toLocaleDateString()}
                    </div>
                  )}

                  {/* Value */}
                  {contract.value && (
                    <div className="text-sm font-medium text-[#B7DEE8] mt-3">
                      {contract.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t('لم يتم العثور على عقود', 'No contracts found')}
              </p>
            </div>
          )}
        </div>
      </div>
  );
}