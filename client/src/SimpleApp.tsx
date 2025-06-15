import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { motion } from 'framer-motion';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (ar: string, en: string) => {
    return language === 'ar' ? ar : en;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.documentElement.classList.add('rtl-transition');
    
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('rtl-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed w-full top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-grey/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-sky rounded-lg"></div>
            <span className="text-xl font-arabic-heading-bold text-white">
              ContraMind
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <a href="#product" className="text-gray-300 hover:text-white transition-colors">
              {t('المنتج', 'Product')}
            </a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              {t('المميزات', 'Features')}
            </a>
            <a href="#waitlist" className="text-gray-300 hover:text-white transition-colors">
              {t('قائمة الانتظار', 'Waitlist')}
            </a>
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
            >
              {language === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useLanguage();

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-grey/10" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl lg:text-6xl font-arabic-heading-bold leading-loose pt-[12px] pb-[12px] pl-[-3px] pr-[-3px] ml-[-22px] mr-[-22px] mt-[19px] mb-[19px]"
          >
            <span className="gradient-text ml-[0px] mr-[0px] pl-[0px] pr-[0px] pt-[75px] pb-[75px] mt-[28px] mb-[28px]">
              {t(' أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي', 'The First Legal AI Platform for Contract Management and Review,Supporting Arabic Language')}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-8 text-sm"
          >
            {[
              { ar: 'صياغة', en: 'Drafting' },
              { ar: 'تفاوض', en: 'Negotiation' },
              { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
              { ar: 'توقيع إلكتروني', en: 'ESigning' },
            ].map((feature, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/10 px-3 py-1 rounded-full font-bold"
              >
                {t(feature.ar, feature.en)}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <button
              onClick={scrollToWaitlist}
              className="bg-sky text-navy px-8 py-4 rounded-custom font-semibold text-lg hover:bg-sky/90 transition-all duration-300 shadow-custom-hover group ml-[-4px] mr-[-4px] pl-[100px] pr-[100px]"
            >
              <span className="text-[26px] font-arabic-body-bold">
                {t('انضم لقائمة الإنتظار ⟶', 'Join the Early Access Waitlist ⟶')}
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Waitlist() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName) {
      setMessage(t('يرجى ملء جميع الحقول المطلوبة', 'Please fill in all required fields'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(t('تم التسجيل بنجاح!', 'Successfully registered!'));
        setFormData({ fullName: '', email: '', company: '', jobTitle: '' });
      } else {
        const error = await response.json();
        setMessage(error.message || t('حدث خطأ', 'An error occurred'));
      }
    } catch (error) {
      setMessage(t('حدث خطأ في الاتصال', 'Connection error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 lg:py-32 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="lg:text-5xl font-arabic-heading-bold text-white mb-6 whitespace-pre-line text-[25px]">
            {t('للحصول على اشتراك مجاني لمدة ٣أشهر   سجل الآن', 'Get 3 Months Free Subscription   Register Now')}
          </h2>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 bg-grey/10 p-8 rounded-2xl backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('الاسم الكامل', 'Full Name')} *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t('اسمك الكامل', 'Your full name')}
                  className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('البريد الإلكتروني', 'Email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@company.com"
                  className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('اسم الشركة', 'Company Name')}
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={t('شركتك', 'Your company')}
                className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('المنصب', 'Job Title')}
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder={t('منصبك الوظيفي', 'Your job title')}
                className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-navy text-white py-4 px-6 rounded-custom font-semibold text-lg hover:bg-navy/90 transition-all duration-300 shadow-custom hover:shadow-custom-hover"
            >
              {isSubmitting ? (
                <span>{t('جاري التسجيل...', 'Registering...')}</span>
              ) : (
                <span>{t('سجّل الآن', 'Register Now')}</span>
              )}
            </button>

            {message && (
              <div className="text-center text-white mt-4">
                {message}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-navy">
        <Header />
        <Hero />
        <Waitlist />
      </div>
    </LanguageProvider>
  );
}

export default App;