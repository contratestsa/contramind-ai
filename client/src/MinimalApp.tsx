import * as React from 'react';

const { useState, useEffect, createContext, useContext } = React;

interface LanguageContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (ar: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (ar: string) => ar,
});

function useLanguage() {
  return useContext(LanguageContext);
}

function App() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

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
        headers: { 'Content-Type': 'application/json' },
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
      setMessage(t('حدث خطأ في الاتصال', 'Connection error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={contextValue}>
      <div className="min-h-screen bg-navy text-white">
        {/* Header */}
        <header className="fixed w-full top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-grey/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-sky rounded-lg"></div>
                <span className="text-xl font-arabic-heading-bold text-white">ContraMind</span>
              </div>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
              >
                {language === 'ar' ? 'EN' : 'ع'}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden pt-16">
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-arabic-heading-bold leading-loose mb-8">
              <span className="gradient-text">
                {t('أول منصة قانونية لإدارة ومراجعة العقود تدعم اللغة العربية باستخدام الذكاء الإصطناعي', 'The First Legal AI Platform for Contract Management and Review,Supporting Arabic Language')}
              </span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              {[
                { ar: 'صياغة', en: 'Drafting' },
                { ar: 'تفاوض', en: 'Negotiation' },
                { ar: 'تحليل مخاطر', en: 'Risk Analysis' },
                { ar: 'توقيع إلكتروني', en: 'ESigning' },
              ].map((feature, index) => (
                <span key={index} className="bg-white/10 px-3 py-1 rounded-full font-bold">
                  {t(feature.ar, feature.en)}
                </span>
              ))}
            </div>

            <button
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-sky text-navy px-8 py-4 rounded-custom font-semibold text-lg hover:bg-sky/90 transition-all duration-300"
            >
              <span className="text-[26px] font-arabic-body-bold">
                {t('انضم لقائمة الإنتظار ⟶', 'Join the Early Access Waitlist ⟶')}
              </span>
            </button>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-20 lg:py-32 bg-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="lg:text-5xl font-arabic-heading-bold text-white mb-6 text-[25px]">
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
                      className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors text-black"
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
                      className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors text-black"
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
                    className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors text-black"
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
                    className="w-full px-4 py-3 border border-grey rounded-custom focus:ring-2 focus:ring-sky focus:border-sky transition-colors text-black"
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
                  <div className="text-center text-white mt-4">{message}</div>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;