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
  ChevronDown
} from "lucide-react";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (2)_1752148262770.png';
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import UploadModal from "@/components/UploadModal";
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
  id: string;
  name: string;
  uploadedAt: Date;
  status: 'analyzing' | 'ready';
  riskLevel?: 'low' | 'medium' | 'high';
  date?: string;
}

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [userTokens, setUserTokens] = useState(1000);
  const [contractSearchQuery, setContractSearchQuery] = useState('');
  const [showSlidingPanel, setShowSlidingPanel] = useState(false);
  const [slidingPanelContent, setSlidingPanelContent] = useState<'prompts' | 'contractDetails' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = language === 'ar';

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

  // Redirect if not authenticated
  useEffect(() => {
    if (error || (!isLoading && !userData?.user)) {
      setLocation('/');
    }
  }, [error, isLoading, userData, setLocation]);



  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContractUpload = (file: File, partyType: string) => {
    // Generate random risk level for demo
    const riskLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    const newContract: Contract & { riskLevel: 'low' | 'medium' | 'high'; date: string } = {
      id: Date.now().toString(),
      name: file.name,
      uploadedAt: new Date(),
      status: 'analyzing',
      riskLevel: randomRisk,
      date: new Date().toLocaleDateString()
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
    setSlidingPanelContent(content);
    setShowSlidingPanel(true);
  };

  const closeSlidingPanel = () => {
    setShowSlidingPanel(false);
    setTimeout(() => {
      setSlidingPanelContent(null);
    }, 300); // Wait for animation to complete
  };

  const exampleCards = [
    {
      title: t('تحليل اتفاقية البائع', 'Analyze a vendor agreement'),
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: t('مراجعة بنود المسؤولية', 'Review liability clauses'),
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: t('فحص شروط الدفع', 'Check payment terms'),
      icon: <FileText className="w-5 h-5" />
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  const user = userData?.user;

  return (
    <div className={cn("flex h-screen bg-gradient-to-br from-[#0C2836] to-[#1a3a4a] overflow-hidden", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <div className={cn(
        "w-[260px] bg-[#202123] text-white flex flex-col transition-all duration-300 shadow-xl",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "fixed lg:relative inset-y-0 z-40",
        isRTL && "lg:order-2"
      )}>
        {/* Logo and Hamburger */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <img 
            src={logoImage} 
            alt="ContraMind" 
            className="h-10 flex-1 object-contain"
          />
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            <div className="w-5 h-5 relative">
              <span className={cn(
                "absolute block h-0.5 w-5 bg-current transform transition-all duration-300",
                showMobileSidebar ? "rotate-45 translate-y-2" : "-translate-y-1.5"
              )} />
              <span className={cn(
                "absolute block h-0.5 w-5 bg-current transform transition-all duration-300 top-2",
                showMobileSidebar && "opacity-0"
              )} />
              <span className={cn(
                "absolute block h-0.5 w-5 bg-current transform transition-all duration-300 top-4",
                showMobileSidebar ? "-rotate-45 -translate-y-2" : "translate-y-1.5"
              )} />
            </div>
          </button>
        </div>

        {/* New Contract Analysis Button */}
        <div className="p-3 border-b border-gray-700">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#B7DEE8] text-[#0C2836] rounded-md hover:bg-[#a5d0db] transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{t('تحليل عقد جديد', 'New Contract Analysis')}</span>
          </button>
        </div>

        {/* Contract Search Box */}
        <div className="p-3 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={contractSearchQuery}
              onChange={(e) => setContractSearchQuery(e.target.value)}
              placeholder={t('البحث في محادثات العقود...', 'Search contract chats...')}
              className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] transition-all duration-200"
            />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Contracts */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                {t('العقود الأخيرة', 'Recent Contracts')}
              </h3>
              <button className="text-xs text-[#B7DEE8] hover:text-[#a5d0db] transition-colors">
                {t('عرض الكل', 'View All')}
              </button>
            </div>
            <div className="space-y-1">
              {recentContractsData?.contracts?.slice(0, 5).map((contract: any) => (
                <button
                  key={contract.id}
                  onClick={() => {
                    setSelectedContract(contract);
                    openSlidingPanel('contractDetails');
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded hover:bg-gray-700 transition-colors group",
                    selectedContract?.id === contract.id && "bg-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{contract.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span>{contract.partyName}</span>
                    <span>•</span>
                    <span>{new Date(contract.date).toLocaleDateString()}</span>
                    <span className="ml-auto">
                      {contract.riskLevel === 'low' && '🟢'}
                      {contract.riskLevel === 'medium' && '🟡'}
                      {contract.riskLevel === 'high' && '🔴'}
                    </span>
                  </div>
                </button>
              ))}
              {(!recentContractsData?.contracts || recentContractsData.contracts.length === 0) && (
                <p className="text-xs text-gray-500 italic p-2">{t('لا توجد عقود بعد', 'No contracts yet')}</p>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 pb-3">
            <div className="space-y-1">
              <button
                onClick={() => setLocation('/analytics')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('التحليلات والتقارير', 'Analytics & Reports')}</span>
              </button>
              
              <button
                onClick={() => setLocation('/parties')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <Users className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('الأطراف وجهات الاتصال', 'Parties & Contacts')}</span>
              </button>
              
              <button
                onClick={() => setLocation('/notifications')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <Bell className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('الإشعارات', 'Notifications')}</span>
              </button>
              
              <button
                onClick={() => setLocation('/tags')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <Tag className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('العلامات والفئات', 'Tags & Categories')}</span>
              </button>
              
              <button
                onClick={() => setLocation('/settings/personal')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('الإعدادات', 'Settings')}</span>
              </button>
            </div>
          </nav>

          {/* Help Section */}
          <div className="px-3 pb-3 border-t border-gray-700 pt-3">
            <div className="space-y-1">
              <button
                onClick={() => setLocation('/legal-resources')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('الموارد القانونية', 'Legal Resources')}</span>
              </button>
              
              <button
                onClick={() => setLocation('/help')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('مركز المساعدة', 'Help Center')}</span>
              </button>
              
              <button
                onClick={() => setLocation('/whats-new')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <Info className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('ما الجديد', "What's New")}</span>
              </button>
              
              <button
                onClick={() => setLocation('/feedback')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
              >
                <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-sm">{t('التعليقات', 'Feedback')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="border-t border-gray-700 p-3">
          <button
            onClick={() => setLocation('/profile')}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{user?.fullName}</div>
                <div className="text-xs text-gray-400">{t('الملف الشخصي', 'Profile')}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
          
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">{t('تسجيل الخروج', 'Sign Out')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Toggle - Outside sidebar */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className={cn(
          "lg:hidden fixed top-4 z-50 p-2 bg-[#202123] text-white rounded-md shadow-lg",
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
        "flex-1 flex flex-col transition-all duration-300",
        showSlidingPanel && "mr-[40%]",
        isRTL && showSlidingPanel && "mr-0 ml-[40%]"
      )}>
        {selectedContract ? (
          <>
            {/* Contract Header */}
            <div className="bg-[#0a1f2a] bg-opacity-80 backdrop-blur-lg border-b border-[#1a4a5e] px-4 py-3">
              <h1 className="text-lg font-medium text-white">{selectedContract.name}</h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto p-4">
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
                          ? 'bg-[#0C2836] text-white' 
                          : 'bg-gray-100 text-gray-800'
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

            {/* Input Area */}
            <div className={cn(
              "fixed bottom-0 bg-[#40414F] border-t border-[#565869] p-4 transition-all duration-300",
              !isRTL ? "left-[260px]" : "right-[260px]",
              showSlidingPanel && !isRTL && "right-[40%]",
              showSlidingPanel && isRTL && "left-[40%]",
              !showSlidingPanel && "right-0"
            )}>
              <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center gap-2">
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
                    className="flex-1 bg-[#40414F] border border-[#565869] rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    maxLength={500}
                  />
                  <button
                    onClick={() => openSlidingPanel('prompts')}
                    className="p-3 bg-[#40414F] border border-[#565869] rounded-lg text-white hover:bg-[#2A2B32] transition-colors"
                    title={t('اختر موجه', 'Select prompt')}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || userTokens < 5}
                    className={cn(
                      "absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded transition-colors",
                      inputValue.trim() && userTokens >= 5
                        ? "text-white hover:bg-[#2A2B32]"
                        : "text-gray-600 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {t('5 رموز لكل سؤال', '5 tokens per question')}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center pb-24">
              <div className="max-w-3xl w-full px-4">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-medium text-white mb-2">
                    {t(`مرحباً ${user?.fullName?.split(' ')[0] || ''}`, `Welcome back, ${user?.fullName?.split(' ')[0] || ''}`)}
                  </h1>
                  <h2 className="text-2xl text-gray-300 mb-2">
                    {t('قم برفع عقد للبدء', 'Upload a contract to start')}
                  </h2>
                  <p className="text-gray-400">
                    {t('تحليل ذكي للعقود باللغتين العربية والإنجليزية', 'Smart contract analysis in Arabic and English')}
                  </p>
                </div>

                {/* Chat Input Bar */}
                <div className="mt-8 bg-[#0a1f2a] bg-opacity-80 backdrop-blur-lg border border-[#1a4a5e] rounded-lg p-4">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={t('اسأل عن هذا العقد...', 'Ask about this contract...')}
                      className="flex-1 bg-[#0a1f2a] bg-opacity-50 border border-[#1a4a5e] rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#2a6a8e]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !selectedContract) {
                          toast({
                            title: t('يرجى رفع عقد أولاً', 'Please upload a contract first'),
                            variant: 'destructive'
                          });
                        }
                      }}
                    />
                    <button
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title={t('إرفاق ملف', 'Attach file')}
                      onClick={() => setIsUploadModalOpen(true)}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      onClick={() => {
                        if (!selectedContract) {
                          toast({
                            title: t('يرجى رفع عقد أولاً', 'Please upload a contract first'),
                            variant: 'destructive'
                          });
                        }
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    {t('5 رموز لكل سؤال', '5 tokens per question')}
                  </div>
                </div>

                {/* Suggested Questions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {exampleCards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => setIsUploadModalOpen(true)}
                      className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-left group min-h-[80px] flex items-center justify-between"
                    >
                      <span className="text-base text-gray-800 font-medium">{card.title}</span>
                      <span className="text-gray-600 ml-2">→</span>
                    </button>
                  ))}
                </div>


              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleContractUpload}
      />

      {/* Sliding Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-[40%] bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50",
        showSlidingPanel ? "translate-x-0" : "translate-x-full",
        isRTL && "right-auto left-0",
        isRTL && showSlidingPanel ? "-translate-x-0" : isRTL && "-translate-x-full"
      )}>
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
                    <p className="text-gray-900">{selectedContract?.name}</p>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSlidingPanel}
        />
      )}
    </div>
  );
}