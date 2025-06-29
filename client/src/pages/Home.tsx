import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Waitlist from '@/components/Waitlist';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { useAuthHandler } from '@/hooks/useAuthHandler';

export default function Home() {
  useAuthHandler();
  
  return (
    <div className="min-h-screen bg-navy">
      <Header />
      <Hero />
      <Features />
      <Waitlist />
      <FAQ />
      <Footer />
    </div>
  );
}
