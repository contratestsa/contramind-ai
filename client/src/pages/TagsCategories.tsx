import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Lock, Unlock, Zap, Hash,
  FolderOpen, ChevronDown, Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TagsCategories() {
  const { language, t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['contract-type', 'risk']);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const isRTL = language === 'ar';

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
      id: 'status',
      name: 'Contract Status',
      nameAr: 'حالة العقد',
      editable: 'user',
      mandatory: false,
      children: [
        { id: 'draft', name: 'Draft', nameAr: 'مسودة', count: 23, suggested: false },
        { id: 'review', name: 'Under Review', nameAr: 'قيد المراجعة', count: 8, suggested: false },
        { id: 'approved', name: 'Approved', nameAr: 'معتمد', count: 45, suggested: false },
        { id: 'signed', name: 'Signed', nameAr: 'موقع', count: 67, suggested: false },
        { id: 'active', name: 'Active', nameAr: 'نشط', count: 112, suggested: false },
        { id: 'expired', name: 'Expired', nameAr: 'منتهي الصلاحية', count: 34, suggested: false }
      ]
    },
    {
      id: 'department',
      name: 'Department',
      nameAr: 'القسم',
      editable: 'admin',
      mandatory: false,
      children: [
        { id: 'legal', name: 'Legal', nameAr: 'القانونية', count: 156, suggested: false },
        { id: 'procurement', name: 'Procurement', nameAr: 'المشتريات', count: 89, suggested: false },
        { id: 'hr', name: 'Human Resources', nameAr: 'الموارد البشرية', count: 45, suggested: true },
        { id: 'it', name: 'IT', nameAr: 'تقنية المعلومات', count: 67, suggested: false },
        { id: 'finance', name: 'Finance', nameAr: 'المالية', count: 78, suggested: false }
      ]
    },
    {
      id: 'vendor-type',
      name: 'Vendor Type',
      nameAr: 'نوع المورد',
      editable: 'manager',
      mandatory: false,
      children: [
        { id: 'software', name: 'Software', nameAr: 'برمجيات', count: 45, suggested: false },
        { id: 'hardware', name: 'Hardware', nameAr: 'أجهزة', count: 23, suggested: false },
        { id: 'services', name: 'Services', nameAr: 'خدمات', count: 89, suggested: false },
        { id: 'consulting', name: 'Consulting', nameAr: 'استشارات', count: 34, suggested: true }
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

  const handleTagClick = (tag: any, category: any) => {
    setSelectedTag({ ...tag, category });
  };

  const handleAddTag = () => {
    toast({
      title: t('قريباً', 'Coming Soon'),
      description: t('هذه الميزة قيد التطوير', 'This feature is under development')
    });
  };

  const filteredTaxonomy = taxonomy.map(category => ({
    ...category,
    children: category.children.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.nameAr.includes(searchQuery)
    )
  })).filter(category => category.children.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full flex flex-col bg-gray-50"
    >
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-8 py-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4 max-w-7xl mx-auto"
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
                    <div
                      onClick={() => toggleCategory(category.id)}
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                        <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 text-gray-600 transition-transform",
                              expandedCategories.includes(category.id) && "rotate-180"
                            )}
                          />
                          <h3 className="font-semibold text-gray-900">
                            {language === 'ar' ? category.nameAr : category.name}
                          </h3>
                          {category.mandatory && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              {t('إلزامي', 'Required')}
                            </span>
                          )}
                        </div>
                        <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                          <span className="text-sm text-gray-500">
                            {category.children.length} {t('علامة', 'tags')}
                          </span>
                          {category.editable === 'admin' && (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags List */}
                    {expandedCategories.includes(category.id) && (
                      <div className="border-t border-gray-200">
                        <div className="p-4 space-y-2">
                          {category.children.map((tag) => (
                            <div
                              key={tag.id}
                              onClick={() => handleTagClick(tag, category)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors",
                                selectedTag?.id === tag.id && "bg-[#B7DEE8] bg-opacity-10 border border-[#B7DEE8]",
                                language === 'ar' && "flex-row-reverse"
                              )}
                            >
                              <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">
                                  {language === 'ar' ? tag.nameAr : tag.name}
                                </span>
                                {tag.suggested && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    <Zap className="w-3 h-3" />
                                    {t('مقترح بواسطة AI', 'AI Suggested')}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{tag.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Details Panel */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4"
                >
                  {selectedTag ? (
                    <div className="space-y-4">
                      <div className={cn("flex items-center justify-between", language === 'ar' && "flex-row-reverse")}>
                        <h3 className="font-semibold text-gray-900">
                          {t('تفاصيل العلامة', 'Tag Details')}
                        </h3>
                        <button
                          onClick={() => setSelectedTag(null)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600 rotate-45" />
                        </button>
                      </div>

                      <div className={cn("space-y-3", language === 'ar' && "text-right")}>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('الاسم', 'Name')}</p>
                          <p className="font-medium text-gray-900">
                            {language === 'ar' ? selectedTag.nameAr : selectedTag.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('الفئة', 'Category')}</p>
                          <p className="font-medium text-gray-900">
                            {language === 'ar' ? selectedTag.category.nameAr : selectedTag.category.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('عدد الاستخدامات', 'Usage Count')}</p>
                          <p className="font-medium text-gray-900">{selectedTag.count}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('صلاحيات التعديل', 'Edit Permissions')}</p>
                          <p className="font-medium text-gray-900">
                            {selectedTag.category.editable === 'admin' && t('المسؤولون فقط', 'Admins Only')}
                            {selectedTag.category.editable === 'manager' && t('المديرون والمسؤولون', 'Managers & Admins')}
                            {selectedTag.category.editable === 'user' && t('جميع المستخدمين', 'All Users')}
                          </p>
                        </div>

                        {selectedTag.suggested && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className={cn("flex items-center gap-2 text-yellow-700", language === 'ar' && "flex-row-reverse")}>
                              <Zap className="w-4 h-4" />
                              <p className="text-sm font-medium">{t('علامة مقترحة بواسطة AI', 'AI Suggested Tag')}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 space-y-2">
                        <button className={cn(
                          "w-full px-4 py-2 bg-[#B7DEE8] text-[#0C2836] rounded-lg hover:bg-[#a5d2de] transition-colors flex items-center justify-center gap-2",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          <Edit2 className="w-4 h-4" />
                          <span>{t('تعديل العلامة', 'Edit Tag')}</span>
                        </button>
                        
                        <button className={cn(
                          "w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          <Trash2 className="w-4 h-4" />
                          <span>{t('حذف العلامة', 'Delete Tag')}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={cn("text-center py-8", language === 'ar' && "text-right")}>
                      <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        {t('اختر علامة لعرض التفاصيل', 'Select a tag to view details')}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Add New Tag Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.2 }}
                  onClick={handleAddTag}
                  className={cn(
                    "mt-4 w-full px-4 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-[#1a3a4a] transition-colors flex items-center justify-center gap-2",
                    language === 'ar' && "flex-row-reverse"
                  )}
                >
                  <Plus className="w-5 h-5" />
                  <span>{t('إضافة علامة جديدة', 'Add New Tag')}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}