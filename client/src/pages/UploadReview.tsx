import { useState, useRef, DragEvent } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { 
  Grid3X3, 
  Plus, 
  Folder, 
  Bell, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  Layers, 
  HelpCircle, 
  Calendar,
  LogOut,
  Inbox,
  Globe,
  Upload,
  FileText,
  X,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface SidebarItem {
  icon: React.ReactNode;
  label: { ar: string; en: string };
  path: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  profilePicture?: string;
}

export default function UploadReview() {
  const { t, language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRTL = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم تسجيل الخروج بنجاح', 'Logged out successfully'),
        description: t('نراك قريباً!', 'See you soon!')
      });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: t('خطأ في تسجيل الخروج', 'Logout Error'),
        description: t('حدث خطأ أثناء تسجيل الخروج', 'An error occurred while logging out'),
        variant: 'destructive'
      });
    }
  });

  const sidebarItems: SidebarItem[] = [
    { icon: <Grid3X3 className="w-[18px] h-[18px]" />, label: { ar: "لوحة القيادة", en: "Dashboard" }, path: "/dashboard" },
    { icon: <Plus className="w-[18px] h-[18px]" />, label: { ar: "إنشاء", en: "Create" }, path: "/create" },
    { icon: <Folder className="w-[18px] h-[18px]" />, label: { ar: "المستودع", en: "Repository" }, path: "/repository" },
    { icon: <Bell className="w-[18px] h-[18px]" />, label: { ar: "التنبيهات", en: "Alerts" }, path: "/alerts" },
    { icon: <CheckCircle className="w-[18px] h-[18px]" />, label: { ar: "المراجعة", en: "Review" }, path: "/review" },
    { icon: <BarChart3 className="w-[18px] h-[18px]" />, label: { ar: "التحليلات", en: "Analytics" }, path: "/analytics" },
    { icon: <Settings className="w-[18px] h-[18px]" />, label: { ar: "إعدادات", en: "Settings" }, path: "/settings" },
    { icon: <Layers className="w-[18px] h-[18px]" />, label: { ar: "النماذج", en: "Templates" }, path: "/templates" },
  ];

  const bottomItems: SidebarItem[] = [
    { icon: <HelpCircle className="w-[18px] h-[18px]" />, label: { ar: "المساعدة", en: "Help" }, path: "/help" },
    { icon: <Calendar className="w-[18px] h-[18px]" />, label: { ar: "حجز عرض توضيحي", en: "Schedule Demo" }, path: "/demo" },
  ];

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
      // Navigate to analysis page after 2 seconds
      setTimeout(() => {
        setLocation('/analysis');
      }, 2000);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    else return Math.round(bytes / 1048576) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const user = userData?.user;
  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className={cn("min-h-screen flex bg-white", isRTL ? "flex-row-reverse" : "flex-row")}>
      {/* Left Sidebar */}
      <div className="w-[200px] h-screen bg-[#F8F9FA] fixed z-10" style={{ [isRTL ? 'right' : 'left']: 0 }}>
        {/* Logo */}
        <div className="h-[60px] flex items-center px-5">
          <h1 className="text-xl font-bold text-[#0C2836]">ContraMind</h1>
        </div>

        {/* My Work Section */}
        <div className="bg-[#0C2836] text-white px-5 py-3">
          <h3 className="text-base font-semibold">{t('عملي', 'My Work')}</h3>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="py-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link href={item.path}>
                  <a className={cn(
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                    isRTL ? "flex-row-reverse text-right" : "text-left"
                  )}>
                    {item.icon}
                    <span className="text-[15px] text-gray-700">{t(item.label.ar, item.label.en)}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-gray-300">
          <ul className="py-2">
            {bottomItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) })}
                  className={cn(
                    "w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                    isRTL ? "flex-row-reverse text-right" : "text-left"
                  )}
                >
                  {item.icon}
                  <span className="text-[15px] text-gray-700">{t(item.label.ar, item.label.en)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1", isRTL ? "mr-[200px]" : "ml-[200px]")}>
        {/* Top Header */}
        <header className="h-[60px] bg-white shadow-sm flex items-center justify-between px-6" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {/* Left side (empty for now) */}
          <div />

          {/* Right side items */}
          <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
            {/* Inbox */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Inbox className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Token Counter */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#0C2836] text-white rounded-lg">
              <span className="text-lg">🪙</span>
              <span className="text-sm font-medium">1,000 {t('رموز', 'Tokens')}</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0C2836] text-white rounded-full flex items-center justify-center font-semibold">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.fullName} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('تسجيل الخروج', 'Logout')}
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="px-6 py-3 flex items-center gap-2 text-sm text-[#6C757D]">
          <Link href="/dashboard">
            <a className="hover:text-gray-700">{t('لوحة القيادة', 'Dashboard')}</a>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>{t('تحميل ومراجعة', 'Upload & Review')}</span>
        </div>

        {/* Main Content */}
        <main className="p-6">
          {/* Token Balance Section */}
          <div className="bg-[#0C2836] text-white px-6 py-4 rounded-lg mb-8">
            <div className="font-bold text-base mb-1">
              {t('رصيدك: 1,000 رمز', 'Your Balance: 1,000 Tokens')}
            </div>
            <div className="text-sm opacity-90">
              {t('التحميل والتحليل يكلف 10 رموز', 'Upload & Analysis costs 10 tokens')}
            </div>
          </div>

          {/* Upload Area */}
          <div className="max-w-[600px] mx-auto">
            {!selectedFile ? (
              <div
                className={cn(
                  "h-[300px] border-2 border-dashed border-[#E6E6E6] bg-[#FAFAFA] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
                  isDragging && "border-[#B7DEE8] bg-[#E8F4F8]",
                  "hover:border-[#B7DEE8]"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  {t('اسحب وأفلت عقدك هنا', 'Drag & drop your contract here')}
                </h3>
                <p className="text-base text-blue-600 mb-2">
                  {t('أو انقر للاستعراض', 'or click to browse')}
                </p>
                <p className="text-sm text-[#6C757D]">
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
              <div className="border-2 border-[#E6E6E6] bg-[#FAFAFA] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-gray-600" />
                    <div>
                      <p className="text-base font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-[#6C757D]">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <X className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                  </button>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-[#0C2836] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        </main>
      </div>
    </div>
  );
}