import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Search, Filter, Building, Phone, Mail, Shield, AlertTriangle,
  Calendar, Users, Edit, Download, ChevronDown, CheckCircle, Clock,
  Sparkles, X
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

export default function PartiesContacts() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const isRTL = language === 'ar';

  // Fetch parties from the new API endpoint
  const { data: partiesData, isLoading } = useQuery({
    queryKey: ['/api/parties', selectedFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedFilter !== 'all') params.append('type', selectedFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/parties?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch parties');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Remove highlight mutation
  const removeHighlight = useMutation({
    mutationFn: async (partyId: number) => {
      const response = await fetch(`/api/parties/${partyId}/remove-highlight`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to remove highlight');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/parties'] });
    }
  });

  const parties = partiesData?.parties || [];

  // Define party type
  interface TransformedParty {
    id: number;
    name: string;
    nameAr: string;
    type: string;
    country: string;
    registrationNumber?: string;
    registrationType?: string;
    status: string;
    riskScore: string;
    contracts: number;
    lastActivity: string;
    email?: string;
    phone?: string;
    address?: string;
    addressAr?: string;
    isHighlighted: boolean;
    sourceContractId?: number;
    extractedAt: string;
    contacts: Array<{
      name: string;
      role: string;
      email: string;
      phone: string;
      primary: boolean;
    }>;
    diversity?: string[];
    w9Status?: string;
    w8benStatus?: string;
    insurance?: {
      status: string;
      expiry?: string;
    };
  }

  // Transform parties data to match the UI structure
  const counterparties: TransformedParty[] = parties.map((party: any) => ({
    id: party.id,
    name: party.name,
    nameAr: party.nameAr || party.name,
    type: party.type,
    country: 'Saudi Arabia', // Default for now
    registrationNumber: party.registrationNumber,
    registrationType: party.registrationType,
    status: 'active',
    riskScore: 'low', // Default for now
    contracts: 1, // Default for now
    lastActivity: new Date(party.extractedAt).toISOString().split('T')[0],
    email: party.email,
    phone: party.phone,
    address: party.address,
    addressAr: party.addressAr,
    isHighlighted: party.isHighlighted,
    sourceContractId: party.sourceContractId,
    extractedAt: party.extractedAt,
    contacts: party.email || party.phone ? [
      { 
        name: `${party.name} Representative`, 
        role: 'Contact', 
        email: party.email || '', 
        phone: party.phone || '', 
        primary: true 
      }
    ] : []
  }));

  // Filter parties (server-side filtering is already applied)
  const filteredCounterparties = counterparties;

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
              {t('الأطراف وجهات الاتصال', 'Parties & Contacts')}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('إدارة الأطراف المقابلة وجهات الاتصال', 'Manage counterparties and contacts')}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={cn("absolute top-3 w-4 h-4 text-gray-400", 
                language === 'ar' ? "right-3" : "left-3")} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('البحث عن الأطراف...', 'Search counterparties...')}
                className={cn(
                  "w-full bg-white border border-gray-200 rounded-lg px-10 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B7DEE8] transition-colors shadow-sm",
                  language === 'ar' && "text-right"
                )}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm",
                language === 'ar' && "flex-row-reverse"
              )}
            >
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-gray-900">{t('تصفية', 'Filter')}</span>
              <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform", showFilters && "rotate-180")} />
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.15 }}
              className="flex gap-2 flex-wrap mb-4"
            >
              {['all', 'vendor', 'client', 'partner', 'contractor'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-colors",
                    selectedFilter === filter
                      ? "bg-[#0C2836] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                >
                  {filter === 'all' && t('الكل', 'All')}
                  {filter === 'vendor' && t('موردون', 'Vendors')}
                  {filter === 'client' && t('عملاء', 'Clients')}
                  {filter === 'partner' && t('شركاء', 'Partners')}
                  {filter === 'contractor' && t('مقاولون', 'Contractors')}
                </button>
              ))}
            </motion.div>
          )}

          {/* Counterparties Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('الطرف المقابل', 'Counterparty')}
                    </th>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('النوع', 'Type')}
                    </th>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('المخاطر', 'Risk')}
                    </th>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('العقود', 'Contracts')}
                    </th>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('الحالة', 'Status')}
                    </th>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('آخر نشاط', 'Last Activity')}
                    </th>
                    <th className={cn("px-6 py-3 text-gray-900 font-semibold", language === 'ar' ? "text-right" : "text-left")}>
                      {t('الإجراءات', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCounterparties.map((party: TransformedParty, index: number) => (
                    <motion.tr
                      key={party.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className={cn(language === 'ar' && "text-right")}>
                          <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                            <p className="text-gray-900 font-medium">
                              {language === 'ar' ? party.nameAr : party.name}
                            </p>
                            {party.isHighlighted && (
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-4 h-4 text-[#B7DEE8]" />
                                <button
                                  onClick={() => removeHighlight.mutate(party.id)}
                                  className="p-0.5 hover:bg-gray-100 rounded"
                                  title={t('إزالة التمييز', 'Remove highlight')}
                                >
                                  <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">
                            {party.registrationNumber ? 
                              `${party.registrationType?.toUpperCase() || 'ID'}: ${party.registrationNumber}` : 
                              'No registration number'
                            }
                          </p>
                          <div className={cn("flex items-center gap-2 mt-1", language === 'ar' && "flex-row-reverse")}>
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{party.country}</span>
                            {party.diversity && party.diversity.length > 0 && (
                              <div className="flex gap-1">
                                {party.diversity.map(cert => (
                                  <span key={cert} className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Contact Info */}
                          {(party.email || party.phone) && (
                            <div className="mt-2 space-y-1">
                              {party.email && (
                                <div className={cn("flex items-center gap-1 text-xs text-gray-500", language === 'ar' && "flex-row-reverse")}>
                                  <Mail className="w-3 h-3" />
                                  <span>{party.email}</span>
                                </div>
                              )}
                              {party.phone && (
                                <div className={cn("flex items-center gap-1 text-xs text-gray-500", language === 'ar' && "flex-row-reverse")}>
                                  <Phone className="w-3 h-3" />
                                  <span>{party.phone}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          party.type === 'vendor' && "bg-blue-100 text-blue-700",
                          party.type === 'client' && "bg-green-100 text-green-700",
                          party.type === 'partner' && "bg-purple-100 text-purple-700",
                          party.type === 'contractor' && "bg-orange-100 text-orange-700"
                        )}>
                          {party.type === 'vendor' && t('مورد', 'Vendor')}
                          {party.type === 'client' && t('عميل', 'Client')}
                          {party.type === 'partner' && t('شريك', 'Partner')}
                          {party.type === 'contractor' && t('مقاول', 'Contractor')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                          <Shield className={cn(
                            "w-4 h-4",
                            party.riskScore === 'low' && "text-green-600",
                            party.riskScore === 'medium' && "text-yellow-600",
                            party.riskScore === 'high' && "text-red-600"
                          )} />
                          <span className={cn(
                            "text-sm font-medium",
                            party.riskScore === 'low' && "text-green-700",
                            party.riskScore === 'medium' && "text-yellow-700",
                            party.riskScore === 'high' && "text-red-700"
                          )}>
                            {party.riskScore === 'low' && t('منخفض', 'Low')}
                            {party.riskScore === 'medium' && t('متوسط', 'Medium')}
                            {party.riskScore === 'high' && t('عالي', 'High')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium">{party.contracts}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {/* Main Status */}
                          <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                            {party.status === 'active' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={cn(
                              "text-sm",
                              party.status === 'active' ? "text-green-700" : "text-gray-600"
                            )}>
                              {party.status === 'active' ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                            </span>
                          </div>
                          
                          {/* Compliance Indicators */}
                          <div className="flex gap-2 flex-wrap">
                            {party.w9Status && (
                              <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded",
                                party.w9Status === 'verified' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              )}>
                                W-9: {party.w9Status}
                              </span>
                            )}
                            {party.w8benStatus && (
                              <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                W-8BEN: {party.w8benStatus}
                              </span>
                            )}
                            {party.insurance?.status === 'expiring' && (
                              <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                {t('تأمين ينتهي قريباً', 'Insurance expiring')}
                              </span>
                            )}
                            {party.insurance?.status === 'expired' && (
                              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                                {t('تأمين منتهي', 'Insurance expired')}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600 text-sm">{party.lastActivity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <Users className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.3 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div className={cn(language === 'ar' && "text-right")}>
                  <p className="text-2xl font-bold text-gray-900">{counterparties.length}</p>
                  <p className="text-sm text-gray-600">{t('إجمالي الأطراف', 'Total Parties')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.35 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className={cn(language === 'ar' && "text-right")}>
                  <p className="text-2xl font-bold text-gray-900">
                    {counterparties.filter(p => p.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">{t('أطراف نشطة', 'Active Parties')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.4 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className={cn(language === 'ar' && "text-right")}>
                  <p className="text-2xl font-bold text-gray-900">
                    {counterparties.filter(p => p.riskScore === 'high').length}
                  </p>
                  <p className="text-sm text-gray-600">{t('مخاطر عالية', 'High Risk')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.45 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div className={cn(language === 'ar' && "text-right")}>
                  <p className="text-2xl font-bold text-gray-900">
                    {counterparties.filter(p => p.insurance?.status === 'expiring').length}
                  </p>
                  <p className="text-sm text-gray-600">{t('تنتهي قريباً', 'Expiring Soon')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}