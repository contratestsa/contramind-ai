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
        ar: 'كيف تقوم ContraMind بتحليل ومراجعة العقود؟',
        en: 'How does ContraMind analyze and review contracts?',
      },
      answer: {
        ar: 'تستخدم ContraMind تقنيات الذكاء الاصطناعي المتقدمة لتحليل العقود تلقائياً وتحديد النقاط الحرجة والمخاطر المحتملة. تقوم المنصة بمراجعة شاملة للبنود والشروط، وتقدم تقارير مفصلة حول المخاطر القانونية، وتقترح تعديلات لتحسين العقد وحماية مصالحك.',
        en: 'ContraMind uses advanced AI technologies to automatically analyze contracts and identify critical points and potential risks. The platform provides comprehensive review of terms and conditions, delivers detailed reports on legal risks, and suggests modifications to improve the contract and protect your interests.',
      },
    },
    {
      question: {
        ar: 'ما الأنظمة القانونية التي تغطيها المنصة؟',
        en: 'What legal systems does the platform cover?',
      },
      answer: {
        ar: 'نغطي جميع القوانين التجارية الأساسية بما في ذلك قانون الشركات، قانون العمل، قانون التجارة الإلكترونية، وأنظمة الاستثمار الأجنبي ، وجميع القوانين المتعلقه بالعقود.ونقوم بتحديث قاعدة البيانات باستمرار لتشمل جميع التعديلات الجديدة.',
        en: 'We cover all fundamental commercial laws including Companies Law, Labor Law, E-Commerce Law, Foreign Investment regulations, and all contract-related laws. We continuously update our database to include all new amendments.',
      },
    },
    {
      question: {
        ar: 'هل تدعم ContraMind مراجعة وتحليل العقود باللغة العربية بشكل احترافي؟',
        en: 'Does ContraMind support professional contract review and analysis in Arabic?',
      },
      answer: {
        ar: 'نعم بالتأكيد. ContraMind هي أول منصة ذكاء اصطناعي متخصصة في مراجعة وتحليل العقود باللغة العربية. نستخدم نماذج ذكاء اصطناعي مدربة خصيصاً على النصوص القانونية العربية والمصطلحات التجارية المحلية، مما يضمن فهماً دقيقاً للسياق القانوني والثقافي. المنصة تحلل العقود العربية بدقة عالية وتقدم تقارير شاملة بالعربية مع اقتراحات لتحسين البنود والشروط.',
        en: 'Absolutely. ContraMind is the first AI platform specialized in reviewing and analyzing contracts in Arabic. We use AI models specifically trained on Arabic legal texts and local commercial terminology, ensuring accurate understanding of legal and cultural context. The platform analyzes Arabic contracts with high precision and provides comprehensive reports in Arabic with suggestions for improving terms and conditions.',
      },
    },
    {
      question: {
        ar: 'ما هي خارطة طريق التوسع الإقليمي لـ ContraMind؟',
        en: 'What is ContraMind\'s regional expansion roadmap?',
      },
      answer: {
        ar: 'خطتنا التوسعية تشمل دولة الإمارات العربية المتحدة أولاً، تليها مصر والأردن والكويت. نهدف لتغطية 12 دولة في المنطقة خلال السنتين القادمتين.',
        en: 'Our expansion roadmap includes UAE first, followed by Egypt, Jordan, and Kuwait. We aim to cover 12 MENA countries within the next two years.',
      },
    },
    {
      question: {
        ar: 'هل معلوماتي وبياناتي آمنة ومحفوظة جيدًا لدى ContraMind؟',
        en: 'Are my information and data safe and well-protected with ContraMind?',
      },
      answer: {
        ar: 'نعم تماماً. جميع البيانات محفوظة في مراكز بيانات معتمدة داخل المملكة العربية السعودية، مع امتثال كامل لأنظمة حماية البيانات المحلية ومعايير الأمان العالمية،إذ نستخدم تقنيات التشفير المتقدمة أثناء نقل البيانات وتخزينها، ونلتزم بإطار عمل حماية البيانات الشخصية العالمي (GDPR) والقوانين المحلية في المملكة العربية السعودية( PDPL). كما نجري اختبارات أمنية دورية لضمان بيئة موثوقة ومحكمة.',
        en: 'Absolutely. All data is stored in certified data centers within Saudi Arabia, with full compliance to local data protection regulations and international security standards. We use advanced encryption technologies during data transmission and storage, and comply with the Global Personal Data Protection Framework (GDPR) and local laws in Saudi Arabia (PDPL). We also conduct regular security testing to ensure a trusted and secure environment.',
      },
    },
    {
      question: {
        ar: 'هل يمكن دمج ContraMind بسهولة في أنظمة العمل الحالية لدي؟',
        en: 'Can ContraMind be easily integrated into my existing work systems?',
      },
      answer: {
        ar: 'نعم، تم تصميم ContraMind للتكامل السلس مع أنظمة العمل المختلفة. نوفر واجهات برمجة تطبيقات (APIs) شاملة وموصلات جاهزة للأنظمة الشائعة مثل Microsoft Office، Google Workspace، وأنظمة إدارة الوثائق المختلفة. كما نقدم دعماً فنياً متخصصاً لضمان عملية دمج سلسة دون تعطيل سير العمل الحالي.',
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
                className="w-full text-left p-6 hover:bg-gray-600/20 transition-colors duration-200 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-arabic-heading text-white mb-2 leading-relaxed">
                    {item.question.ar}
                  </h3>
                  <h4 className="text-base lg:text-lg text-gray-300 font-medium leading-relaxed">
                    {item.question.en}
                  </h4>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center transition-all duration-200 ${
                      openIndex === index ? 'border-blue-400 bg-blue-400/20' : ''
                    }`}
                  >
                    <span
                      className={`text-gray-400 font-bold transition-transform duration-200 ${
                        openIndex === index ? 'rotate-45 text-blue-400' : ''
                      }`}
                    >
                      +
                    </span>
                  </div>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 border-t border-gray-600/50">
                  <div className="pt-4 space-y-4">
                    <p className="text-gray-200 font-arabic-body leading-relaxed text-base lg:text-lg">
                      {item.answer.ar}
                    </p>
                    <p className="text-gray-300 leading-relaxed text-sm lg:text-base border-t border-gray-600/30 pt-4">
                      {item.answer.en}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}