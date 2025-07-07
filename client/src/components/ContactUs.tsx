import React from 'react';
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

type ContactFormData = z.infer<typeof insertContactSchema>;

interface ContactUsProps {
  children?: React.ReactNode;
}

export default function ContactUs({ children }: ContactUsProps) {
  const t = LanguageManager.t;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

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
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white rounded-3xl p-8 shadow-2xl border-0" dir={LanguageManager.getDir()}>
        <DialogHeader className="text-center mb-8">
          <DialogTitle className="text-2xl font-bold text-contraMind-navy font-arabic-bold">
            {t('اتصل بنا', 'Contact Us')}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-contraMind-navy font-semibold text-right block mb-2 font-arabic">
                    {t('الاسم', 'Name')}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('$#', 'Enter your name')} 
                      className="w-full h-12 px-4 bg-contraMind-sky-50 border-2 border-contraMind-navy rounded-2xl text-right placeholder-contraMind-grey-500 focus:border-contraMind-navy focus:ring-0 font-arabic"
                      dir="rtl"
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
                  <FormLabel className="text-contraMind-navy font-semibold text-right block mb-2 font-arabic">
                    {t('البريد الإلكتروني', 'Email')}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder={t('البريد الالكتروني', 'Email Address')} 
                      className="w-full h-12 px-4 bg-contraMind-sky-50 border-2 border-contraMind-grey-300 rounded-2xl text-right placeholder-contraMind-grey-500 focus:border-contraMind-navy focus:ring-0 font-arabic"
                      dir="rtl"
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
                  <FormLabel className="text-contraMind-navy font-semibold text-right block mb-2 font-arabic">
                    {t('الموضوع', 'Subject')}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('موضوع الرسالة', 'Message Subject')} 
                      className="w-full h-12 px-4 bg-contraMind-sky-50 border-2 border-contraMind-grey-300 rounded-2xl text-right placeholder-contraMind-grey-500 focus:border-contraMind-navy focus:ring-0 font-arabic"
                      dir="rtl"
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
                  <FormLabel className="text-contraMind-navy font-semibold text-right block mb-2 font-arabic">
                    {t('الرسالة', 'Message')}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')} 
                      className="w-full h-32 p-4 bg-contraMind-sky-50 border-2 border-contraMind-grey-300 rounded-2xl text-right placeholder-contraMind-grey-500 focus:border-contraMind-navy focus:ring-0 resize-none font-arabic"
                      dir="rtl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="flex-1 h-12 bg-contraMind-navy hover:bg-contraMind-navy-800 text-white font-bold rounded-2xl font-arabic transition-all duration-200"
              >
                {mutation.isPending ? t('جارٍ الإرسال...', 'Sending...') : t('إرسال', 'Send')}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 h-12 border-2 border-contraMind-navy text-contraMind-navy hover:bg-contraMind-navy hover:text-white font-bold rounded-2xl font-arabic transition-all duration-200"
              >
                {t('إلغاء', 'Cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}