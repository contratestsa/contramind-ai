import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LanguageManager } from "@/components/SimpleLanguage";
import { Rocket, FileText, Users } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const t = LanguageManager.t;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t(
              `مرحباً ${userName} في ContraMind!`,
              `Welcome to ContraMind, ${userName}!`
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-4">
            {t(
              'نحن متحمسون لوجودك معنا. دعنا نساعدك في البدء بإدارة عقودك بكفاءة.',
              'We\'re thrilled to have you here. Let\'s help you get started with managing your contracts efficiently.'
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="text-center p-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('أنشئ عقدك الأول', 'Create Your First Contract')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(
                'ابدأ بإنشاء وإدارة عقودك القانونية بسهولة',
                'Start creating and managing your legal contracts easily'
              )}
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Users className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('ادعُ فريقك', 'Invite Your Team')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(
                'تعاون مع فريقك لإدارة العقود بشكل أفضل',
                'Collaborate with your team for better contract management'
              )}
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('استكشف الميزات', 'Explore Features')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(
                'اكتشف جميع الأدوات المتقدمة لتحليل العقود',
                'Discover all the advanced tools for contract analysis'
              )}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            {t('فلنبدأ!', 'Let\'s Get Started!')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}