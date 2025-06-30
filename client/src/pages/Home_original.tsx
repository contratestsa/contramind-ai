import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Waitlist from "@/components/Waitlist";
import FAQ from "@/components/FAQ";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Waitlist />
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}