import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LanguageManager } from "@/components/SimpleLanguage";
import { X, CheckCircle2 } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  labelAr: string;
  completed: boolean;
}

interface GettingStartedChecklistProps {
  onDismiss: () => void;
}

export function GettingStartedChecklist({ onDismiss }: GettingStartedChecklistProps) {
  const t = LanguageManager.t;
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'create-contract',
      label: 'Create Your First Contract',
      labelAr: 'أنشئ عقدك الأول',
      completed: false,
    },
    {
      id: 'invite-team',
      label: 'Invite a Team Member',
      labelAr: 'ادعُ عضو فريق',
      completed: false,
    },
    {
      id: 'explore-features',
      label: 'Explore AI Analysis Features',
      labelAr: 'استكشف ميزات التحليل بالذكاء الاصطناعي',
      completed: false,
    },
  ]);

  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  useEffect(() => {
    // Load saved checklist state from localStorage
    const savedState = localStorage.getItem('onboarding-checklist');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            completed: parsed[item.id] || false
          }))
        );
      } catch (e) {
        console.error('Failed to parse checklist state:', e);
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      
      // Save to localStorage
      const state = newItems.reduce((acc, item) => ({
        ...acc,
        [item.id]: item.completed
      }), {});
      localStorage.setItem('onboarding-checklist', JSON.stringify(state));
      
      return newItems;
    });
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg animate-in slide-in-from-bottom">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {t('البدء', 'Getting Started')}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            onClick={() => toggleItem(item.id)}
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <label className="text-sm font-medium leading-none cursor-pointer flex-1">
              {t(item.labelAr, item.label)}
            </label>
            {item.completed && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
          </div>
        ))}
        
        {completedCount === items.length && (
          <div className="text-center pt-3 border-t">
            <p className="text-sm text-green-600 font-medium">
              {t('🎉 أحسنت! لقد أكملت جميع الخطوات', '🎉 Great job! You\'ve completed all steps')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}