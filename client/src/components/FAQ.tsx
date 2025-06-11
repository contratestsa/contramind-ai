import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface FAQItem {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export default function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: {
        ar: 'أي القوانين السعودية مشمولة؟',
        en: 'Which Saudi laws are covered?',
      },
      answer: {
        ar: 'نغطي جميع القوانين التجارية الأساسية بما في ذلك قانون الشركات، قانون العمل، قانون التجارة الإلكترونية، وأنظمة الاستثمار الأجنبي. نحدث قاعدة البيانات باستمرار لتشمل التعديلات الجديدة.',
        en: 'We cover all fundamental commercial laws including Companies Law, Labor Law, E-Commerce Law, and Foreign Investment regulations. Our database is continuously updated with new amendments.',
      },
    },
    {
      question: {
        ar: 'هل يدعم التفاوض باللغتين؟',
        en: 'Does it support bilingual negotiations?',
      },
      answer: {
        ar: 'نعم، منصتنا تدعم التفاوض بالعربية والإنجليزية بسلاسة. يمكن للأطراف التفاوض بأي لغة مع ترجمة فورية وحفظ لسياق المعاني القانونية الدقيقة.',
        en: 'Yes, our platform supports seamless Arabic-English negotiations. Parties can negotiate in either language with instant translation while preserving precise legal context and meaning.',
      },
    },
    {
      question: {
        ar: 'ما هي الدول التالية في المنطقة؟',
        en: 'Which MENA jurisdictions next?',
      },
      answer: {
        ar: 'خطتنا التوسعية تشمل دولة الإمارات العربية المتحدة أولاً، تليها مصر والأردن والكويت. نهدف لتغطية 12 دولة في المنطقة خلال السنتين القادمتين.',
        en: 'Our expansion roadmap includes UAE first, followed by Egypt, Jordan, and Kuwait. We aim to cover 12 MENA countries within the next two years.',
      },
    },
    {
      question: {
        ar: 'هل بياناتي ستبقى في السعودية؟',
        en: 'Will my data stay in Saudi?',
      },
      answer: {
        ar: 'نعم تماماً. جميع البيانات محفوظة في مراكز بيانات معتمدة داخل المملكة العربية السعودية، مع امتثال كامل لأنظمة حماية البيانات المحلية ومعايير الأمان العالمية.',
        en: 'Absolutely. All data is stored in certified data centers within Saudi Arabia, with full compliance to local data protection regulations and international security standards.',
      },
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-32 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-space font-bold text-white mb-6">
            {t('أسئلة شائعة', 'Frequently Asked Questions')}
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            {t('إجابات سريعة على الأسئلة الأكثر شيوعاً', 'Quick answers to common questions')}
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700/50 border border-gray-600 rounded-2xl overflow-hidden shadow-custom hover:shadow-custom-hover transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-600/30 transition-colors"
              >
                <h3 className={`text-lg font-semibold text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t(item.question.ar, item.question.en)}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <i className={`fas ${openIndex === index ? 'fa-minus' : 'fa-plus'} text-white`} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className={`text-gray-300 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t(item.answer.ar, item.answer.en)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
