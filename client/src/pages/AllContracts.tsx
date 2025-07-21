import { useState } from 'react';
import { useLanguage } from '@/components/SimpleLanguage';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronDown, FileText, Search } from 'lucide-react';
import { Link } from 'wouter';

interface Contract {
  id: number;
  title: string;
  partyName: string;
  type: string;
  status: string;
  date: string;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function AllContracts() {
  const { language, t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const isRTL = language === 'ar';

  // Fetch all contracts
  const { data: contractsData = { contracts: [] }, isLoading } = useQuery<{ contracts: Contract[] }>({
    queryKey: ['/api/contracts'],
    refetchInterval: 30000
  });

  // Filter contracts based on search and filters
  const filteredContracts = contractsData.contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.partyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const contractTypes = ['service', 'nda', 'employment', 'sales', 'other'];
  const contractStatuses = ['draft', 'active', 'completed', 'terminated'];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        showMobile={showMobile}
        setShowMobile={setShowMobile}
        activePage="repository"
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isRTL ? 
          (isCollapsed ? "lg:mr-[60px]" : "lg:mr-[260px]") : 
          (isCollapsed ? "lg:ml-[60px]" : "lg:ml-[260px]")
      )}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobile(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t('جميع العقود', 'All Contracts')}
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {t(`${filteredContracts.length} عقد`, `${filteredContracts.length} contracts`)}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('البحث في العقود...', 'Search contracts...')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] focus:border-transparent"
              >
                <option value="all">{t('جميع الأنواع', 'All Types')}</option>
                {contractTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] focus:border-transparent"
              >
                <option value="all">{t('جميع الحالات', 'All Status')}</option>
                {contractStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Contracts Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B7DEE8]"></div>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t('لا توجد عقود', 'No contracts found')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' 
                  ? t('حاول تغيير معايير البحث', 'Try changing your search criteria')
                  : t('ابدأ بتحليل عقد جديد', 'Start by analyzing a new contract')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContracts.map((contract) => (
                <Link
                  key={contract.id}
                  href={`/dashboard?contract=${contract.id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate flex-1">
                      {contract.title}
                    </h3>
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full ml-2",
                      getRiskBadgeColor(contract.riskLevel)
                    )}>
                      {contract.riskLevel}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t('الطرف:', 'Party:')}</span>
                      <span className="truncate">{contract.partyName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t('النوع:', 'Type:')}</span>
                      <span className="capitalize">{contract.type}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(contract.date)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      getStatusBadgeColor(contract.status)
                    )}>
                      {contract.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}