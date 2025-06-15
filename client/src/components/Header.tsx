import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-navy shadow-custom sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden">
              <img 
                src={logoImage} 
                alt="ContraMind.ai Logo" 
                className="w-72 h-18 object-contain object-left ml-[-9px] mr-[-9px] pt-[-27px] pb-[-27px] mt-[-59px] mb-[-59px] pl-[37px] pr-[37px]"
              />
            </div>
          </motion.div>

          {/* Language Toggle & CTA */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden sm:flex items-center bg-grey rounded-full p-1"
            >
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-navy text-white hover:bg-navy/90"
              >
                العربية
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-navy hover:bg-sky/20"
              >
                English
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}