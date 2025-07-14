import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Menu, Settings, HelpCircle, LogOut, Search, Filter,
  Building, Phone, Mail, Globe, Linkedin, Shield, AlertTriangle,
  Calendar, FileText, BarChart2, Activity, Send, Users, Edit,
  Download, ChevronDown, CheckCircle, Clock, Trash2
} from 'lucide-react';
import logoImage from "@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png";

export default function PartiesContacts() {
  const [, setLocation] = useLocation();
  const { user, isLoading, logout } = useAuth();
  const { language, t } = useLanguage();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#343541]">
        <div className="text-white">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  // Mock data for counterparties
  const counterparties = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      nameAr: 'شركة الحلول التقنية',
      type: 'vendor',
      country: 'USA',
      fein: '12-3456789',
      status: 'active',
      riskScore: 'low',
      contracts: 12,
      lastActivity: '2024-01-15',
      w9Status: 'verified',
      diversity: ['MBE', 'SBE'],
      sanctions: { checked: true, date: '2024-01-01', result: 'clear' },
      insurance: { expiry: '2024-12-31', status: 'valid' },
      masterAgreement: 'MSA-2023-001',
      contacts: [
        { name: 'John Smith', role: 'Contract Manager', email: 'john@techsolutions.com', phone: '+1-555-0123', primary: true },
        { name: 'Sarah Davis', role: 'Legal Counsel', email: 'sarah@techsolutions.com', phone: '+1-555-0124', primary: false }
      ]
    },
    {
      id: 2,
      name: 'Global Services LLC',
      nameAr: 'الخدمات العالمية ذ.م.م',
      type: 'customer',
      country: 'UAE',
      fein: '98-7654321',
      status: 'active',
      riskScore: 'medium',
      contracts: 8,
      lastActivity: '2024-01-20',
      w8benStatus: 'pending',
      diversity: [],
      sanctions: { checked: true, date: '2024-01-10', result: 'clear' },
      insurance: { expiry: '2024-06-30', status: 'expiring' },
      masterAgreement: 'MSA-2023-002',
      contacts: [
        { name: 'Ahmed Al-Rashid', role: 'Procurement Director', email: 'ahmed@globalservices.ae', phone: '+971-4-555-0001', primary: true }
      ]
    },
    {
      id: 3,
      name: 'Innovation Partners',
      nameAr: 'شركاء الابتكار',
      type: 'partner',
      country: 'UK',
      fein: '45-1234567',
      status: 'inactive',
      riskScore: 'high',
      contracts: 3,
      lastActivity: '2023-12-01',
      w9Status: 'expired',
      diversity: ['WBE'],
      sanctions: { checked: false, date: null, result: null },
      insurance: { expiry: '2023-12-31', status: 'expired' },
      masterAgreement: null,
      contacts: [
        { name: 'Emily Brown', role: 'CEO', email: 'emily@innovationpartners.uk', phone: '+44-20-555-0001', primary: true },
        { name: 'Michael Jones', role: 'CFO', email: 'michael@innovationpartners.uk', phone: '+44-20-555-0002', primary: false }
      ]
    }
  ];

  const filteredCounterparties = counterparties.filter(party => {
    const matchesSearch = searchQuery === '' || 
      party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.nameAr.includes(searchQuery) ||
      party.fein.includes(searchQuery);
    
    const matchesFilter = selectedFilter === 'all' || party.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0C2836] flex">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-[260px] h-screen bg-[#0C2836] flex flex-col fixed z-50 transition-transform duration-300",
        language === 'ar' ? "right-0" : "left-0",
        showMobileSidebar ? "translate-x-0" : language === 'ar' ? "translate-x-full" : "-translate-x-full",
        !showMobileSidebar && "lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-[rgba(183,222,232,0.1)]">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="w-full h-12 object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setLocation('/dashboard')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white", 
              language === 'ar' && "flex-row-reverse")}
          >
            <ArrowLeft className={cn("w-4 h-4 text-[#B7DEE8]", language === 'ar' && "rotate-180")} />
            <span className="text-sm">{t('العودة للوحة التحكم', 'Back to Dashboard')}</span>
          </button>
          
          <button
            onClick={() => setLocation('/analytics')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <BarChart2 className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>
          </button>

          <button
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg bg-[rgba(183,222,232,0.1)] text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <FileText className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>
          </button>

          <button
            onClick={() => setLocation('/notifications')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <AlertTriangle className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الإشعارات', 'Notifications')}</span>
          </button>

          <button
            onClick={() => setLocation('/tags')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <Activity className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('العلامات والفئات', 'Tags & Categories')}</span>
          </button>
        </nav>

        {/* Bottom Items */}
        <div className="p-4 border-t border-[rgba(183,222,232,0.1)] space-y-2">
          <button
            onClick={() => setLocation('/settings/personal')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <Settings className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('الإعدادات', 'Settings')}</span>
          </button>
          <button
            onClick={() => setLocation('/help')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <HelpCircle className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('المساعدة', 'Help')}</span>
          </button>
          <button
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
              language === 'ar' && "flex-row-reverse")}
          >
            <LogOut className="w-4 h-4 text-[#B7DEE8]" />
            <span className="text-sm">{t('تسجيل الخروج', 'Logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1", language === 'ar' ? "lg:mr-[260px]" : "lg:ml-[260px]")}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#40414F] border-b border-[#565869]">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 hover:bg-[#565869] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-medium">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>
          <div className="w-9" />
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className={cn("mb-8", language === 'ar' && "text-right")}>
              <h1 className="text-2xl font-semibold text-white mb-2">
                {t('الأطراف وجهات الاتصال', 'Parties & Contacts')}
              </h1>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">
                {t('إدارة الأطراف المقابلة وجهات الاتصال', 'Manage counterparties and contacts')}
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4 border border-[rgba(183,222,232,0.1)] mb-6">
              <div className={cn("flex flex-col lg:flex-row gap-4", language === 'ar' && "lg:flex-row-reverse")}>
                <div className="flex-1 relative">
                  <Search className={cn("absolute top-3 w-4 h-4 text-[rgba(255,255,255,0.5)]", 
                    language === 'ar' ? "right-3" : "left-3")} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('البحث بالاسم أو الرقم الضريبي أو البلد...', 'Search by name, FEIN/DUNS, country...')}
                    className={cn(
                      "w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(183,222,232,0.2)] rounded-lg px-10 py-2.5 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#B7DEE8] transition-colors",
                      language === 'ar' && "text-right"
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 bg-[rgba(183,222,232,0.1)] rounded-lg text-[#B7DEE8] hover:bg-[rgba(183,222,232,0.2)] transition-colors",
                      language === 'ar' && "flex-row-reverse"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">{t('تصفية', 'Filter')}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
                  </button>
                  <button className="px-4 py-2.5 bg-[rgba(183,222,232,0.1)] rounded-lg text-[#B7DEE8] hover:bg-[rgba(183,222,232,0.2)] transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.15 }}
                  className={cn("mt-4 flex flex-wrap gap-2", language === 'ar' && "flex-row-reverse")}
                >
                  {['all', 'vendor', 'customer', 'partner'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-colors",
                        selectedFilter === filter
                          ? "bg-[#B7DEE8] text-[#0C2836]"
                          : "bg-[rgba(183,222,232,0.1)] text-[#B7DEE8] hover:bg-[rgba(183,222,232,0.2)]"
                      )}
                    >
                      {filter === 'all' ? t('الكل', 'All') :
                       filter === 'vendor' ? t('مورد', 'Vendor') :
                       filter === 'customer' ? t('عميل', 'Customer') :
                       t('شريك', 'Partner')}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Counterparties List */}
            <div className="space-y-4">
              {filteredCounterparties.map((party, index) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.05 }}
                  className="bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(183,222,232,0.1)] overflow-hidden"
                >
                  {/* Party Header */}
                  <div className="p-6">
                    <div className={cn("flex items-start justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                      <div className={cn("flex items-start gap-4", language === 'ar' && "flex-row-reverse")}>
                        <div className="w-12 h-12 bg-[rgba(183,222,232,0.1)] rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-[#B7DEE8]" />
                        </div>
                        <div className={cn(language === 'ar' && "text-right")}>
                          <h3 className="text-white font-medium text-lg">
                            {language === 'ar' ? party.nameAr : party.name}
                          </h3>
                          <p className="text-[rgba(255,255,255,0.5)] text-sm">
                            {party.type === 'vendor' ? t('مورد', 'Vendor') :
                             party.type === 'customer' ? t('عميل', 'Customer') :
                             t('شريك', 'Partner')} • {party.country} • FEIN: {party.fein}
                          </p>
                        </div>
                      </div>
                      <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs",
                          party.status === 'active' 
                            ? "bg-green-900/20 text-green-400 border border-green-500/30"
                            : "bg-gray-900/20 text-gray-400 border border-gray-500/30"
                        )}>
                          {party.status === 'active' ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                        </span>
                        <button className="p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-[#B7DEE8]" />
                        </button>
                        <button className="p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-lg transition-colors">
                          <Send className="w-4 h-4 text-[#B7DEE8]" />
                        </button>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className={cn("bg-[rgba(255,255,255,0.03)] rounded-lg p-3", language === 'ar' && "text-right")}>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs mb-1">{t('العقود', 'Contracts')}</p>
                        <p className="text-white font-medium">{party.contracts}</p>
                      </div>
                      <div className={cn("bg-[rgba(255,255,255,0.03)] rounded-lg p-3", language === 'ar' && "text-right")}>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs mb-1">{t('مستوى المخاطر', 'Risk Level')}</p>
                        <p className={cn(
                          "font-medium",
                          party.riskScore === 'low' ? "text-green-400" :
                          party.riskScore === 'medium' ? "text-yellow-400" :
                          "text-red-400"
                        )}>
                          {party.riskScore === 'low' ? t('منخفض', 'Low') :
                           party.riskScore === 'medium' ? t('متوسط', 'Medium') :
                           t('مرتفع', 'High')}
                        </p>
                      </div>
                      <div className={cn("bg-[rgba(255,255,255,0.03)] rounded-lg p-3", language === 'ar' && "text-right")}>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs mb-1">{t('آخر نشاط', 'Last Activity')}</p>
                        <p className="text-white font-medium">{party.lastActivity}</p>
                      </div>
                      <div className={cn("bg-[rgba(255,255,255,0.03)] rounded-lg p-3", language === 'ar' && "text-right")}>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs mb-1">{t('الاتفاقية الرئيسية', 'Master Agreement')}</p>
                        <p className="text-white font-medium">{party.masterAgreement || t('لا يوجد', 'None')}</p>
                      </div>
                    </div>

                    {/* Compliance Status */}
                    <div className={cn("flex flex-wrap gap-3 mb-4", language === 'ar' && "flex-row-reverse")}>
                      {/* W-9/W-8BEN Status */}
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
                        party.w9Status === 'verified' || party.w8benStatus === 'verified'
                          ? "bg-green-900/20 text-green-400"
                          : party.w9Status === 'pending' || party.w8benStatus === 'pending'
                          ? "bg-yellow-900/20 text-yellow-400"
                          : "bg-red-900/20 text-red-400",
                        language === 'ar' && "flex-row-reverse"
                      )}>
                        <FileText className="w-3 h-3" />
                        <span>{party.w9Status ? 'W-9' : 'W-8BEN'}: {
                          party.w9Status === 'verified' || party.w8benStatus === 'verified' ? t('تم التحقق', 'Verified') :
                          party.w9Status === 'pending' || party.w8benStatus === 'pending' ? t('قيد الانتظار', 'Pending') :
                          t('منتهي الصلاحية', 'Expired')
                        }</span>
                      </div>

                      {/* Sanctions Check */}
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
                        party.sanctions.checked && party.sanctions.result === 'clear'
                          ? "bg-green-900/20 text-green-400"
                          : "bg-red-900/20 text-red-400",
                        language === 'ar' && "flex-row-reverse"
                      )}>
                        <Shield className="w-3 h-3" />
                        <span>{t('فحص العقوبات', 'Sanctions')}: {
                          party.sanctions.checked ? t('نظيف', 'Clear') : t('مطلوب', 'Required')
                        }</span>
                      </div>

                      {/* Insurance */}
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
                        party.insurance.status === 'valid'
                          ? "bg-green-900/20 text-green-400"
                          : party.insurance.status === 'expiring'
                          ? "bg-yellow-900/20 text-yellow-400"
                          : "bg-red-900/20 text-red-400",
                        language === 'ar' && "flex-row-reverse"
                      )}>
                        <Shield className="w-3 h-3" />
                        <span>{t('التأمين', 'Insurance')}: {party.insurance.expiry}</span>
                      </div>

                      {/* Diversity Flags */}
                      {party.diversity.map((flag) => (
                        <div key={flag} className="px-3 py-1.5 bg-purple-900/20 text-purple-400 rounded-lg text-xs">
                          {flag}
                        </div>
                      ))}
                    </div>

                    {/* Contacts */}
                    <div className="border-t border-[rgba(183,222,232,0.1)] pt-4">
                      <h4 className={cn("text-white font-medium mb-3", language === 'ar' && "text-right")}>
                        {t('جهات الاتصال', 'Contacts')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {party.contacts.map((contact, idx) => (
                          <div key={idx} className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3">
                            <div className={cn("flex items-start justify-between mb-2", language === 'ar' && "flex-row-reverse")}>
                              <div className={cn(language === 'ar' && "text-right")}>
                                <p className="text-white font-medium">{contact.name}</p>
                                <p className="text-[rgba(255,255,255,0.5)] text-xs">{contact.role}</p>
                              </div>
                              {contact.primary && (
                                <span className="px-2 py-0.5 bg-[rgba(183,222,232,0.2)] text-[#B7DEE8] rounded text-xs">
                                  {t('رئيسي', 'Primary')}
                                </span>
                              )}
                            </div>
                            <div className={cn("space-y-1", language === 'ar' && "text-right")}>
                              <div className={cn("flex items-center gap-2 text-[rgba(255,255,255,0.7)] text-xs", 
                                language === 'ar' && "flex-row-reverse justify-end")}>
                                <Mail className="w-3 h-3" />
                                <span>{contact.email}</span>
                              </div>
                              <div className={cn("flex items-center gap-2 text-[rgba(255,255,255,0.7)] text-xs",
                                language === 'ar' && "flex-row-reverse justify-end")}>
                                <Phone className="w-3 h-3" />
                                <span>{contact.phone}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAB */}
        <button className={cn(
          "fixed bottom-8 w-14 h-14 bg-[#B7DEE8] rounded-full shadow-lg flex items-center justify-center hover:bg-[rgba(183,222,232,0.9)] transition-colors",
          language === 'ar' ? "left-8" : "right-8"
        )}>
          <span className="text-[#0C2836] text-2xl">+</span>
        </button>
      </div>
    </div>
  );
}