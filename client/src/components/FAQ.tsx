import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'كيف تُسهل ContraMind مهمة مراجعة وتحليل العقود؟',
      answer: 'تستخدم ContraMind تقنيات الذكاء الاصطناعي المتقدمة لمراجعة العقود تلقائياً، تحديد النقاط الحرجة، تسليط الضوء على المخاطر المحتملة، وتقديم توصيات لتحسين شروط العقد. هذا يوفر الوقت ويقلل من الأخطاء البشرية.'
    },
    {
      question: 'هل تدعم المنصة اللغة العربية بشكل كامل؟',
      answer: 'نعم، ContraMind هي أول منصة قانونية تدعم اللغة العربية بشكل كامل. يمكنها معالجة وتحليل العقود المكتوبة بالعربية، وتقديم التوصيات والتقارير باللغة العربية أيضاً.'
    },
    {
      question: 'ما هي أنواع العقود التي تدعمها المنصة؟',
      answer: 'تدعم ContraMind جميع أنواع العقود التجارية والقانونية، بما في ذلك عقود البيع والشراء، عقود العمل، عقود الشراكة، عقود الخدمات، وعقود التوريد. كما تتكيف مع القوانين المحلية لدول الخليج والشرق الأوسط.'
    },
    {
      question: 'كيف تضمن المنصة أمان وسرية البيانات؟',
      answer: 'نحن نلتزم بأعلى معايير الأمان والخصوصية. جميع البيانات مُشفرة ومحمية بتقنيات أمان متقدمة. نحن متوافقون مع معايير الأمان الدولية ولا نشارك بياناتك مع أي طرف ثالث.'
    },
    {
      question: 'متى سيتم إطلاق المنصة؟',
      answer: 'نخطط لإطلاق النسخة التجريبية في الربع الأول من 2024. المنضمون لقائمة الانتظار سيحصلون على وصول مبكر للمنصة وعروض خاصة للاشتراك.'
    },
    {
      question: 'هل يمكن للشركات الكبيرة استخدام المنصة؟',
      answer: 'بالطبع! ContraMind مصممة للشركات من جميع الأحجام. نوفر حلول مخصصة للشركات الكبيرة تشمل إمكانيات إدارة متقدمة، تكامل مع الأنظمة الحالية، ودعم فني مخصص.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-xl text-gray-600">
            إجابات على أهم الأسئلة حول منصة ContraMind.ai
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-right p-6 bg-grey/10 hover:bg-grey/20 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-navy">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    className="text-navy text-2xl font-bold"
                  >
                    +
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-white border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}