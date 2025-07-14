import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Plus,
  Settings,
  HelpCircle,
  Menu,
  X,
  Send,
  FileText,
  Upload,
  ChevronRight,
  Copy,
  User,
  LogOut,
  Paperclip,
  Search,
  BarChart3,
  Users,
  Bell,
  Tag,
  BookOpen,
  Info,
  MessageSquare,
  ChevronDown,
  Star,
  Globe
} from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';
import iconImage from '@assets/Profile Picture - ContraMind (V001)-1_1752437530152.png';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import UploadModal from "@/components/UploadModal";
import ProfileDropdown from "@/components/ProfileDropdown";
import { queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  profilePicture?: string;
  onboardingCompleted: boolean;
  companyNameEn?: string;
  companyNameAr?: string;
  country?: string;
  contractRole?: string;
}

interface Contract {
  id: number;
  title: string;
  partyName: string;
  uploadedAt: Date;
  status: string;
  riskLevel?: 'low' | 'medium' | 'high';
  date: string;
  type?: string;
}

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [userTokens, setUserTokens] = useState(1000);
  const [contractSearchQuery, setContractSearchQuery] = useState('');
  const [showSlidingPanel, setShowSlidingPanel] = useState(false);
  const [slidingPanelContent, setSlidingPanelContent] = useState<'prompts' | 'contractDetails' | null>(null);
  const [activePromptTab, setActivePromptTab] = useState<'suggested' | 'myPrompts'>('suggested');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRTL = language === 'ar';
  
  // Dynamic sidebar width for layout calculations
  const sidebarWidth = isSidebarCollapsed ? 60 : 260;
  const hasStartedChat = messages.length > 0;

  // Archive state
  const [archivedChats, setArchivedChats] = useState<{
    id: string;
    filename: string;
    timestamp: Date;
    lastMessageSnippet: string;
    messages: Message[];
    contract: Contract;
  }[]>([]);

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch recent contracts
  const { data: recentContractsData } = useQuery<{ contracts: any[] }>({
    queryKey: ["/api/contracts/recent"],
    enabled: !!userData?.user,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
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

  // Handle authentication status - removed redirect to allow proper loading



  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContractUpload = (file: File, partyType: string) => {
    // Generate random risk level for demo
    const riskLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    const newContract: Contract = {
      id: Date.now(),
      title: file.name,
      partyName: partyType === 'buyer' ? 'Buyer' : 'Vendor',
      uploadedAt: new Date(),
      status: 'analyzing',
      riskLevel: randomRisk,
      date: new Date().toISOString(),
      type: 'purchase'
    };
    
    setContracts([newContract, ...contracts]);
    setSelectedContract(newContract);
    
    // Add initial messages
    const initialMessages: Message[] = [
      {
        id: '1',
        type: 'system',
        content: t(
          `تم رفع العقد: ${file.name}`,
          `Contract uploaded: ${file.name}`
        ),
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'system',
        content: t(
          `تحليل كـ: ${partyType === 'buyer' ? 'مشتري' : 'بائع'}`,
          `Analyzing as: ${partyType}`
        ),
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'system',
        content: t(
          'جاري تحليل العقد... سيستغرق هذا بضع ثوانٍ.',
          'Analyzing contract... This will take a few seconds.'
        ),
        timestamp: new Date()
      }
    ];
    
    setMessages(initialMessages);
    
    // Simulate analysis completion
    setTimeout(() => {
      const analysisMessage: Message = {
        id: '4',
        type: 'system',
        content: t(
          'تم اكتمال التحليل! وجدت 3 مخاطر عالية و5 متوسطة. يمكنك طرح أي أسئلة حول العقد.',
          'Analysis complete! Found 3 high risks and 5 medium risks. You can ask any questions about the contract.'
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMessage]);
      
      // Update contract status
      setContracts(prev => prev.map(c => 
        c.id === newContract.id ? { ...c, status: 'ready' } : c
      ));
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || userTokens < 5) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUserTokens(prev => prev - 5);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: t(
          'شكراً على سؤالك. بناءً على تحليلي للعقد، إليك ما وجدته...',
          'Thank you for your question. Based on my analysis of the contract, here\'s what I found...'
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: t('تم النسخ', 'Copied'),
      description: t('تم نسخ الرسالة إلى الحافظة', 'Message copied to clipboard')
    });
  };

  const openSlidingPanel = (content: 'prompts' | 'contractDetails') => {
    console.log('Opening sliding panel:', content);
    setSlidingPanelContent(content);
    setShowSlidingPanel(true);
  };

  const closeSlidingPanel = () => {
    setShowSlidingPanel(false);
    setTimeout(() => {
      setSlidingPanelContent(null);
    }, 300); // Wait for animation to complete
  };

  // Archive current chat and start new
  const archiveCurrentChat = () => {
    if (selectedContract && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const archivedChat = {
        id: Date.now().toString(),
        filename: selectedContract.title,
        timestamp: new Date(),
        lastMessageSnippet: lastMessage.content.substring(0, 50) + '...',
        messages: [...messages],
        contract: { ...selectedContract }
      };
      
      setArchivedChats([archivedChat, ...archivedChats]);
    }
    
    // Clear current chat
    setMessages([]);
    setSelectedContract(null);
    setInputValue('');
  };

  // Load archived chat
  const loadArchivedChat = (archivedChat: typeof archivedChats[0]) => {
    setSelectedContract(archivedChat.contract);
    setMessages(archivedChat.messages);
    // Close sliding panel if open
    setShowSlidingPanel(false);
  };



  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-[#0C2836]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B7DEE8]"></div>
    </div>;
  }

  if (error || !userData?.user) {
    return <div className="flex items-center justify-center h-screen bg-[#0C2836] text-white">
      <div className="text-center">
        <h1 className="text-2xl mb-4">{t('جلسة انتهت', 'Session Expired')}</h1>
        <p className="mb-4">{t('يرجى تسجيل الدخول مرة أخرى', 'Please login again')}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-[#B7DEE8] text-[#0C2836] rounded hover:bg-opacity-90"
        >
          {t('العودة للصفحة الرئيسية', 'Return to Homepage')}
        </button>
      </div>
    </div>;
  }

  const user = userData?.user;

  return (
    <div className={cn("relative flex h-screen bg-gradient-to-br from-[#0C2836] to-[#1a3a4a] overflow-hidden", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <div className={cn(
        "bg-[#0C2836] text-white flex flex-col transition-all duration-300 shadow-xl",
        isSidebarCollapsed ? "w-[60px]" : "w-[260px]",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "fixed lg:relative inset-y-0 z-40",
        isRTL && "lg:order-2"
      )}>
        {/* Logo and Hamburger */}
        <div className="flex items-center justify-between p-3 border-b border-[rgba(183,222,232,0.2)]">
          <img 
            src={logoImage} 
            alt="ContraMind" 
            className={cn(
              "h-10 object-contain transition-all duration-300",
              isSidebarCollapsed ? "w-0 opacity-0" : "flex-1"
            )}
          />
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-[rgba(183,222,232,0.1)] rounded-md transition-colors flex-shrink-0 relative w-9 h-9 flex items-center justify-center"
          >
            {/* Hamburger Menu */}
            <div className={cn(
              "w-5 h-5 absolute transition-all duration-300",
              isSidebarCollapsed ? "opacity-0 scale-75" : "opacity-100 scale-100"
            )}>
              <span className="absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out origin-center translate-y-0" />
              <span className="absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out top-2" />
              <span className="absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out origin-center top-4 translate-y-0" />
            </div>
            
            {/* ContraMind Icon */}
            <img 
              src={iconImage} 
              alt="ContraMind" 
              className={cn(
                "w-6 h-6 object-contain absolute transition-all duration-300",
                isSidebarCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
            />
          </button>
        </div>

        {/* New Contract Analysis Button */}
        <div className="p-3 border-b border-[rgba(183,222,232,0.2)]">
          <button
            onClick={() => {
              archiveCurrentChat();
              setIsUploadModalOpen(true);
            }}
            className={cn(
              "w-full flex items-center gap-2 py-2.5 bg-[#B7DEE8] text-[#0C2836] rounded-md hover:bg-[#a5d0db] transition-all duration-200 font-medium shadow-sm hover:shadow-md",
              isSidebarCollapsed ? "justify-center px-2" : "justify-center px-4"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>{t('تحليل عقد جديد', 'New Contract Analysis')}</span>}
          </button>
        </div>

        {/* Contract Search Box */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-b border-[rgba(183,222,232,0.2)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(183,222,232,0.6)]" />
              <input
                type="text"
                value={contractSearchQuery}
                onChange={(e) => setContractSearchQuery(e.target.value)}
                placeholder={t('البحث في محادثات العقود...', 'Search contract chats...')}
                className="w-full pl-10 pr-3 py-2 bg-[rgba(183,222,232,0.1)] text-white placeholder-[rgba(183,222,232,0.6)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Contracts */}
          {!isSidebarCollapsed && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#B7DEE8] uppercase tracking-wider">
                  {t('العقود الأخيرة', 'Recent Contracts')}
                </h3>
                <button className="text-xs text-[#B7DEE8] hover:text-[#a5d0db] transition-colors">
                  {t('عرض الكل', 'View All')}
                </button>
              </div>
              <div className="space-y-1">
                {archivedChats.length === 0 ? (
                  <p className="text-xs text-[rgba(183,222,232,0.6)] italic p-2">
                    {t('لا توجد محادثات مؤرشفة', 'No archived chats')}
                  </p>
                ) : (
                  archivedChats.slice(0, 5).map((archive) => (
                    <button
                      key={archive.id}
                      onClick={() => loadArchivedChat(archive)}
                      className={cn(
                        "w-full text-left p-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                        selectedContract?.id === archive.contract.id && "bg-[rgba(183,222,232,0.1)]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{archive.filename}</span>
                        <ChevronRight className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[rgba(183,222,232,0.6)] mt-0.5">
                        <span>{archive.contract.partyName}</span>
                        <span>•</span>
                        <span>{new Date(archive.timestamp).toLocaleDateString()}</span>
                        <span className="ml-auto">
                          {archive.contract.riskLevel === 'low' && '🟢'}
                          {archive.contract.riskLevel === 'medium' && '🟡'}
                          {archive.contract.riskLevel === 'high' && '🔴'}
                      </span>
                    </div>
                  </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="px-3 pb-3">
            <div className="space-y-1">
              <button
                onClick={() => setLocation('/analytics')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('التحليلات والتقارير', 'Analytics & Reports') : undefined}
              >
                <BarChart3 className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/parties')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('الأطراف وجهات الاتصال', 'Parties & Contacts') : undefined}
              >
                <Users className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/notifications')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('الإشعارات', 'Notifications') : undefined}
              >
                <Bell className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm">{t('الإشعارات', 'Notifications')}</span>}
              </button>
              
              <button
                onClick={() => setLocation('/tags')}
                className={cn(
                  "w-full flex items-center gap-3 py-2 rounded hover:bg-[rgba(183,222,232,0.1)] transition-colors group",
                  isSidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                title={isSidebarCollapsed ? t('العلامات والفئات', 'Tags & Categories') : undefined}
              >
                <Tag className="w-4 h-4 text-[rgba(183,222,232,0.6)] group-hover:text-white flex-shrink-0" />
                {!isSidebarCollapsed && <span className="text-sm">{t('العلامات والفئات', 'Tags & Categories')}</span>}
              </button>
            </div>
          </nav>
        </div>


      </div>

      {/* Mobile Sidebar Toggle - Outside sidebar */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className={cn(
          "lg:hidden fixed top-4 z-50 p-2 bg-[#0C2836] text-white rounded-md shadow-lg",
          isRTL ? "right-4" : "left-4",
          showMobileSidebar && "hidden"
        )}
      >
        <div className="w-5 h-5 relative">
          <span className="absolute block h-0.5 w-5 bg-current transform -translate-y-1.5" />
          <span className="absolute block h-0.5 w-5 bg-current transform top-2" />
          <span className="absolute block h-0.5 w-5 bg-current transform translate-y-1.5 top-4" />
        </div>
      </button>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 h-screen flex flex-col transition-all duration-300",
        showSlidingPanel && "mr-[40%]",
        isRTL && showSlidingPanel && "mr-0 ml-[40%]"
      )}>
        {/* Top Header Bar */}
        <div className="flex-shrink-0 bg-[#0C2836] px-4 py-3 relative z-40">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            
            {/* Language Toggle */}
            <button
              onClick={() => {
                const newLang = language === 'ar' ? 'en' : 'ar';
                setLanguage(newLang);
              }}
              className="mr-8 px-3 py-1.5 bg-[rgba(183,222,232,0.1)] hover:bg-[rgba(183,222,232,0.2)] rounded-md transition-all duration-200 text-sm font-medium text-white flex items-center gap-2 relative z-50 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative z-50">
              <ProfileDropdown user={user} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
        {selectedContract ? (
          <div className="flex flex-col h-full bg-[#0C2836]">
            {/* Contract Header */}
            <div className="flex-shrink-0 bg-[#0C2836] border-b border-[rgba(183,222,232,0.2)] px-4 py-3">
              <h1 className="text-lg font-medium text-white">{selectedContract.title}</h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <div 
                className="max-w-3xl mx-auto p-4"
                style={{
                  paddingBottom: messages.length > 0 ? '120px' : '20px'
                }}>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "mb-4 flex",
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.type === 'user' 
                          ? 'bg-[#1a4158] text-white' 
                          : 'bg-[rgba(183,222,232,0.1)] text-gray-100 border border-[rgba(183,222,232,0.2)]'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 opacity-70">
                        <span className="text-xs">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'system' && (
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="ml-2 hover:opacity-100"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Centered when no messages, Fixed at bottom when messages exist */}
            <div 
              className="fixed flex items-center justify-center"
              style={{ 
                left: `${sidebarWidth}px`,
                right: 0,
                ...(hasStartedChat 
                  ? { bottom: '32px', height: 'auto' }
                  : { top: 0, bottom: 0 }
                ),
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="w-full max-w-3xl px-6">
                <div className="bg-[rgba(183,222,232,0.1)] p-3 rounded-lg">
                <div className="relative">
                  <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={t('اسأل عن هذا العقد...', 'Ask about this contract...')}
                    className="w-full bg-white border border-[rgba(183,222,232,0.2)] rounded-lg pl-4 pr-24 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#B7DEE8] focus:ring-2 focus:ring-[#B7DEE8] focus:ring-opacity-50"
                    maxLength={500}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || userTokens < 5}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        inputValue.trim() && userTokens >= 5
                          ? "text-white hover:bg-[rgba(183,222,232,0.1)]"
                          : "text-gray-600 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col h-full bg-[#0C2836] relative">
            {/* Messages/Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              <div className="max-w-3xl mx-auto w-full p-4 flex flex-col flex-1">
                {/* Hero Section - Only shown when no messages */}
                {messages.length === 0 && (
                  <div className="text-center pt-32 pb-8 mb-12 transition-all duration-300">
                    <h1 className="text-2xl font-medium text-white mb-2">
                      {t(`مرحباً ${userData?.user?.fullName?.split(' ')[0] || ''}`, `Welcome back, ${userData?.user?.fullName?.split(' ')[0] || ''}`)}
                    </h1>
                    <p className="text-base font-normal text-gray-400">
                      {t('قم برفع عقد للبدء', 'Upload a contract to start')}
                    </p>
                  </div>
                )}

                {/* Spacer to push cards to bottom */}
                <div className="flex-1"></div>

              </div>
            </div>

            {/* Centered Input Bar Container - Only when no chat started */}
            <div 
              className="fixed flex items-center justify-center"
              style={{ 
                left: `${sidebarWidth}px`,
                right: 0,
                top: 0,
                bottom: 0,
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="w-full max-w-3xl px-6">
                {/* Input Bar */}
                <div className="bg-[rgba(183,222,232,0.1)] p-3 rounded-lg">
                  <div className="relative">
                    <input
                    type="text"
                    placeholder={t('اسأل عن هذا العقد...', 'Ask about this contract...')}
                    className="w-full bg-white border border-[rgba(183,222,232,0.2)] rounded-lg pl-4 pr-24 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#B7DEE8] focus:ring-2 focus:ring-[#B7DEE8] focus:ring-opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !selectedContract) {
                        toast({
                          title: t('يرجى رفع عقد أولاً', 'Please upload a contract first'),
                          variant: 'destructive'
                        });
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      title={t('إرفاق ملف', 'Attach file')}
                      onClick={() => setIsUploadModalOpen(true)}
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      onClick={() => {
                        if (!selectedContract) {
                          toast({
                            title: t('يرجى رفع عقد أولاً', 'Please upload a contract first'),
                            variant: 'destructive'
                          });
                        }
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Prompt Selection System */}
              <div className="mt-4">
                <div className="bg-[#0C2836] rounded-lg p-4">
                  {/* Tab Headers */}
                  <div className="flex space-x-1 mb-4 bg-[rgba(183,222,232,0.1)] p-1 rounded-lg">
                    <button
                      className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300",
                        activePromptTab === 'suggested' 
                          ? "bg-[#B7DEE8] text-[#0C2836] shadow-sm" 
                          : "text-[rgba(183,222,232,0.6)] hover:text-white"
                      )}
                      onClick={() => setActivePromptTab('suggested')}
                    >
                      {t('مقترحة', 'Suggested')}
                    </button>
                    <button
                      className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300",
                        activePromptTab === 'myPrompts' 
                          ? "bg-[#B7DEE8] text-[#0C2836] shadow-sm" 
                          : "text-[rgba(183,222,232,0.6)] hover:text-white"
                      )}
                      onClick={() => setActivePromptTab('myPrompts')}
                    >
                      {t('موجهاتي', 'My Prompts')}
                    </button>
                  </div>
                  
                  {/* Prompts Content */}
                  <div className="grid grid-cols-2 gap-3">
                    {activePromptTab === 'suggested' ? (
                      <>
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (input) input.value = t('قم بتحليل هذا العقد وحدد المخاطر الرئيسية', 'Analyze this contract and identify key risks');
                          }}
                          className="text-left p-3 bg-[rgba(183,222,232,0.05)] border border-[rgba(183,222,232,0.2)] rounded-lg hover:bg-[rgba(183,222,232,0.1)] hover:border-[#B7DEE8] transition-all duration-300"
                        >
                          <p className="text-sm text-white">{t('تحليل المخاطر', 'Risk Analysis')}</p>
                          <p className="text-xs text-[rgba(183,222,232,0.6)] mt-1">{t('حدد المخاطر الرئيسية', 'Identify key risks')}</p>
                        </button>
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (input) input.value = t('لخص البنود الرئيسية في هذا العقد', 'Summarize the key clauses in this contract');
                          }}
                          className="text-left p-3 bg-[rgba(183,222,232,0.05)] border border-[rgba(183,222,232,0.2)] rounded-lg hover:bg-[rgba(183,222,232,0.1)] hover:border-[#B7DEE8] transition-all duration-300"
                        >
                          <p className="text-sm text-white">{t('ملخص العقد', 'Contract Summary')}</p>
                          <p className="text-xs text-[rgba(183,222,232,0.6)] mt-1">{t('البنود الرئيسية', 'Key clauses')}</p>
                        </button>
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (input) input.value = t('ما هي شروط الدفع في هذا العقد؟', 'What are the payment terms in this contract?');
                          }}
                          className="text-left p-3 bg-[rgba(183,222,232,0.05)] border border-[rgba(183,222,232,0.2)] rounded-lg hover:bg-[rgba(183,222,232,0.1)] hover:border-[#B7DEE8] transition-all duration-300"
                        >
                          <p className="text-sm text-white">{t('شروط الدفع', 'Payment Terms')}</p>
                          <p className="text-xs text-[rgba(183,222,232,0.6)] mt-1">{t('تفاصيل الدفع', 'Payment details')}</p>
                        </button>
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (input) input.value = t('راجع بنود الإنهاء والإلغاء', 'Review termination and cancellation clauses');
                          }}
                          className="text-left p-3 bg-[rgba(183,222,232,0.05)] border border-[rgba(183,222,232,0.2)] rounded-lg hover:bg-[rgba(183,222,232,0.1)] hover:border-[#B7DEE8] transition-all duration-300"
                        >
                          <p className="text-sm text-white">{t('بنود الإنهاء', 'Termination Clauses')}</p>
                          <p className="text-xs text-[rgba(183,222,232,0.6)] mt-1">{t('شروط الإلغاء', 'Cancellation terms')}</p>
                        </button>
                      </>
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-[rgba(183,222,232,0.6)] text-sm">{t('لا توجد موجهات محفوظة', 'No saved prompts')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleContractUpload}
      />

      {/* Sliding Panel */}
      <div 
        className={cn(
          "fixed inset-y-0 w-[40%] bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          !isRTL ? "right-0" : "left-0"
        )}
        style={{ 
          zIndex: 9999,
          transform: showSlidingPanel 
            ? 'translateX(0)' 
            : (!isRTL ? 'translateX(100%)' : 'translateX(-100%)')
        }}>
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {slidingPanelContent === 'prompts' && t('اختر موجه', 'Select a Prompt')}
              {slidingPanelContent === 'contractDetails' && t('تفاصيل العقد', 'Contract Details')}
            </h2>
            <button
              onClick={closeSlidingPanel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {slidingPanelContent === 'prompts' && (
              <div className="p-4">
                {/* Prompt Tabs */}
                <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
                  <button
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                      "bg-white text-gray-900 shadow-sm"
                    )}
                  >
                    {t('موجهات ContraMind', 'ContraMind Prompts')}
                  </button>
                  <button
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                      "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {t('موجهاتي المحفوظة', 'My Saved Prompts')}
                  </button>
                </div>

                {/* ContraMind Prompts List */}
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-[#B7DEE8] hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <h3 className="font-medium text-gray-900 mb-1">{t('تحليل شامل للعقد', 'Comprehensive Contract Analysis')}</h3>
                    <p className="text-sm text-gray-600">{t('تحليل كامل للعقد مع تحديد المخاطر والفرص', 'Complete contract analysis with risk and opportunity identification')}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-[#B7DEE8] hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <h3 className="font-medium text-gray-900 mb-1">{t('مراجعة بنود المسؤولية', 'Liability Clause Review')}</h3>
                    <p className="text-sm text-gray-600">{t('تحليل مفصل لبنود المسؤولية والتعويضات', 'Detailed analysis of liability and indemnification clauses')}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-[#B7DEE8] hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <h3 className="font-medium text-gray-900 mb-1">{t('فحص شروط الدفع', 'Payment Terms Check')}</h3>
                    <p className="text-sm text-gray-600">{t('مراجعة شروط الدفع والجداول الزمنية', 'Review payment terms and schedules')}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-[#B7DEE8] hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <h3 className="font-medium text-gray-900 mb-1">{t('تحليل الملكية الفكرية', 'IP Rights Analysis')}</h3>
                    <p className="text-sm text-gray-600">{t('مراجعة حقوق الملكية الفكرية والترخيص', 'Review intellectual property rights and licensing')}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-[#B7DEE8] hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <h3 className="font-medium text-gray-900 mb-1">{t('شروط الإنهاء', 'Termination Clauses')}</h3>
                    <p className="text-sm text-gray-600">{t('تحليل شروط إنهاء العقد والعواقب', 'Analyze contract termination conditions and consequences')}</p>
                  </div>
                </div>
              </div>
            )}

            {slidingPanelContent === 'contractDetails' && (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t('اسم العقد', 'Contract Name')}</h3>
                    <p className="text-gray-900">{selectedContract?.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t('التاريخ', 'Date')}</h3>
                    <p className="text-gray-900">{selectedContract?.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t('مستوى المخاطر', 'Risk Level')}</h3>
                    <p className="text-gray-900">
                      {selectedContract?.riskLevel === 'low' && '🟢 ' + t('منخفض', 'Low')}
                      {selectedContract?.riskLevel === 'medium' && '🟡 ' + t('متوسط', 'Medium')}
                      {selectedContract?.riskLevel === 'high' && '🔴 ' + t('عالي', 'High')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t('الحالة', 'Status')}</h3>
                    <p className="text-gray-900">
                      {selectedContract?.status === 'analyzing' ? t('قيد التحليل', 'Analyzing') : t('جاهز', 'Ready')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when panel is open */}
      {showSlidingPanel && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={{ zIndex: 9998 }}
          onClick={closeSlidingPanel}
        />
      )}
    </div>
  );
}