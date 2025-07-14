import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Menu, Settings, HelpCircle, LogOut, Tag, Plus,
  ChevronRight, ChevronDown, Edit2, Trash2, Lock, Unlock,
  FileText, BarChart2, Activity, AlertTriangle, Zap, Hash,
  FolderOpen, X, Check, Search
} from 'lucide-react';
import logoImage from "@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png";

export default function TagsCategories() {
  const [, setLocation] = useLocation();
  const { user, isLoading, logout } = useAuth();
  const { language, t } = useLanguage();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['contract-type', 'risk']);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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

  if (!user) {
    setLocation('/');
    return null;
  }

  // Mock taxonomy data
  const taxonomy = [
    {
      id: 'contract-type',
      name: 'Contract Type',
      nameAr: 'نوع العقد',
      editable: 'admin',
      mandatory: true,
      children: [
        { id: 'nda', name: 'NDA', nameAr: 'اتفاقية عدم الإفصاح', count: 45, suggested: false },
        { id: 'msa', name: 'MSA', nameAr: 'اتفاقية الخدمات الرئيسية', count: 32, suggested: false },
        { id: 'sow', name: 'SOW', nameAr: 'بيان العمل', count: 28, suggested: false },
        { id: 'sla', name: 'SLA', nameAr: 'اتفاقية مستوى الخدمة', count: 15, suggested: true },
        { id: 'purchase', name: 'Purchase Order', nameAr: 'أمر الشراء', count: 67, suggested: false }
      ]
    },
    {
      id: 'risk',
      name: 'Risk Level',
      nameAr: 'مستوى المخاطر',
      editable: 'manager',
      mandatory: true,
      children: [
        { id: 'high', name: 'High Risk', nameAr: 'مخاطر عالية', count: 12, suggested: false },
        { id: 'medium', name: 'Medium Risk', nameAr: 'مخاطر متوسطة', count: 34, suggested: false },
        { id: 'low', name: 'Low Risk', nameAr: 'مخاطر منخفضة', count: 89, suggested: false }
      ]
    },
    {
      id: 'department',
      name: 'Department',
      nameAr: 'القسم',
      editable: 'all',
      mandatory: false,
      children: [
        { id: 'legal', name: 'Legal', nameAr: 'القانونية', count: 56, suggested: false },
        { id: 'finance', name: 'Finance', nameAr: 'المالية', count: 23, suggested: true },
        { id: 'hr', name: 'Human Resources', nameAr: 'الموارد البشرية', count: 18, suggested: false },
        { id: 'it', name: 'IT', nameAr: 'تقنية المعلومات', count: 41, suggested: false },
        { id: 'procurement', name: 'Procurement', nameAr: 'المشتريات', count: 37, suggested: true }
      ]
    },
    {
      id: 'region',
      name: 'Region',
      nameAr: 'المنطقة',
      editable: 'admin',
      mandatory: false,
      children: [
        { id: 'mena', name: 'MENA', nameAr: 'الشرق الأوسط وأفريقيا', count: 78, suggested: false },
        { id: 'americas', name: 'Americas', nameAr: 'الأمريكتين', count: 45, suggested: false },
        { id: 'europe', name: 'Europe', nameAr: 'أوروبا', count: 32, suggested: false },
        { id: 'apac', name: 'APAC', nameAr: 'آسيا والمحيط الهادئ', count: 29, suggested: true }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      nameAr: 'الامتثال',
      editable: 'manager',
      mandatory: false,
      children: [
        { id: 'gdpr', name: 'GDPR', nameAr: 'GDPR', count: 24, suggested: false },
        { id: 'hipaa', name: 'HIPAA', nameAr: 'HIPAA', count: 8, suggested: true },
        { id: 'sox', name: 'SOX', nameAr: 'SOX', count: 15, suggested: false },
        { id: 'pci', name: 'PCI-DSS', nameAr: 'PCI-DSS', count: 11, suggested: true }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getEditableIcon = (editable: string) => {
    switch (editable) {
      case 'admin':
        return <Lock className="w-3 h-3 text-red-600" />;
      case 'manager':
        return <Lock className="w-3 h-3 text-yellow-600" />;
      default:
        return <Unlock className="w-3 h-3 text-green-600" />;
    }
  };

  const filteredTaxonomy = taxonomy.map(category => ({
    ...category,
    children: category.children.filter(tag =>
      searchQuery === '' ||
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.nameAr.includes(searchQuery)
    )
  })).filter(category => category.children.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            onClick={() => setLocation('/parties')}
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[rgba(183,222,232,0.1)] transition-colors text-white",
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
            className={cn("w-full flex items-center gap-3 p-3 rounded-lg bg-[rgba(183,222,232,0.1)] text-white",
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
          <span className="text-white font-medium">{t('العلامات والفئات', 'Tags & Categories')}</span>
          <div className="w-9" />
        </div>

        {/* Main Content - Scrollable Column Shell */}
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
                {t('العلامات والفئات', 'Tags & Categories')}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('إدارة التصنيف الهرمي للعقود', 'Manage hierarchical contract taxonomy')}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className={cn("absolute top-3 w-4 h-4 text-gray-400", 
                language === 'ar' ? "right-3" : "left-3")} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('البحث عن العلامات...', 'Search tags...')}
                className={cn(
                  "w-full bg-white border border-gray-200 rounded-lg px-10 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B7DEE8] transition-colors shadow-sm",
                  language === 'ar' && "text-right"
                )}
              />
            </div>

            {/* Taxonomy Tree */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredTaxonomy.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        "w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150",
                        language === 'ar' && "flex-row-reverse"
                      )}
                    >
                      <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                        <FolderOpen className="w-5 h-5 text-[#0C2836]" />
                        <span className="text-gray-900 font-medium">
                          {language === 'ar' ? category.nameAr : category.name}
                        </span>
                        {category.mandatory && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded font-medium">
                            {t('إلزامي', 'Mandatory')}
                          </span>
                        )}
                        {getEditableIcon(category.editable)}
                      </div>
                      <ChevronDown className={cn(
                        "w-5 h-5 text-gray-500 transition-transform",
                        expandedCategories.includes(category.id) && "rotate-180"
                      )} />
                    </button>

                    {/* Tags List */}
                    {expandedCategories.includes(category.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.15 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-4 space-y-2 bg-gray-50">
                          {category.children.map((tag) => (
                            <div
                              key={tag.id}
                              onClick={() => setSelectedTag({ ...tag, categoryId: category.id, categoryName: category.name, categoryNameAr: category.nameAr })}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150",
                                selectedTag?.id === tag.id 
                                  ? "bg-[#f0f9ff] border border-[#B7DEE8]"
                                  : "hover:bg-white",
                                language === 'ar' && "flex-row-reverse"
                              )}
                            >
                              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">
                                  {language === 'ar' ? tag.nameAr : tag.name}
                                </span>
                                {tag.suggested && (
                                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0f9ff] rounded">
                                    <Zap className="w-3 h-3 text-[#0C2836]" />
                                    <span className="text-[#0C2836] text-xs font-medium">AI</span>
                                  </div>
                                )}
                              </div>
                              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                                <span className="text-gray-500 text-sm">
                                  {t('مستخدم', 'used')} {tag.count} {t('مرة', 'times')}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle edit
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                                >
                                  <Edit2 className="w-3 h-3 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Tag Details Panel */}
              <div className="lg:col-span-1">
                {selectedTag ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white rounded-lg p-6 shadow-sm sticky top-6"
                  >
                    <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                      {t('تفاصيل العلامة', 'Tag Details')}
                    </h3>

                    <div className="space-y-4">
                      <div className={cn(language === 'ar' && "text-right")}>
                        <p className="text-gray-500 text-xs mb-1">{t('الاسم', 'Name')}</p>
                        <p className="text-gray-900 font-medium">{language === 'ar' ? selectedTag.nameAr : selectedTag.name}</p>
                      </div>

                      <div className={cn(language === 'ar' && "text-right")}>
                        <p className="text-gray-500 text-xs mb-1">{t('الفئة', 'Category')}</p>
                        <p className="text-gray-900">{language === 'ar' ? selectedTag.categoryNameAr : selectedTag.categoryName}</p>
                      </div>

                      <div className={cn(language === 'ar' && "text-right")}>
                        <p className="text-gray-500 text-xs mb-1">{t('عدد الاستخدامات', 'Usage Count')}</p>
                        <p className="text-gray-900">{selectedTag.count}</p>
                      </div>

                      {selectedTag.suggested && (
                        <div className="p-3 bg-[#f0f9ff] rounded-lg border border-[#B7DEE8]">
                          <div className={cn("flex items-center gap-2 mb-2", language === 'ar' && "flex-row-reverse")}>
                            <Zap className="w-4 h-4 text-[#0C2836]" />
                            <span className="text-[#0C2836] text-sm font-medium">
                              {t('اقتراح الذكاء الاصطناعي', 'AI Suggested')}
                            </span>
                          </div>
                          <p className={cn("text-gray-600 text-xs", language === 'ar' && "text-right")}>
                            {t('تم اقتراح هذه العلامة بواسطة نظام استخراج البنود', 'This tag was suggested by the clause extraction system')}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <button className={cn(
                          "w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0C2836] rounded-lg text-white hover:bg-[#1a4158] transition-colors duration-150",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm">{t('تعديل', 'Edit')}</span>
                        </button>
                        <button className={cn(
                          "w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-150",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">{t('حذف', 'Delete')}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <p className={cn("text-gray-500 text-center", language === 'ar' && "text-right")}>
                      {t('اختر علامة لعرض التفاصيل', 'Select a tag to view details')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Governance Rules */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm mt-6"
            >
              <h3 className={cn("text-lg font-semibold text-[#0C2836] mb-4", language === 'ar' && "text-right")}>
                {t('قواعد الحوكمة', 'Governance Rules')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className={cn("flex items-center gap-2 mb-2", language === 'ar' && "flex-row-reverse")}>
                    <Lock className="w-4 h-4 text-red-600" />
                    <span className="text-gray-900 text-sm font-medium">{t('المسؤول فقط', 'Admin Only')}</span>
                  </div>
                  <p className={cn("text-gray-600 text-xs", language === 'ar' && "text-right")}>
                    {t('يمكن للمسؤولين فقط تعديل علامات نوع العقد والمنطقة', 'Only admins can edit Contract Type and Region tags')}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className={cn("flex items-center gap-2 mb-2", language === 'ar' && "flex-row-reverse")}>
                    <Lock className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-900 text-sm font-medium">{t('المدير وما فوق', 'Manager & Above')}</span>
                  </div>
                  <p className={cn("text-gray-600 text-xs", language === 'ar' && "text-right")}>
                    {t('يمكن للمديرين تعديل علامات المخاطر والامتثال', 'Managers can edit Risk Level and Compliance tags')}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className={cn("flex items-center gap-2 mb-2", language === 'ar' && "flex-row-reverse")}>
                    <Unlock className="w-4 h-4 text-green-600" />
                    <span className="text-gray-900 text-sm font-medium">{t('جميع المستخدمين', 'All Users')}</span>
                  </div>
                  <p className={cn("text-gray-600 text-xs", language === 'ar' && "text-right")}>
                    {t('يمكن لجميع المستخدمين تعديل علامات القسم', 'All users can edit Department tags')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAB */}
        <button 
          onClick={() => setShowAddModal(true)}
          className={cn(
            "fixed bottom-8 w-14 h-14 bg-[#0C2836] rounded-full shadow-lg flex items-center justify-center hover:bg-[#1a4158] transition-colors duration-150",
            language === 'ar' ? "left-8" : "right-8"
          )}
        >
          <span className="text-white text-2xl">+</span>
        </button>
      </div>
    </div>
  );
}