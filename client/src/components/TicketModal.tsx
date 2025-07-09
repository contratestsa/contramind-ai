import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TicketModalProps {
  onClose: () => void;
}

export default function TicketModal({ onClose }: TicketModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const isRTL = language === 'ar';

  const categories = [
    { value: 'technical', label: { ar: 'تقني', en: 'Technical' } },
    { value: 'billing', label: { ar: 'الفواتير', en: 'Billing' } },
    { value: 'feature', label: { ar: 'طلب ميزة', en: 'Feature Request' } },
    { value: 'other', label: { ar: 'أخرى', en: 'Other' } }
  ];

  const priorities = [
    { value: 'low', label: { ar: 'منخفض', en: 'Low' }, color: 'text-green-600' },
    { value: 'medium', label: { ar: 'متوسط', en: 'Medium' }, color: 'text-yellow-600' },
    { value: 'high', label: { ar: 'عالي', en: 'High' }, color: 'text-red-600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء إدخال موضوع التذكرة', 'Please enter a ticket subject'),
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء وصف المشكلة', 'Please describe the issue'),
        variant: "destructive"
      });
      return;
    }

    // Submit ticket
    toast({
      title: t('تم إرسال التذكرة', 'Ticket Submitted'),
      description: t('سنتواصل معك قريباً', 'We will contact you soon')
    });
    
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className={cn("flex items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
          <h2 className="text-xl font-semibold">{t('رفع تذكرة دعم', 'Submit Support Ticket')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Subject */}
          <div className="mb-4">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('الموضوع', 'Subject')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isRTL && "text-right"
              )}
              placeholder={t('أدخل موضوع التذكرة', 'Enter ticket subject')}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('الفئة', 'Category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isRTL && "text-right"
              )}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {t(cat.label.ar, cat.label.en)}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('الأولوية', 'Priority')}
            </label>
            <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
              {priorities.map((p) => (
                <label key={p.value} className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={priority === p.value}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <span className={p.color}>{t(p.label.ar, p.label.en)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('الوصف', 'Description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isRTL && "text-right"
              )}
              placeholder={t('صف المشكلة بالتفصيل...', 'Describe the issue in detail...')}
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('إرفاق ملف', 'Attach File')}
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">
                  {file ? file.name : t('انقر لإرفاق ملف', 'Click to attach file')}
                </span>
              </label>
            </div>
            <p className={cn("text-xs text-gray-500 mt-1", isRTL && "text-right")}>
              {t('الملفات المدعومة: JPG, PNG, PDF, DOC, DOCX', 'Supported files: JPG, PNG, PDF, DOC, DOCX')}
            </p>
          </div>

          {/* Actions */}
          <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('إرسال التذكرة', 'Submit Ticket')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('إلغاء', 'Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}