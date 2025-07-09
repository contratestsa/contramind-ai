import { useState, useRef, DragEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRTL = language === 'ar';

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('نوع الملف غير مدعوم', 'File type not supported'),
        description: t('يرجى تحميل ملف PDF أو DOCX', 'Please upload PDF or DOCX'),
        variant: 'destructive'
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: t('الملف كبير جداً', 'File too large'),
        description: t('الحد الأقصى لحجم الملف هو 50 ميجابايت', 'Maximum size is 50MB'),
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    // Mock upload - in reality this would upload to server
    setTimeout(() => {
      toast({
        title: t('تم تحميل العقد بنجاح', 'Contract uploaded successfully'),
        description: t('جاري تحليل العقد...', 'Analyzing contract...')
      });
      // Navigate to analysis progress page
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        onClose();
        setLocation('/analysis-progress');
      }, 1000);
    }, 1000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    else return Math.round(bytes / 1048576) + ' MB';
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setIsDragging(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[650px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className={cn(
            "text-xl font-semibold",
            isRTL ? "text-right" : "text-left"
          )}>
            {t('تحميل ومراجعة العقد', 'Upload & Review Contract')}
          </DialogTitle>
        </DialogHeader>
        
        {/* Token Balance Section */}
        <div className="px-6">
          <div className="bg-[#0C2836] text-white px-4 py-3 rounded-lg">
            <div className="font-bold text-sm mb-1">
              {t('رصيدك: 1,000 رمز', 'Your Balance: 1,000 Tokens')}
            </div>
            <div className="text-xs opacity-90">
              {t('التحميل والتحليل يكلف 10 رموز', 'Upload & Analysis costs 10 tokens')}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="px-6 pb-6 pt-4">
          {!selectedFile ? (
            <div
              className={cn(
                "h-[250px] border-2 border-dashed border-[#E6E6E6] bg-[#FAFAFA] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
                isDragging && "border-[#B7DEE8] bg-[#E8F4F8]",
                "hover:border-[#B7DEE8]"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <h3 className="text-base font-bold text-gray-700 mb-2">
                {t('اسحب وأفلت عقدك هنا', 'Drag & drop your contract here')}
              </h3>
              <p className="text-sm text-blue-600 mb-2">
                {t('أو انقر للاستعراض', 'or click to browse')}
              </p>
              <p className="text-xs text-[#6C757D]">
                {t('PDF و DOCX فقط (بحد أقصى 50 ميجابايت)', 'PDF, DOCX only (Max 50MB)')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border-2 border-[#E6E6E6] bg-[#FAFAFA] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-[#6C757D]">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  disabled={isUploading}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                </button>
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-[#0C2836] text-white py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('جاري تحميل العقد...', 'Uploading contract...')}
                  </>
                ) : (
                  <>
                    {t('تحميل وتحليل العقد (10 رموز)', 'Upload & Analyze Contract (10 tokens)')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}