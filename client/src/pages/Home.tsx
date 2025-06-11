import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Waitlist from '@/components/Waitlist';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <Header />
      <Hero />
      <Features />
      <Waitlist />
      <FAQ />
      <Footer />
    </motion.div>
  );
}
