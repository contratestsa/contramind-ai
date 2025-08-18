
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertContactSchema } from '@shared/schema';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { LanguageManager } from '@/components/SimpleLanguage';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';
import { useState, type ReactNode } from 'react';

type ContactFormData = z.infer<typeof insertContactSchema>;

interface ContactUsProps {
  children?: ReactNode;
}

export default function ContactUs({ children }: ContactUsProps) {
  const t = LanguageManager.t;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم الإرسال بنجاح', 'Message Sent Successfully'),
        description: t(
          'شكراً لتواصلكم معنا. سنقوم بالرد عليكم خلال 24 ساعة.',
          'Thank you for contacting us. We will reply within 24 hours.'
        ),
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: t('خطأ في الإرسال', 'Sending Error'),
        description: t(
          'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
          'An error occurred while sending the message. Please try again.'
        ),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {t('اتصل بنا', 'Contact Us')}
            </span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[425px] text-[#1a3a4a] bg-[#f5f8fa]">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-bold text-center">
            {t('اتصل بنا', 'Contact Us')}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('الاسم', 'Name')} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('الاسم الكامل', 'Full Name')} 
                      className="bg-[#ebf2f5]"
                      required
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('البريد الإلكتروني', 'Email')} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder={t('البريد الإلكتروني', 'Email Address')} 
                      className="bg-[#ebf2f5]"
                      required
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('الموضوع', 'Subject')} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('موضوع الرسالة', 'Message Subject')} 
                      className="bg-[#ebf2f5]"
                      required
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('الرسالة', 'Message')} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')} 
                      className="min-h-[100px] bg-[#ebf2f5]"
                      required
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between gap-4 pt-8">
              <button
                type="button"
                className="flex-1 h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] focus:outline-none focus:ring-4 focus:ring-[#B7DEE8]"
                onClick={() => setOpen(false)}
              >
                {t('إلغاء', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] focus:outline-none focus:ring-4 focus:ring-[#B7DEE8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 
                  t('جاري الإرسال...', 'Sending...') : 
                  t('إرسال', 'Send')
                }
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}