import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Tag, Plus, Search, ChevronRight, Shield, Users,
  FileText, DollarSign, Zap, Calendar, Settings, Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TagsCategories() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  // Mock category data
  const categories = [
    {
      id: 'legal',
      name: t('القانونية', 'Legal'),
      icon: Shield,
      color: 'bg-blue-100 text-blue-600',
      count: 24,
      tags: ['NDA', 'MSA', 'SLA', 'Terms & Conditions', 'Privacy Policy']
    },
    {
      id: 'hr',
      name: t('الموارد البشرية', 'Human Resources'),
      icon: Users,
      color: 'bg-green-100 text-green-600',
      count: 18,
      tags: ['Employment', 'Contractor', 'Benefits', 'Compensation', 'Termination']
    },
    {
      id: 'procurement',
      name: t('المشتريات', 'Procurement'),
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      count: 31,
      tags: ['Purchase Order', 'RFP', 'RFQ', 'Vendor Agreement', 'Supply Chain']
    },
    {
      id: 'finance',
      name: t('المالية', 'Finance'),
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
      count: 15,
      tags: ['Payment Terms', 'Invoice', 'Budget', 'Financial Audit', 'Tax']
    },
    {
      id: 'operations',
      name: t('العمليات', 'Operations'),
      icon: Zap,
      color: 'bg-red-100 text-red-600',
      count: 22,
      tags: ['SOP', 'Quality', 'Maintenance', 'Logistics', 'Performance']
    },
    {
      id: 'projects',
      name: t('المشاريع', 'Projects'),
      icon: Calendar,
      color: 'bg-indigo-100 text-indigo-600',
      count: 19,
      tags: ['Milestone', 'Deliverable', 'Timeline', 'Scope', 'Change Order']
    }
  ];

  // Mock tag details
  const tagDetails = {
    contracts: 156,
    activeContracts: 89,
    avgCycleTime: '14 days',
    riskLevel: 'medium',
    lastModified: '2 days ago',
    governanceRules: [
      { rule: 'Requires Legal Review', enabled: true },
      { rule: 'Auto-expire after 1 year', enabled: false },
      { rule: 'Notify 30 days before renewal', enabled: true },
      { rule: 'Restrict to verified vendors', enabled: true }
    ]
  };

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(c => c.id === selectedCategory);

  return (
    <DashboardLayout currentPage="tags">
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
              {t('تنظيم وتصنيف العقود للوصول السريع والإدارة', 'Organize and categorize contracts for quick access and management')}
            </p>
          </div>

          {/* Search and Actions */}
          <div className={cn("flex flex-col md:flex-row gap-4 mb-4", language === 'ar' && "md:flex-row-reverse")}>
            <div className="flex-1 relative">
              <Search className={cn("absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400", 
                language === 'ar' ? "right-3" : "left-3")} />
              <input
                type="text"
                placeholder={t('البحث عن علامة أو فئة...', 'Search for a tag or category...')}
                className={cn("w-full py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] transition-all duration-150",
                  language === 'ar' ? "pr-10 pl-3" : "pl-10 pr-3")}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0C2836] text-white rounded-lg hover:bg-[#1a4158] transition-colors duration-150">
              <Plus className="w-4 h-4" />
              <span>{t('إضافة فئة', 'Add Category')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Categories Grid */}
            <div className="lg:col-span-2 space-y-4">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-150"
                >
                  <div className={cn("flex items-start justify-between", language === 'ar' && "flex-row-reverse")}>
                    <div className={cn("flex items-start gap-3", language === 'ar' && "flex-row-reverse")}>
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.color)}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      <div className={cn(language === 'ar' && "text-right")}>
                        <h3 className="text-lg font-semibold text-[#0C2836]">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.count} {t('عقد', 'contracts')}</p>
                      </div>
                    </div>
                    <ChevronRight className={cn("w-5 h-5 text-gray-400", language === 'ar' && "rotate-180")} />
                  </div>
                  
                  {/* Tags */}
                  <div className={cn("mt-4 flex flex-wrap gap-2", language === 'ar' && "flex-row-reverse")}>
                    {category.tags.map((tag, tagIndex) => (
                      <button
                        key={tagIndex}
                        onClick={() => setSelectedTag(tagIndex)}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full transition-all duration-150",
                          selectedTag === tagIndex
                            ? "bg-[#B7DEE8] text-[#0C2836]"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className={cn("mt-4 flex items-center gap-4 text-xs text-gray-500", language === 'ar' && "flex-row-reverse")}>
                    <span>{t('نشط:', 'Active:')} {Math.floor(category.count * 0.7)}</span>
                    <span>{t('معلق:', 'Pending:')} {Math.floor(category.count * 0.2)}</span>
                    <span>{t('منتهي:', 'Expired:')} {Math.floor(category.count * 0.1)}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tag Details Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Tag Info */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                  <h3 className="text-lg font-semibold text-[#0C2836]">
                    {selectedTag !== null ? 'NDA' : t('تفاصيل العلامة', 'Tag Details')}
                  </h3>
                  <Tag className="w-5 h-5 text-gray-400" />
                </div>
                
                {selectedTag !== null ? (
                  <div className="space-y-3">
                    <div className={cn("flex justify-between", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-sm text-gray-600">{t('العقود', 'Contracts')}</span>
                      <span className="text-sm font-medium">{tagDetails.contracts}</span>
                    </div>
                    <div className={cn("flex justify-between", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-sm text-gray-600">{t('نشط', 'Active')}</span>
                      <span className="text-sm font-medium">{tagDetails.activeContracts}</span>
                    </div>
                    <div className={cn("flex justify-between", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-sm text-gray-600">{t('متوسط وقت الدورة', 'Avg Cycle Time')}</span>
                      <span className="text-sm font-medium">{tagDetails.avgCycleTime}</span>
                    </div>
                    <div className={cn("flex justify-between", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-sm text-gray-600">{t('مستوى المخاطر', 'Risk Level')}</span>
                      <span className="text-sm font-medium capitalize text-yellow-600">{tagDetails.riskLevel}</span>
                    </div>
                    <div className={cn("flex justify-between", language === 'ar' && "flex-row-reverse")}>
                      <span className="text-sm text-gray-600">{t('آخر تعديل', 'Last Modified')}</span>
                      <span className="text-sm font-medium">{tagDetails.lastModified}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    {t('اختر علامة لعرض التفاصيل', 'Select a tag to view details')}
                  </p>
                )}
              </div>

              {/* Governance Rules */}
              {selectedTag !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className={cn("flex items-center justify-between mb-4", language === 'ar' && "flex-row-reverse")}>
                    <h3 className="text-lg font-semibold text-[#0C2836]">
                      {t('قواعد الحوكمة', 'Governance Rules')}
                    </h3>
                    <Settings className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                    {tagDetails.governanceRules.map((rule, index) => (
                      <div key={index} className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                        <span className="text-sm text-gray-700">{rule.rule}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={rule.enabled} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B7DEE8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B7DEE8]"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className={cn("mt-4 flex gap-2", language === 'ar' && "flex-row-reverse")}>
                    <button className="flex-1 px-4 py-2 bg-[#B7DEE8] text-[#0C2836] rounded-lg hover:bg-[#a5d0db] transition-colors duration-150">
                      {t('حفظ القواعد', 'Save Rules')}
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Category Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.15 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#0C2836] mb-4">
                  {t('ملخص الفئات', 'Category Summary')}
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                      <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                        <div className={cn("w-2 h-2 rounded-full", cat.color.replace('text-', 'bg-').replace('-600', '-500'))} />
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium">{cat.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                    <span className="text-sm font-medium text-gray-700">{t('المجموع', 'Total')}</span>
                    <span className="text-sm font-bold text-[#0C2836]">
                      {categories.reduce((sum, cat) => sum + cat.count, 0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}