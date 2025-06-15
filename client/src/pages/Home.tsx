import { motion } from 'framer-motion';

// Static content without any hooks or providers
export default function Home() {
  const t = (ar: string, en: string) => ar; // Always return Arabic for now

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-navy"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-navy shadow-custom sticky top-0 z-50"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white">
                ContraMind
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#product" className="text-gray-300 hover:text-white transition-colors">
                {t('المنتج', 'Product')}
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                {t('الأسعار', 'Pricing')}
              </a>
              <a href="#customers" className="text-gray-300 hover:text-white transition-colors">
                {t('العملاء', 'Customers')}
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                {t('اتصل بنا', 'Contact')}
              </a>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-navy via-purple-900 to-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              {t('ثورة الذكاء الاصطناعي في القانون', 'AI Revolution in Legal Services')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
            >
              {t(
                'منصة ذكية لتحليل ومراجعة العقود بتقنيات الذكاء الاصطناعي المتقدمة، مصممة خصيصاً للشرق الأوسط وشمال أفريقيا',
                'Smart platform for contract analysis and review with advanced AI technologies, designed specifically for the Middle East and North Africa'
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button className="bg-gold hover:bg-gold/90 text-navy px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                {t('ابدأ التجربة المجانية', 'Start Free Trial')}
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300">
                {t('شاهد العرض التوضيحي', 'Watch Demo')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              {t('مميزات متقدمة لخدماتك القانونية', 'Advanced Features for Your Legal Services')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t(
                'استفد من أحدث تقنيات الذكاء الاصطناعي لتحسين كفاءة عملك القانوني وضمان دقة أعلى',
                'Leverage the latest AI technologies to improve your legal work efficiency and ensure higher accuracy'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: { ar: 'تحليل ذكي للعقود', en: 'Smart Contract Analysis' },
                description: { ar: 'تحليل شامل للعقود باستخدام الذكاء الاصطناعي لتحديد المخاطر والنقاط الحرجة', en: 'Comprehensive contract analysis using AI to identify risks and critical points' }
              },
              {
                title: { ar: 'مراجعة تلقائية', en: 'Automated Review' },
                description: { ar: 'مراجعة تلقائية سريعة ودقيقة للوثائق القانونية مع تقارير مفصلة', en: 'Fast and accurate automated review of legal documents with detailed reports' }
              },
              {
                title: { ar: 'دعم اللغة العربية', en: 'Arabic Language Support' },
                description: { ar: 'دعم كامل للغة العربية والأنظمة القانونية في المنطقة', en: 'Full support for Arabic language and regional legal systems' }
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {t(feature.title.ar, feature.title.en)}
                </h3>
                <p className="text-gray-300">
                  {t(feature.description.ar, feature.description.en)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-navy to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                {t('انضم إلى قائمة الانتظار', 'Join the Waitlist')}
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {t(
                  'كن من أوائل المستفيدين من ثورة الذكاء الاصطناعي في الخدمات القانونية. احصل على وصول مبكر وخصومات حصرية.',
                  'Be among the first to benefit from the AI revolution in legal services. Get early access and exclusive discounts.'
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
            >
              <form className="space-y-6">
                <div>
                  <label className="text-white font-bold block mb-2">
                    {t('الاسم الكامل', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300 rounded-lg px-4 py-3"
                    placeholder={t('اكتب اسمك الكامل', 'Enter your full name')}
                  />
                </div>

                <div>
                  <label className="text-white font-bold block mb-2">
                    {t('البريد الإلكتروني', 'Email Address')}
                  </label>
                  <input
                    type="email"
                    className="w-full mt-2 bg-white/20 border border-white/30 text-white placeholder:text-gray-300 rounded-lg px-4 py-3"
                    placeholder={t('your@email.com', 'your@email.com')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('انضم إلى قائمة الانتظار', 'Join Waitlist')}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">ContraMind</div>
            <p className="text-gray-400">
              {t('© 2025 ContraMind. جميع الحقوق محفوظة.', '© 2025 ContraMind. All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}