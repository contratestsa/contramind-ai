import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Search, Filter, Plus, Edit2, Trash2, Eye, Building2,
  User, Mail, Phone, Globe, MapPin, Calendar, Download
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function PartiesContacts() {
  const { language, t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'companies' | 'contacts'>('companies');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for companies
  const companies = [
    { id: 1, name: 'Tech Solutions Ltd.', type: 'Vendor', contracts: 12, risk: 'low', country: 'Saudi Arabia', city: 'Riyadh' },
    { id: 2, name: 'Innovation Partners', type: 'Client', contracts: 8, risk: 'medium', country: 'UAE', city: 'Dubai' },
    { id: 3, name: 'ContraMind HR', type: 'Internal', contracts: 24, risk: 'low', country: 'Saudi Arabia', city: 'Jeddah' },
    { id: 4, name: 'Global Corp', type: 'Vendor', contracts: 5, risk: 'high', country: 'Kuwait', city: 'Kuwait City' },
    { id: 5, name: 'Strategy Inc.', type: 'Partner', contracts: 15, risk: 'medium', country: 'Bahrain', city: 'Manama' }
  ];

  // Mock data for contacts
  const contacts = [
    { id: 1, name: 'Ahmed Hassan', company: 'Tech Solutions Ltd.', role: 'Legal Director', email: 'ahmed@techsolutions.com', phone: '+966 50 123 4567' },
    { id: 2, name: 'Sarah Al-Rashid', company: 'Innovation Partners', role: 'Contract Manager', email: 'sarah@innovation.ae', phone: '+971 50 987 6543' },
    { id: 3, name: 'Mohammed Ali', company: 'ContraMind HR', role: 'HR Manager', email: 'mohammed@contramind.com', phone: '+966 55 234 5678' },
    { id: 4, name: 'Fatima Khalil', company: 'Global Corp', role: 'Procurement Head', email: 'fatima@globalcorp.kw', phone: '+965 60 345 6789' },
    { id: 5, name: 'Omar Nasser', company: 'Strategy Inc.', role: 'CEO', email: 'omar@strategy.bh', phone: '+973 30 456 7890' }
  ];

  return (
    <DashboardLayout currentPage="parties">
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
              {t('إدارة الشركات وجهات الاتصال المرتبطة بالعقود', 'Manage companies and contacts associated with contracts')}
            </p>
          </div>

          {/* Action Bar */}
          <div className={cn("flex flex-col md:flex-row gap-4 mb-4", language === 'ar' && "md:flex-row-reverse")}>
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={cn("absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400", 
                language === 'ar' ? "right-3" : "left-3")} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('البحث عن شركة أو جهة اتصال...', 'Search for a company or contact...')}
                className={cn("w-full py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] transition-all duration-150",
                  language === 'ar' ? "pr-10 pl-3" : "pl-10 pr-3")}
              />
            </div>

            {/* Actions */}
            <div className={cn("flex gap-2", language === 'ar' && "flex-row-reverse")}>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#1a4158] transition-colors duration-150">
                <Plus className="w-4 h-4" />
                <span>{t('إضافة جديد', 'Add New')}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <Filter className="w-4 h-4" />
                <span>{t('تصفية', 'Filter')}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <Download className="w-4 h-4" />
                <span>{t('تصدير', 'Export')}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className={cn("flex border-b border-gray-200", language === 'ar' && "flex-row-reverse")}>
              <button
                onClick={() => setSelectedTab('companies')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all duration-150",
                  selectedTab === 'companies' 
                    ? "text-[#0C2836] border-b-2 border-[#B7DEE8]" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <div className={cn("flex items-center justify-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <Building2 className="w-4 h-4" />
                  {t('الشركات', 'Companies')} ({companies.length})
                </div>
              </button>
              <button
                onClick={() => setSelectedTab('contacts')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all duration-150",
                  selectedTab === 'contacts' 
                    ? "text-[#0C2836] border-b-2 border-[#B7DEE8]" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <div className={cn("flex items-center justify-center gap-2", language === 'ar' && "flex-row-reverse")}>
                  <User className="w-4 h-4" />
                  {t('جهات الاتصال', 'Contacts')} ({contacts.length})
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {selectedTab === 'companies' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Companies Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('اسم الشركة', 'Company Name')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('النوع', 'Type')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('العقود', 'Contracts')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('المخاطر', 'Risk')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('الموقع', 'Location')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('الإجراءات', 'Actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company) => (
                          <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className={cn("px-4 py-3 whitespace-nowrap", language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{company.name}</span>
                              </div>
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              {company.type}
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              {company.contracts}
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap", language === 'ar' ? "text-right" : "text-left")}>
                              <span className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                company.risk === 'low' && "bg-green-100 text-green-800",
                                company.risk === 'medium' && "bg-yellow-100 text-yellow-800",
                                company.risk === 'high' && "bg-red-100 text-red-800"
                              )}>
                                {company.risk === 'low' && t('منخفض', 'Low')}
                                {company.risk === 'medium' && t('متوسط', 'Medium')}
                                {company.risk === 'high' && t('مرتفع', 'High')}
                              </span>
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                                <MapPin className="w-3 h-3" />
                                {company.city}, {company.country}
                              </div>
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse justify-end")}>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                  <Edit2 className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                  <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Contacts Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('الاسم', 'Name')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('الشركة', 'Company')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('المنصب', 'Role')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('البريد الإلكتروني', 'Email')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('الهاتف', 'Phone')}
                          </th>
                          <th className={cn("px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", 
                            language === 'ar' ? "text-right" : "text-left")}>
                            {t('الإجراءات', 'Actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className={cn("px-4 py-3 whitespace-nowrap", language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                              </div>
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              {contact.company}
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              {contact.role}
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-500", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse")}>
                                <Phone className="w-3 h-3" />
                                <span dir="ltr">{contact.phone}</span>
                              </div>
                            </td>
                            <td className={cn("px-4 py-3 whitespace-nowrap text-sm", 
                              language === 'ar' ? "text-right" : "text-left")}>
                              <div className={cn("flex items-center gap-1", language === 'ar' && "flex-row-reverse justify-end")}>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                  <Edit2 className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                                  <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">{companies.length}</p>
                  <p className="text-sm text-gray-600">{t('إجمالي الشركات', 'Total Companies')}</p>
                </div>
                <Building2 className="w-8 h-8 text-[#B7DEE8]" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">{contacts.length}</p>
                  <p className="text-sm text-gray-600">{t('إجمالي جهات الاتصال', 'Total Contacts')}</p>
                </div>
                <User className="w-8 h-8 text-[#B7DEE8]" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">64</p>
                  <p className="text-sm text-gray-600">{t('العقود النشطة', 'Active Contracts')}</p>
                </div>
                <FileText className="w-8 h-8 text-[#B7DEE8]" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                <div>
                  <p className="text-2xl font-bold text-[#0C2836]">5</p>
                  <p className="text-sm text-gray-600">{t('البلدان', 'Countries')}</p>
                </div>
                <Globe className="w-8 h-8 text-[#B7DEE8]" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}