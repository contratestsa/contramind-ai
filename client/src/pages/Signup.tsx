import * as React from "react";
import SignupForm from "@/components/auth/SignupForm";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";

export default function Signup() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f0f3f5]">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0d2836]">
        <div className="w-full max-w-[600px] mx-auto">
          <SignupForm 
            locale={language} 
            onLanguageToggle={() => {}} 
          />
        </div>
      </div>
    </div>
  );
}