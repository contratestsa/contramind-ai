
import { motion } from "framer-motion";
import { useLanguage } from "../hooks/useLanguage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const { t, language, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const joinWaitlistMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to join waitlist");
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      joinWaitlistMutation.mutate(email);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/api/placeholder/120/40"
                alt="ContraMind"
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                {language === "ar" ? "تسجيل الدخول" : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-5xl md:text-6xl font-bold text-gray-900 mb-8 ${
                language === "ar" ? "font-arabic" : ""
              }`}
            >
              {language === "ar" 
                ? "أول منصة ذكية لإدارة العقود بالذكاء الاصطناعي"
                : "The First AI-Native Contract Intelligence Platform"
              }
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl text-gray-600 mb-12 max-w-3xl mx-auto ${
                language === "ar" ? "font-arabic" : ""
              }`}
            >
              {language === "ar"
                ? "حوّل عقودك المعقدة إلى رؤى واضحة. اكتشف المخاطر، وفهم الالتزامات، واتخذ قرارات أفضل بثقة."
                : "Transform complex contracts into clear insights. Discover risks, understand obligations, and make better decisions with confidence."
              }
            </motion.p>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={joinWaitlistMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {joinWaitlistMutation.isPending 
                      ? (language === "ar" ? "جاري الإرسال..." : "Sending...")
                      : (language === "ar" ? "انضم للقائمة" : "Join Waitlist")
                    }
                  </Button>
                </form>
              ) : (
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <p className={`text-green-800 text-lg font-medium ${
                    language === "ar" ? "font-arabic" : ""
                  }`}>
                    {language === "ar"
                      ? "شكراً لانضمامك! سنتواصل معك قريباً."
                      : "Thank you for joining! We'll be in touch soon."
                    }
                  </p>
                </div>
              )}
            </motion.div>

            {/* Launch Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16"
            >
              <p className={`text-sm text-gray-500 ${language === "ar" ? "font-arabic" : ""}`}>
                {language === "ar" 
                  ? "الإطلاق المتوقع: يوليو 2025"
                  : "Expected Launch: July 2025"
                }
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className={`text-gray-500 text-sm ${language === "ar" ? "font-arabic" : ""}`}>
              {language === "ar"
                ? "© 2025 ContraMind. جميع الحقوق محفوظة."
                : "© 2025 ContraMind. All rights reserved."
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
