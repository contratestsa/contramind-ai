import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface FAQItem {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: {
        ar: 'ما هو ContraMind وكيف يعمل؟',
        en: 'What is ContraMind and how does it work?',
      },
      answer: {
        ar: 'ContraMind هو منصة ذكية تستخدم تقنيات الذكاء الاصطناعي المتقدمة لتحليل ومراجعة العقود القانونية. يقوم النظام بقراءة العقود، تحديد المخاطر المحتملة، اقتراح التعديلات، وضمان الامتثال للقوانين المحلية والدولية. كل ذلك باللغة العربية مع دعم كامل للمصطلحات القانونية العربية.',
        en: 'ContraMind is an intelligent platform that uses advanced AI technology to analyze and review legal contracts. The system reads contracts, identifies potential risks, suggests modifications, and ensures compliance with local and international laws. All in Arabic with full support for Arabic legal terminology.',
      },
    },
    {
      question: {
        ar: 'هل يدعم النظام اللغة العربية بالكامل؟',
        en: 'Does the system fully support Arabic language?',
      },
      answer: {
        ar: 'نعم، تم تصميم ContraMind خصيصاً لدعم اللغة العربية بشكل كامل. يمكن للنظام قراءة وتحليل العقود المكتوبة باللغة العربية، وتقديم التوصيات والملاحظات بالعربية، مع فهم عميق للمصطلحات القانونية العربية والسياق الثقافي للمنطقة.',
        en: 'Yes, ContraMind is specifically designed to fully support Arabic language. The system can read and analyze contracts written in Arabic, provide recommendations and notes in Arabic, with deep understanding of Arabic legal terminology and regional cultural context.',
      },
    },
    {
      question: {
        ar: 'كيف يمكنني دمج ContraMind مع أنظمة العمل الحالية؟',
        en: 'How can I integrate ContraMind with existing work systems?',
      },
      answer: {
        ar: 'نعم، تم تصميم ContraMind للتكامل السلس مع مختلف أنظمة العمل. نقدم واجهات برمجة تطبيقات (APIs) شاملة وموصلات جاهزة للأنظمة الشائعة مثل Microsoft Office، Google Workspace، وأنظمة إدارة الوثائق المختلفة. كما نقدم دعماً فنياً متخصصاً لضمان عملية دمج سلسة دون تعطيل سير العمل الحالي.',
        en: 'Yes, ContraMind is designed for seamless integration with various work systems. We provide comprehensive APIs and ready-made connectors for popular systems like Microsoft Office, Google Workspace, and various document management systems. We also offer specialized technical support to ensure smooth integration without disrupting your current workflow.',
      },
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-6">
            {t('أسئلة شائعة', 'Frequently Asked Questions')}
          </h2>
          <p className="text-xl text-gray-300 font-arabic-body">
            {t('إجابات سريعة على الأسئلة الأكثر شيوعاً', 'Quick answers to common questions')}
          </p>
        </div>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-700/50 border border-gray-600 rounded-2xl overflow-hidden shadow-custom hover:shadow-custom-hover transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-600/30 transition-colors"
              >
                <h3 className="text-lg font-arabic-heading-medium text-white pr-4">
                  {t(item.question.ar, item.question.en)}
                </h3>
                <div className="text-blue-400 text-2xl font-bold ml-4 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-gray-300 font-arabic-body leading-relaxed">
                  {t(item.answer.ar, item.answer.en)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}