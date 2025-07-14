import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { 
  User, 
  Users, 
  Settings, 
  Palette, 
  HelpCircle, 
  LogOut,
  Building,
  Megaphone,
  FileText,
  Download,
  Command,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface ProfileDropdownProps {
  user: {
    id: number;
    email: string;
    fullName: string;
    profilePicture?: string;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRTL = language === 'ar';

  // Get user initials
  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  // Help submenu items
  const helpMenuItems = [
    {
      icon: HelpCircle,
      label: t('مركز المساعدة', 'Help Center'),
      path: '/help',
      ariaLabel: 'Help Center'
    },
    {
      icon: Megaphone,
      label: t('ملاحظات الإصدار', 'Release Notes'),
      path: '/release-notes',
      ariaLabel: 'Release Notes'
    },
    {
      icon: FileText,
      label: t('الشروط والسياسات', 'Terms & Policies'),
      path: '/terms',
      ariaLabel: 'Terms & Policies'
    },
    {
      icon: Download,
      label: t('تطبيق سطح المكتب', 'Desktop App'),
      path: '/desktop-app',
      ariaLabel: 'Desktop App'
    },
    {
      icon: Command,
      label: t('اختصارات لوحة المفاتيح', 'Keyboard Shortcuts'),
      path: '/keyboard-shortcuts',
      ariaLabel: 'Keyboard Shortcuts'
    }
  ];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        helpMenuRef.current &&
        !helpMenuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsHelpOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsHelpOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menuItems = [
    {
      type: 'header' as const,
      content: user.email
    },
    {
      type: 'item' as const,
      icon: Users,
      label: t('إضافة أعضاء الفريق', 'Add teammates'),
      onClick: () => {
        setIsOpen(false);
        toast({
          title: t('قريباً', 'Coming Soon'),
          description: t('هذه الميزة قيد التطوير', 'This feature is under development')
        });
      }
    },
    {
      type: 'item' as const,
      icon: Building,
      label: t('إعدادات مساحة العمل', 'Workspace settings'),
      onClick: () => {
        setIsOpen(false);
        setLocation('/settings/organization');
      }
    },
    {
      type: 'item' as const,
      icon: Palette,
      label: t('تخصيص التطبيق', 'Customize App'),
      onClick: () => {
        setIsOpen(false);
        toast({
          title: t('قريباً', 'Coming Soon'),
          description: t('هذه الميزة قيد التطوير', 'This feature is under development')
        });
      }
    },
    {
      type: 'item' as const,
      icon: Settings,
      label: t('الإعدادات', 'Settings'),
      onClick: () => {
        setIsOpen(false);
        setLocation('/settings/personal');
      }
    },
    {
      type: 'divider' as const
    },
    {
      type: 'item' as const,
      icon: HelpCircle,
      label: t('المساعدة', 'Help'),
      hasSubmenu: true,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsHelpOpen(!isHelpOpen);
      }
    },
    {
      type: 'item' as const,
      icon: LogOut,
      label: t('تسجيل الخروج', 'Log out'),
      onClick: () => {
        setIsOpen(false);
        logoutMutation.mutate();
      }
    }
  ];

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#B7DEE8] focus:ring-offset-2 focus:ring-offset-[#343541]"
      >
        {user.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt={user.fullName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-white">
            {getInitials(user.fullName).toUpperCase()}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg overflow-hidden z-50",
              isRTL ? "left-0" : "right-0"
            )}
            role="menu"
            aria-orientation="vertical"
          >
            {menuItems.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <div
                    key={index}
                    className="px-5 py-3 text-sm text-gray-500 border-b border-gray-100"
                  >
                    {item.content}
                  </div>
                );
              }

              if (item.type === 'divider') {
                return <div key={index} className="h-px bg-gray-100 my-1" />;
              }

              const Icon = item.icon;
              return (
                <div key={index}>
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left relative",
                      isRTL && "text-right flex-row-reverse"
                    )}
                    role="menuitem"
                    aria-haspopup={item.hasSubmenu ? "menu" : undefined}
                    aria-expanded={item.hasSubmenu ? isHelpOpen : undefined}
                    aria-label={item.hasSubmenu ? t('قائمة المساعدة', 'Help menu') : undefined}
                  >
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 flex-1">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronRight 
                        className={cn(
                          "w-4 h-4 text-gray-400 transition-transform",
                          isHelpOpen && "rotate-90",
                          isRTL && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Help Submenu */}
                  {item.hasSubmenu && isHelpOpen && (
                    <motion.div
                      ref={helpMenuRef}
                      initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? 10 : -10 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "absolute top-0 w-[240px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50",
                        isRTL ? "right-full mr-2" : "left-full ml-2"
                      )}
                      role="menu"
                    >
                      <div className="py-2">
                        {helpMenuItems.map((helpItem, helpIndex) => {
                          const HelpIcon = helpItem.icon;
                          return (
                            <button
                              key={helpIndex}
                              onClick={() => {
                                setIsOpen(false);
                                setIsHelpOpen(false);
                                setLocation(helpItem.path);
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left",
                                isRTL && "text-right flex-row-reverse",
                                helpIndex > 0 && "mt-2"
                              )}
                              role="menuitem"
                              aria-label={helpItem.ariaLabel}
                            >
                              <HelpIcon className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-900">{helpItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}