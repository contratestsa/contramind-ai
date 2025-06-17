import { useState } from 'react';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';

interface FAQItem {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export default function FAQ() {
  const { t, language } = useSimpleLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: {
        ar: 'ما هو ContraMind.ai؟',
        en: 'What is ContraMind.ai?'
      },
      answer: {
        ar: 'ContraMind.ai هي أول منصة ذكاء اصطناعي قانونية مصممة خصيصاً لإدارة دورة حياة العقود في منطقة الشرق الأوسط وشمال أفريقيا مع دعم كامل للغة العربية.',
        en: 'ContraMind.ai is the first legal AI platform specifically designed for contract lifecycle management in the MENA region with full Arabic language support.'
      }
    },
    {
      question: {
        ar: 'كيف يمكن للذكاء الاصطناعي مساعدتي في مراجعة العقود؟',
        en: 'How can AI help me with contract review?'
      },
      answer: {
        ar: 'يستطيع الذكاء الاصطناعي تحليل العقود بسرعة للكشف عن المخاطر، التناقضات، والفرص المفقودة، مما يقلل وقت المراجعة من أسابيع إلى ساعات.',
        en: 'AI can quickly analyze contracts to identify risks, inconsistencies, and missed opportunities, reducing review time from weeks to hours.'
      }
    },
    {
      question: {
        ar: 'هل المنصة تدعم القوانين المحلية؟',
        en: 'Does the platform support local regulations?'
      },
      answer: {
        ar: 'نعم، تم تصميم ContraMind.ai خصيصاً لتتوافق مع القوانين والأنظمة المحلية في منطقة الشرق الأوسط وشمال أفريقيا.',
        en: 'Yes, ContraMind.ai is specifically designed to comply with local laws and regulations in the MENA region.'
      }
    },
    {
      question: {
        ar: 'متى سيتم إطلاق المنصة؟',
        en: 'When will the platform be launched?'
      },
      answer: {
        ar: 'نحن في المراحل النهائية من التطوير. انضم إلى قائمة الانتظار للحصول على وصول مبكر وثلاثة أشهر مجانية.',
        en: 'We are in the final stages of development. Join our waitlist for early access and three months free.'
      }
    },
    {
      question: {
        ar: 'كيف يتم ضمان أمان البيانات؟',
        en: 'How is data security ensured?'
      },
      answer: {
        ar: 'نستخدم أحدث معايير الأمان على مستوى المؤسسات مع التشفير الكامل وامتثال صارم لمعايير حماية البيانات.',
        en: 'We use enterprise-grade security standards with full encryption and strict compliance with data protection standards.'
      }
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-arabic-heading-bold text-white mb-6">
            {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
          </h2>
          <p className="text-xl text-gray-300 font-arabic-body">
            {t('إجابات على أهم الأسئلة حول منصتنا', 'Answers to the most common questions about our platform')}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-sky/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
              >
                <h3 className="text-lg font-arabic-heading-bold text-white pr-4">
                  {t(item.question.ar, item.question.en)}
                </h3>
                <div className="flex-shrink-0">
                  <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'} text-sky transition-transform duration-200`} />
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 font-arabic-body leading-relaxed">
                    {t(item.answer.ar, item.answer.en)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">
            {t('لديك سؤال آخر؟', 'Have another question?')}
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-sky hover:text-sky/80 font-medium transition-colors duration-200"
          >
            <span>{t('تواصل معنا', 'Contact Us')}</span>
            <i className="fas fa-arrow-left ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}