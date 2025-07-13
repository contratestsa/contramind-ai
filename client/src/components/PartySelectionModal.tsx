import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building, Handshake, Scale } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface PartySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (partyType: string) => void;
}

interface PartyCard {
  id: string;
  icon: React.ReactNode;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  examples: { ar: string; en: string };
}

export default function PartySelectionModal({ isOpen, onClose, onSelect }: PartySelectionModalProps) {
  const { t, language } = useLanguage();
  const [location, setLocation] = useLocation();
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const isRTL = language === 'ar';

  // Party selection cards
  const partyCards: PartyCard[] = [
    {
      id: 'buyer',
      icon: <Building className="w-12 h-12 text-[#0C2836]" />,
      title: { ar: "متلقي الخدمة", en: "Service Recipient" },
      description: { ar: "أنا أشتري خدمات أو منتجات", en: "I am purchasing services or products" },
      examples: { ar: "عميل، مشتري، زبون", en: "Client, Buyer, Customer" }
    },
    {
      id: 'vendor',
      icon: <Handshake className="w-12 h-12 text-[#0C2836]" />,
      title: { ar: "مقدم الخدمة", en: "Service Provider" },
      description: { ar: "أنا أقدم خدمات أو منتجات", en: "I am providing services or products" },
      examples: { ar: "بائع، مورد، مقاول", en: "Vendor, Supplier, Contractor" }
    },
    {
      id: 'neutral',
      icon: <Scale className="w-12 h-12 text-[#0C2836]" />,
      title: { ar: "تحليل عام", en: "General Analysis" },
      description: { ar: "تحليل محايد بدون تفضيل طرف", en: "Neutral analysis without party preference" },
      examples: { ar: "مراجعة قانونية، العناية الواجبة", en: "Legal review, Due diligence" }
    }
  ];

  const handleContinue = () => {
    if (!selectedParty) return;
    
    // Call the onSelect callback if provided
    if (onSelect) {
      onSelect(selectedParty);
    }
    
    // Close modal
    onClose();
  };

  const handleClose = () => {
    // Reset selection when closing
    setSelectedParty(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[900px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className={cn(
            "text-2xl font-semibold text-center",
            isRTL ? "text-right" : "text-left"
          )}>
            {t('أي طرف تمثل في هذا العقد؟', 'Which party do you represent in this contract?')}
          </DialogTitle>
          <p className="text-base text-gray-600 text-center mt-2">
            {t('هذا يساعدنا في تقديم تحليل أكثر صلة', 'This helps us provide more relevant analysis')}
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {/* Party Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {partyCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedParty(card.id)}
                className={cn(
                  "p-6 bg-white rounded-lg transition-all cursor-pointer h-[200px]",
                  "hover:shadow-lg",
                  selectedParty === card.id
                    ? "border-2 border-[#0C2836]"
                    : "border-2 border-[#E6E6E6]"
                )}
              >
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className="mb-3">
                    {card.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-lg text-[#0C2836] mb-2">
                    {t(card.title.ar, card.title.en)}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-2">
                    {t(card.description.ar, card.description.en)}
                  </p>
                  
                  {/* Examples */}
                  <p className="text-xs text-gray-500 mt-auto">
                    {t(card.examples.ar, card.examples.en)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedParty}
              className={cn(
                "w-[200px] px-6 py-3 rounded-lg font-medium transition-all",
                selectedParty
                  ? "bg-[#0C2836] text-white hover:bg-[#0A1F2C]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              {t('متابعة إلى التحليل', 'Continue to Analysis')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}