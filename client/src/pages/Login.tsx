import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useSimpleLanguage } from "@/hooks/useSimpleLanguage";

export default function Login() {
  const { language, setLanguage } = useSimpleLanguage();
  
  const handleLanguageToggle = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <LoginForm 
      locale={language} 
      onLanguageToggle={handleLanguageToggle} 
    />
  );
}