import { motion } from 'framer-motion';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const features = [
    {
      title: 'مراجعة وتحليل العقود بذكاء',
      description: 'تحليل شامل للعقود باستخدام الذكاء الاصطناعي لتحديد المخاطر والثغرات',
      icon: '📋'
    },
    {
      title: 'صياغة عقود احترافية',
      description: 'إنشاء عقود قانونية متوافقة مع الأنظمة المحلية والدولية',
      icon: '✍️'
    },
    {
      title: 'إدارة دورة حياة العقود',
      description: 'تتبع العقود من الإنشاء إلى التنفيذ مع تنبيهات للمواعيد المهمة',
      icon: '🔄'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl lg:text-4xl font-bold text-navy mb-4"
          >
            ميزات ContraMind.ai
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            منصة شاملة لإدارة العقود مدعومة بالذكاء الاصطناعي
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-grey/10 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-navy mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}