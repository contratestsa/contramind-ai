import { useState } from "react";
import { X, Star } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FeedbackModalProps {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [message, setMessage] = useState("");
  const isRTL = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء تقييم تجربتك', 'Please rate your experience'),
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء كتابة رسالة', 'Please write a message'),
        variant: "destructive"
      });
      return;
    }

    // Submit feedback
    toast({
      title: t('شكراً لك!', 'Thank you!'),
      description: t('تم إرسال ملاحظاتك بنجاح', 'Your feedback has been sent successfully')
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] max-w-[90vw] p-6">
        {/* Header */}
        <div className={cn("flex items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
          <h2 className="text-xl font-semibold">{t('إرسال ملاحظات', 'Send Feedback')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('قيم تجربتك', 'Rate your experience')}
            </label>
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={cn(
                      "w-8 h-8",
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Type */}
          <div className="mb-6">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('نوع الملاحظة', 'Feedback Type')}
            </label>
            <div className="space-y-2">
              <label className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <input
                  type="radio"
                  name="feedbackType"
                  value="bug"
                  checked={feedbackType === 'bug'}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="text-blue-600"
                />
                <span>{t('خطأ', 'Bug')}</span>
              </label>
              <label className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <input
                  type="radio"
                  name="feedbackType"
                  value="feature"
                  checked={feedbackType === 'feature'}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="text-blue-600"
                />
                <span>{t('ميزة', 'Feature')}</span>
              </label>
              <label className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <input
                  type="radio"
                  name="feedbackType"
                  value="general"
                  checked={feedbackType === 'general'}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="text-blue-600"
                />
                <span>{t('عام', 'General')}</span>
              </label>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
              {t('رسالتك', 'Your Message')}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isRTL && "text-right"
              )}
              placeholder={t('اكتب ملاحظاتك هنا...', 'Write your feedback here...')}
            />
          </div>

          {/* Actions */}
          <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('إرسال', 'Submit')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('إلغاء', 'Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}