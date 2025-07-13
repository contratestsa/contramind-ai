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
  LogOut
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = language === 'ar';

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
    const newContract: Contract = {
      id: Date.now().toString(),
      name: file.name,
      uploadedAt: new Date(),
      status: 'analyzing'
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
    <div className={cn("flex h-screen bg-[#F7F7F8] overflow-hidden", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <div className={cn(
        "w-[260px] bg-[#202123] text-white flex flex-col transition-transform duration-300 lg:translate-x-0",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full",
        "fixed lg:relative inset-y-0 z-40",
        isRTL && "lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-3 border-b border-white/20">
          <img 
            src={logoImage} 
            alt="ContraMind" 
            className="h-10 w-full object-contain filter brightness-0 invert"
          />
        </div>

        {/* New Contract Button */}
        <div className="p-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('عقد جديد', 'New Contract')}</span>
          </button>
        </div>

        {/* Contracts List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              {t('العقود الأخيرة', 'Recent Contracts')}
            </h3>
            {contracts.map(contract => (
              <button
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition-colors mb-1 truncate",
                  selectedContract?.id === contract.id && "bg-white/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm">{contract.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm truncate">{user?.fullName}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLocation('/settings/personal')}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocation('/help')}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => logoutMutation.mutate()}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center">
            {t(`${userTokens} رمز متبقي`, `${userTokens} tokens remaining`)}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className={cn(
          "lg:hidden fixed top-4 z-50 p-2 bg-[#202123] text-white rounded-md",
          isRTL ? "right-4" : "left-4"
        )}
      >
        {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedContract ? (
          <>
            {/* Contract Header */}
            <div className="bg-white border-b px-4 py-3">
              <h1 className="text-lg font-semibold text-gray-800">{selectedContract.name}</h1>
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
            <div className="bg-white border-t p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={t('اسأل عن هذا العقد...', 'Ask about this contract...')}
                      className="w-full px-4 py-2 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0C2836]"
                      rows={1}
                      maxLength={500}
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {inputValue.length}/500
                    </span>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || userTokens < 5}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-colors",
                      inputValue.trim() && userTokens >= 5
                        ? "bg-[#0C2836] text-white hover:bg-[#0C2836]/90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {userTokens < 5 && (
                  <p className="text-xs text-red-500 mt-1">
                    {t('رصيدك من الرموز غير كافٍ', 'Insufficient tokens')}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-3xl w-full px-4">
              <div className="text-center mb-8">
                <img 
                  src={logoImage} 
                  alt="ContraMind" 
                  className="h-16 mx-auto mb-4 opacity-80"
                />
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                  {t('قم برفع عقد للبدء', 'Upload a contract to start')}
                </h1>
                <p className="text-gray-600">
                  {t('تحليل ذكي للعقود باللغتين العربية والإنجليزية', 'Smart contract analysis in Arabic and English')}
                </p>
              </div>

              {/* Example Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {exampleCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => setIsUploadModalOpen(true)}
                    className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {card.icon}
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700">{card.title}</p>
                  </button>
                ))}
              </div>

              {/* Upload Button */}
              <div className="text-center">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0C2836] text-white rounded-lg hover:bg-[#0C2836]/90 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span>{t('رفع عقد', 'Upload Contract')}</span>
                </button>
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
    </div>
  );
}