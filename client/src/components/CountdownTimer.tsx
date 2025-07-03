import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageManager } from '@/components/SimpleLanguage';

interface CountdownTimerProps {
  className?: string;
  showTitle?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function CountdownTimer({ 
  className = '', 
  showTitle = true, 
  size = 'medium' 
}: CountdownTimerProps) {
  const t = LanguageManager.t;
  const language = LanguageManager.getLanguage();
  
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set a fixed target date for launch (July 18, 2025)
    const targetDate = new Date('2025-07-18T00:00:00');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-3 sm:p-4',
          title: 'text-xs text-gray-400 mb-1',
          timer: 'text-lg sm:text-xl',
          labels: 'text-xs text-gray-500 mt-1'
        };
      case 'large':
        return {
          container: 'p-6 sm:p-8',
          title: 'text-sm sm:text-base text-gray-400 mb-3',
          timer: 'text-3xl sm:text-4xl',
          labels: 'text-sm text-gray-500 mt-2'
        };
      default: // medium
        return {
          container: 'p-4 sm:p-6',
          title: 'text-xs sm:text-sm text-gray-400 mb-2',
          timer: 'text-xl sm:text-2xl',
          labels: 'text-xs text-gray-500 mt-1'
        };
    }
  };

  const classes = getSizeClasses();

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl shadow-custom ${classes.container} ${className}`}
    >
      {showTitle && (
        <div className={`font-arabic-body ${classes.title}`}>
          {t('متبقي على الإطلاق', 'Time until launch')}
        </div>
      )}
      <div className={`font-space font-bold text-gray-800 ${classes.timer}`}>
        <span>{countdown.days.toString().padStart(2, '0')}</span>:
        <span>{countdown.hours.toString().padStart(2, '0')}</span>:
        <span>{countdown.minutes.toString().padStart(2, '0')}</span>:
        <span>{countdown.seconds.toString().padStart(2, '0')}</span>
      </div>
      <div className={`font-arabic-body ${classes.labels}`}>
        {t('أيام : ساعات : دقائق : ثوان', 'Days : Hours : Minutes : Seconds')}
      </div>
    </motion.div>
  );
}