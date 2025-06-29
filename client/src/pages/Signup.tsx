import { useState } from "react";
import SignupForm from "@/components/auth/SignupForm";
import { useSimpleLanguage } from "@/hooks/useSimpleLanguage";

export default function Signup() {
  const { language, setLanguage } = useSimpleLanguage();
  
  const handleLanguageToggle = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <SignupForm 
      locale={language} 
      onLanguageToggle={handleLanguageToggle} 
    />
  );
}