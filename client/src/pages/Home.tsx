
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import Waitlist from "@/components/Waitlist";
import CountdownTimer from "@/components/CountdownTimer";
import AuthModals from "@/components/auth/AuthModals";

export default function Home() {
  const { user } = useAuth();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'انضم إلى قائمة الانتظار' : 'Join the Waitlist'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'ar' 
                  ? 'كن من أول المستخدمين الذين يجربون منصة ContraMind الثورية'
                  : 'Be among the first to experience the revolutionary ContraMind platform'
                }
              </p>
            </div>
            <CountdownTimer />
            <Waitlist />
          </div>
        </div>
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
      <AuthModals />
    </div>
  );
}
