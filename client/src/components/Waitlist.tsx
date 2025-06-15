import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';

interface WaitlistData {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
}

export default function Waitlist() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<WaitlistData>({
    fullName: '',
    email: '',
    company: '',
    jobTitle: ''
  });

  // Fetch waitlist count
  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ['/api/waitlist/count'],
    refetchInterval: 30000,
  });

  const mutation = useMutation({
    mutationFn: async (data: WaitlistData) => {
      const response = await apiRequest('POST', '/api/waitlist', data);
      return response;
    },
    onSuccess: () => {
      setFormData({ fullName: '', email: '', company: '', jobTitle: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (field: keyof WaitlistData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <section id="waitlist" className="py-20 bg-grey">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
            انضم لقائمة الانتظار
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            كن من أوائل المستخدمين واحصل على وصول مبكر لمنصة ContraMind.ai
          </p>
          <div className="inline-flex items-center bg-navy text-white px-4 py-2 rounded-full">
            <span className="font-bold">
              {(countData as any)?.count || 0} شخص في قائمة الانتظار
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-navy font-semibold">
                  الاسم الكامل *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  className="mt-1"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-navy font-semibold">
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="mt-1"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-navy font-semibold">
                  الشركة أو المؤسسة *
                </Label>
                <Input
                  id="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={handleInputChange('company')}
                  className="mt-1"
                  placeholder="اسم الشركة"
                />
              </div>

              <div>
                <Label htmlFor="jobTitle" className="text-navy font-semibold">
                  المسمى الوظيفي *
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={handleInputChange('jobTitle')}
                  className="mt-1"
                  placeholder="مثل: محامي، مستشار قانوني، مدير عقود"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3 text-lg"
            >
              {mutation.isPending ? 'جاري الإرسال...' : 'انضم لقائمة الانتظار'}
            </Button>
          </form>

          {mutation.isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <p className="text-green-800 font-semibold">
                شكراً لك! تم تسجيلك بنجاح في قائمة الانتظار
              </p>
            </motion.div>
          )}

          {mutation.isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center"
            >
              <p className="text-red-800 font-semibold">
                حدث خطأ، يرجى المحاولة مرة أخرى
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}