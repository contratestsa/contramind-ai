export default function Features() {
  const features = [
    {
      icon: 'fas fa-robot',
      title: 'صياغة العقود بالذكاء الاصطناعي',
      description: 'إنشاء مسودات عقود احترافية بنقرة واحدة',
    },
    {
      icon: 'fas fa-handshake',
      title: 'مساعد التفاوض الذكي',
      description: 'تسريع عمليات التفاوض بين الإدارات في الشركة',
    },
    {
      icon: 'fas fa-search',
      title: 'تحليل مخاطر',
      description: 'تحليل شامل للمخاطر وفقاً للقوانين السعودية',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'تحليل الأداء',
      description: 'مراقبة وتحليل أداء العقود بشكل مستمر',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'الامتثال القانوني',
      description: 'ضمان الامتثال الكامل للقوانين المحلية والدولية',
    },
    {
      icon: 'fas fa-users',
      title: 'التعاون الجماعي',
      description: 'منصة تعاونية لفرق العمل القانونية والتجارية',
    },
  ];

  return (
    <section id="product" className="py-16 sm:py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            مميزات منصة ContraMind.ai
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            حلول شاملة ومتقدمة لإدارة العقود القانونية بتقنيات الذكاء الاصطناعي
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-sky/30"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-sky/10 rounded-lg mb-4">
                <i className={`${feature.icon} text-2xl text-sky`}></i>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-navy to-sky/20 rounded-2xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              جاهز لتحويل طريقة إدارة العقود؟
            </h3>
            <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
              انضم إلى قائمة الانتظار واحصل على وصول مبكر لمنصة ContraMind.ai
            </p>
            <button 
              onClick={() => {
                const element = document.querySelector('#waitlist');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-sky hover:bg-sky/90 text-navy font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              انضم الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}