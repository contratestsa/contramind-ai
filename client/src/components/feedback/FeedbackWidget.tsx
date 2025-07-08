import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, X } from "lucide-react";
import { LanguageManager } from "../SimpleLanguage";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function FeedbackWidget() {
  const t = LanguageManager.t;
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackText: string) => {
      return apiRequest('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: feedbackText }),
      });
    },
    onSuccess: () => {
      toast({
        title: t('شكراً لملاحظاتك!', 'Thank you for your feedback!'),
        description: t(
          'لقد تلقينا ملاحظاتك وسنعمل على تحسين المنصة.',
          'We\'ve received your feedback and will work on improving the platform.'
        ),
      });
      setFeedback("");
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: t('حدث خطأ', 'Error occurred'),
        description: t(
          'فشل إرسال الملاحظات. يرجى المحاولة مرة أخرى.',
          'Failed to send feedback. Please try again.'
        ),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (feedback.trim()) {
      submitFeedbackMutation.mutate(feedback);
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <>
      {/* Feedback Button */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-lg hover:shadow-xl transition-all duration-200 bg-[#0C2836] hover:bg-[#1a3a4a]"
          size="lg"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          {t('ملاحظات', 'Feedback')}
        </Button>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          {t('إخفاء', 'Hide')}
        </button>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t('شاركنا ملاحظاتك', 'Share Your Feedback')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'ساعدنا في تحسين ContraMind. أخبرنا عن تجربتك أو اقترح ميزات جديدة.',
                'Help us improve ContraMind. Tell us about your experience or suggest new features.'
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">
                {t('ملاحظاتك', 'Your Feedback')}
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t(
                  'أخبرنا عما يمكننا تحسينه...',
                  'Tell us what we can improve...'
                )}
                className="min-h-[150px] resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!feedback.trim() || submitFeedbackMutation.isPending}
            >
              {submitFeedbackMutation.isPending 
                ? t('جاري الإرسال...', 'Sending...') 
                : t('إرسال الملاحظات', 'Send Feedback')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}