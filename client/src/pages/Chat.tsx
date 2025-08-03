import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Grid3X3, 
  Plus, 
  Folder, 
  Bell, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Calendar,
  LogOut,
  Inbox,
  Globe,
  X,
  Send,
  Copy,
  ChevronRight,
  User,
  Building,
  Bot,
  Menu
} from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Sidebar navigation item structure with bilingual support
 */
interface SidebarItem {
  icon: React.ReactNode;                    // Icon component to display
  label: { ar: string; en: string };        // Bilingual label
  path: string;                             // Route path
  subItems?: SidebarItem[];                 // Optional nested items
}

/**
 * User interface for authenticated user data
 */
interface User {
  id: number;                               // User's unique identifier
  username: string;                         // Username for display
  fullName?: string;                        // Optional full name
  profilePicture?: string;                  // Optional profile image URL
}

/**
 * Chat message structure for contract conversations
 */
interface Message {
  id: string;                               // Unique message identifier
  content: string;                          // Message text content
  role: 'user' | 'assistant' | 'system';    // Message sender type
  timestamp: Date;                          // Message timestamp
}

/**
 * Main Chat component - ChatGPT-style interface for contract analysis
 * Handles contract upload, analysis, and AI-powered conversations
 */
export default function Chat() {
  const { t, language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [expandedSettings, setExpandedSettings] = useState(location.startsWith('/settings'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(100); // Mock token count
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchQuery = useSearch();
  const initialQuery = new URLSearchParams(searchQuery).get('q') || '';
  const isRTL = language === 'ar';

  // Fetch user data
  const { data: userData, isLoading: userLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-area')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotifications]);

  // Initialize chat with system message and user's question
  useEffect(() => {
    const systemMessage: Message = {
      id: '1',
      content: t(
        'يمكنني مساعدتك في أسئلة عقود التكنولوجيا. كل رسالة تكلف 5 رموز.',
        'I can help you with technology contract questions. Each message costs 5 tokens.'
      ),
      role: 'system',
      timestamp: new Date()
    };
    
    setMessages([systemMessage]);

    // If there's an initial query, add it as a user message
    if (initialQuery) {
      const userMessage: Message = {
        id: '2',
        content: initialQuery,
        role: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response after 2 seconds
      setTimeout(() => {
        const aiResponse: Message = {
          id: '3',
          content: getMockResponse(initialQuery),
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setTokenCount(prev => prev - 5);
      }, 2000);
    }
  }, [initialQuery, t]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && (error || !userData)) {
      setLocation('/');
    }
  }, [error, userLoading, userData, setLocation]);

  const getMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('limitation of liability') || lowerQuestion.includes('حد المسؤولية')) {
      return t(
        'شرط حد المسؤولية هو بند تعاقدي يحدد الحد الأقصى للمبلغ الذي يتعين على أحد الأطراف دفعه للآخر في حالة الإخلال أو الأضرار. في عقود التكنولوجيا، غالبًا ما يقتصر هذا على الرسوم المدفوعة بموجب العقد. من المهم مراجعة هذه البنود بعناية لأنها يمكن أن تؤثر بشكل كبير على تعرضك للمخاطر.',
        'A limitation of liability clause is a contractual provision that caps the amount one party has to pay the other in case of breach or damages. In technology contracts, this often limits liability to the fees paid under the contract. It\'s important to review these carefully as they can significantly impact your risk exposure.'
      );
    } else if (lowerQuestion.includes('payment terms') || lowerQuestion.includes('شروط الدفع')) {
      return t(
        'شروط الدفع القياسية في عقود التكنولوجيا عادة ما تكون صافي 30 يومًا من تاريخ الفاتورة. قد تتضمن بعض العقود دفعات مقدمة أو دفعات على مراحل مرتبطة بإنجازات المشروع. من المهم توضيح شروط الدفع المتأخر والفوائد إن وجدت.',
        'Standard payment terms in technology contracts are typically Net 30 days from invoice date. Some contracts may include upfront payments or milestone-based payments tied to project deliverables. It\'s important to clarify late payment terms and interest if applicable.'
      );
    } else if (lowerQuestion.includes('ip ownership') || lowerQuestion.includes('الملكية الفكرية')) {
      return t(
        'تحدد بنود الملكية الفكرية من يملك الحقوق في العمل المنشأ. في عقود التكنولوجيا، يمكن أن تنتقل الملكية إلى العميل (عمل مقابل أجر) أو تبقى مع المورد مع منح ترخيص. انتبه إلى الملكية الفكرية الموجودة مسبقًا والتحسينات.',
        'IP ownership clauses determine who owns the rights to created work. In technology contracts, ownership can transfer to the client (work for hire) or remain with the vendor with a license granted. Pay attention to pre-existing IP and improvements.'
      );
    } else if (lowerQuestion.includes('termination') || lowerQuestion.includes('إنهاء')) {
      return t(
        'يحدد شرط الإنهاء كيف ومتى يمكن لأي من الطرفين إنهاء العقد. عادة ما يتضمن الإنهاء للراحة (بإشعار) والإنهاء للسبب (للإخلال). راجع فترات الإشعار والتزامات ما بعد الإنهاء والحقوق في البيانات.',
        'A termination clause specifies how and when either party can end the contract. It typically includes termination for convenience (with notice) and termination for cause (for breach). Review notice periods, post-termination obligations, and rights to data.'
      );
    } else {
      return t(
        'هذا سؤال مهم حول عقود التكنولوجيا. دعني أقدم لك بعض الإرشادات العامة. تذكر أن كل عقد فريد ويجب مراجعته بعناية مع مراعاة احتياجاتك الخاصة ومتطلبات عملك.',
        'That\'s an important question about technology contracts. Let me provide some general guidance. Remember that each contract is unique and should be reviewed carefully considering your specific needs and business requirements.'
      );
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || tokenCount < 5) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setTokenCount(prev => prev - 5);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getMockResponse(inputValue),
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: t('تم النسخ!', 'Copied!'),
      description: t('تم نسخ الرسالة إلى الحافظة', 'Message copied to clipboard')
    });
  };

  const suggestedQuestions = [
    { ar: 'ما هي شروط الدفع القياسية؟', en: 'What are standard payment terms?' },
    { ar: 'اشرح ملكية الملكية الفكرية', en: 'Explain IP ownership' },
    { ar: 'ما هو شرط الإنهاء؟', en: 'What is a termination clause?' }
  ];

  const sidebarItems: SidebarItem[] = [
    { icon: <Grid3X3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "لوحة التحكم", en: "Dashboard" }, path: "/dashboard" },
    { icon: <Plus className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "إنشاء", en: "Create" }, path: "/create" },
    { icon: <Folder className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "ملفاتي", en: "My Drive" }, path: "/repository" },
    { icon: <Bell className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "التنبيهات", en: "Alerts" }, path: "/alerts" },
    { icon: <CheckCircle className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "المهام", en: "Tasks" }, path: "/tasks" },
    { icon: <BarChart3 className="w-[18px] h-[18px] text-gray-700" />, label: { ar: "التقارير", en: "Reports" }, path: "/reports" },
    { 
      icon: <Settings className="w-[18px] h-[18px] text-gray-700" />, 
      label: { ar: "الإعدادات", en: "Settings" }, 
      path: "/settings",
      subItems: [
        { icon: <User className="w-[16px] h-[16px] text-gray-600" />, label: { ar: "الإعدادات الشخصية", en: "Personal Settings" }, path: "/settings/personal" },
        { icon: <Building className="w-[16px] h-[16px] text-gray-600" />, label: { ar: "إعدادات المؤسسة", en: "Organization Settings" }, path: "/settings/organization" }
      ]
    },
  ];

  if (userLoading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn("min-h-screen flex bg-white", isRTL ? "flex-row-reverse" : "flex-row")}>
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-[200px] h-screen bg-[#F8F9FA] fixed z-50 transition-transform duration-300 md:translate-x-0 shadow-2xl",
        showMobileSidebar ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full",
        isRTL ? "right-0 shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.1)]" : "left-0 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.1)]"
      )}>
        {/* Logo */}
        <div className="h-[80px] flex items-center bg-[#0C2836]">
          <img 
            src={logoImage} 
            alt="ContraMind Logo" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* My Work Section */}
        <div className="bg-white text-[#0C2836] px-5 py-3 border-b border-gray-200">
          <h3 className={cn("text-base font-semibold", isRTL ? "text-right" : "text-left")}>
            {t('عملي', 'My Work')}
          </h3>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="py-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    if (item.path === '/settings') {
                      setExpandedSettings(!expandedSettings);
                    } else if (item.path === '/dashboard' || item.path === '/repository' || item.path === '/tasks') {
                      setLocation(item.path);
                    } else {
                      toast({ title: t('قريباً', 'Coming Soon'), description: t(`${item.label.ar} قريباً`, `${item.label.en} coming soon`) });
                    }
                  }}
                  className="w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors"
                >
                  {item.subItems && (
                    <div className={cn("transition-transform", expandedSettings ? "rotate-90" : "", isRTL ? "order-last" : "order-first")}>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  {item.icon}
                  <span className={cn("text-[15px] text-gray-700 flex-1", isRTL ? "text-right" : "text-left")}>
                    {t(item.label.ar, item.label.en)}
                  </span>
                </button>

                {/* Sub-items */}
                {item.subItems && expandedSettings && (
                  <ul>
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <button
                          onClick={() => setLocation(subItem.path)}
                          className={cn(
                            "w-full h-[40px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors",
                            isRTL ? "pr-10" : "pl-10"
                          )}
                        >
                          {subItem.icon}
                          <span className={cn("text-[14px] text-gray-600 flex-1", isRTL ? "text-right" : "text-left")}>
                            {t(subItem.label.ar, subItem.label.en)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setLocation('/help')}
                className="w-full h-[44px] px-5 flex items-center gap-3 hover:bg-[#E6E6E6] transition-colors"
              >
                <HelpCircle className="w-[18px] h-[18px] text-gray-700" />
                <span className={cn("text-[15px] text-gray-700 flex-1", isRTL ? "text-right" : "text-left")}>
                  {t('المساعدة', 'Help')}
                </span>
              </button>
            </li>

          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1 flex flex-col", isRTL ? "md:mr-[200px]" : "md:ml-[200px]")}>
        {/* Header */}
        <header className="h-[60px] md:h-[72px] bg-white border-b border-[#E6E6E6] px-4 md:px-6 flex items-center justify-between">
          <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
            {/* Mobile hamburger menu */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden mr-2"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setLocation('/dashboard')}
              className="text-gray-500 text-xs md:text-sm hover:text-gray-700 transition-colors cursor-pointer"
            >
              {t('لوحة التحكم', 'Dashboard')}
            </button>
            <ChevronRight className={cn("w-3 h-3 md:w-4 md:h-4 text-gray-400 mx-1 md:mx-2", isRTL && "rotate-180")} />
            <span className="text-gray-700 text-xs md:text-sm font-medium">{t('مساعد العقود', 'Contract Assistant')}</span>
          </div>

          <div className={cn("flex items-center gap-2 md:gap-4", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600", isRTL && "flex-row-reverse")}>
              <span className="hidden sm:inline">{t('الرموز المتبقية:', 'Tokens remaining:')}</span>
              <span className="sm:hidden">{t('رموز:', 'Tokens:')}</span>
              <span className="font-semibold text-[#0C2836]">{tokenCount}</span>
            </div>
            
            <div className="relative notification-area">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-[20px] h-[20px] text-gray-700" />
                {hasNotifications && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className={cn(
                  "absolute top-full mt-2 w-[250px] bg-white border border-[#E6E6E6] rounded-lg shadow-sm",
                  isRTL ? "left-0" : "right-0"
                )}>
                  {/* Notification 1 */}
                  <div className="p-3 border-b border-[#E6E6E6]">
                    <p className="text-sm font-normal text-gray-800" style={{ fontFamily: 'Inter' }}>
                      {t('اكتمل تحليل العقد', 'Contract analysis complete')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                      {t('قبل 5 دقائق', '5 minutes ago')}
                    </p>
                  </div>
                  
                  {/* Notification 2 */}
                  <div className="p-3">
                    <p className="text-sm font-normal text-gray-800" style={{ fontFamily: 'Inter' }}>
                      {t('مرحباً بك في ContraMind', 'Welcome to ContraMind')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                      {t('اليوم', 'Today')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleLanguage}
              className="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-[20px] h-[20px] text-gray-700" />
            </button>

            <button
              onClick={() => {
                toast({ title: t('تسجيل الخروج', 'Logging out') });
                setLocation('/');
              }}
              className="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-[20px] h-[20px] text-gray-700" />
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex justify-center items-start p-4 md:p-6 overflow-hidden">
          <div className="w-full max-w-[800px] h-full bg-white border border-[#E6E6E6] rounded-lg flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#F8F9FA] px-4 md:px-6 py-3 md:py-4 border-b border-[#E6E6E6] flex items-center justify-between">
              <div>
                <h2 className={cn("text-sm md:text-lg font-semibold text-[#0C2836]", isRTL && "text-right")}>
                  {t('مساعد العقود', 'Contract Assistant')}
                </h2>
                <p className={cn("text-xs md:text-sm text-gray-600 mt-1 hidden md:block", isRTL && "text-right")}>
                  {t('اسأل أسئلة حول عقود التكنولوجيا', 'Ask questions about technology contracts')}
                </p>
              </div>
              <div className={cn("flex items-center gap-2 md:gap-3", isRTL && "flex-row-reverse")}>
                <div className="bg-white px-2 md:px-3 py-1 rounded-full border border-[#E6E6E6] text-xs md:text-sm text-gray-600">
                  {t('5 رموز', '5 tokens')}
                </div>
                <button
                  onClick={() => setLocation('/dashboard')}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-4 flex items-start gap-3",
                    message.role === 'user' && "justify-end",
                    message.role === 'system' && "justify-center",
                    isRTL && message.role !== 'system' && "flex-row-reverse"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-[#0C2836] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] md:max-w-[70%] rounded-2xl px-3 md:px-4 py-2 md:py-3 relative group",
                      message.role === 'user' && "bg-[#0C2836] text-white",
                      message.role === 'assistant' && "bg-[#F8F9FA] text-[#0C2836]",
                      message.role === 'system' && "bg-[#E8F4F8] text-gray-700 max-w-full text-center"
                    )}
                  >
                    <p className={cn("text-xs md:text-sm", isRTL && "text-right")}>{message.content}</p>
                    
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => handleCopyMessage(message.content)}
                        className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {t('نسخ', 'Copy')}
                      </button>
                    )}
                    
                    <span className="opacity-0 group-hover:opacity-100 absolute -bottom-6 right-0 text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-700" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className={cn("flex items-center gap-3 mb-4", isRTL && "flex-row-reverse")}>
                  <div className="w-6 h-6 bg-[#0C2836] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#F8F9FA] rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[#E6E6E6] p-3 md:p-4 bg-white">
              <div className="mb-2 md:mb-3 flex gap-1 md:gap-2 flex-wrap">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(t(question.ar, question.en))}
                    className="px-2 md:px-3 py-1 text-xs md:text-sm bg-[#F8F9FA] text-gray-700 rounded-full border border-[#E6E6E6] hover:bg-gray-200 transition-colors"
                  >
                    {t(question.ar, question.en)}
                  </button>
                ))}
              </div>
              
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('اسأل عن عقدك...', 'Ask about your contract...')}
                    className={cn(
                      "w-full h-10 md:h-11 px-3 md:px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 border border-[#E6E6E6] rounded-lg focus:outline-none focus:border-[#0C2836]",
                      isRTL && "text-right"
                    )}
                  />
                  {inputValue.length > 0 && (
                    <span className={cn("absolute bottom-[-18px] md:bottom-[-20px] text-[10px] md:text-xs text-gray-400", isRTL ? "left-0" : "right-0")}>
                      {inputValue.length}/500
                    </span>
                  )}
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || tokenCount < 5}
                  className={cn(
                    "h-10 md:h-11 px-3 md:px-4 bg-[#0C2836] text-white rounded-lg flex items-center gap-1 md:gap-2 transition-all",
                    (!inputValue.trim() || tokenCount < 5) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0a1f2e]"
                  )}
                  title={tokenCount < 5 ? t('رموز غير كافية', 'Insufficient tokens') : t('5 رموز', '5 tokens')}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}