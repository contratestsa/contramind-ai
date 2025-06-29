import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft, Chrome, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginData } from "@shared/schema";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';

interface LoginFormProps {
  locale: "en" | "ar";
  onLanguageToggle: () => void;
}

export default function LoginForm({ locale, onLanguageToggle }: LoginFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const isRTL = locale === "ar";

  const t = {
    signIn: locale === "ar" ? "تسجيل الدخول" : "Sign In",
    welcomeBack: locale === "ar" ? "مرحباً بعودتك" : "Welcome back",
    tagline: locale === "ar" ? "منصة الذكاء الاصطناعي للعقود" : "AI Contract Management Platform",
    email: locale === "ar" ? "البريد الإلكتروني" : "Email",
    password: locale === "ar" ? "كلمة المرور" : "Password",
    rememberMe: locale === "ar" ? "تذكرني" : "Remember me",
    forgotPassword: locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?",
    signInButton: locale === "ar" ? "تسجيل الدخول" : "Sign In",
    signInWithGoogle: locale === "ar" ? "تسجيل الدخول بجوجل" : "Sign in with Google",
    signInWithMicrosoft: locale === "ar" ? "تسجيل الدخول بمايكروسوفت" : "Sign in with Microsoft",
    or: locale === "ar" ? "أو" : "or",
    noAccount: locale === "ar" ? "لا تملك حساباً؟" : "Don't have an account?",
    signUp: locale === "ar" ? "إنشاء حساب" : "Sign up",
    backToHome: locale === "ar" ? "العودة للرئيسية" : "Back to Home"
  };

  const mutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: locale === "ar" ? "تم تسجيل الدخول بنجاح" : "Login successful",
        description: locale === "ar" ? "مرحباً بك في ContraMind" : "Welcome to ContraMind",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ في تسجيل الدخول" : "Login error",
        description: error.message,
      });
    },
  });

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<LoginData> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof LoginData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(formData);
  };

  const handleOAuthLogin = (provider: 'google' | 'microsoft') => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[400px] w-full space-y-8">
        {/* Language Toggle */}
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <button
            onClick={onLanguageToggle}
            className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {locale === "ar" ? "English" : "عربي"}
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center justify-center mb-6 cursor-pointer">
              <img 
                src={logoImage} 
                alt="ContraMind"
                className="h-16 w-auto"
                style={{ padding: '8px' }}
              />
            </div>
          </Link>
          
          <h1 className={`text-3xl font-bold text-white mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Space_Grotesk]'}`}>
            {t.signIn}
          </h1>
          
          <p className={`text-white/70 mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.welcomeBack}
          </p>

          <p className={`text-[#B7DEE8] text-sm font-medium ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.tagline}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <Mail className="w-4 h-4" />
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${
                  errors.email ? "border-red-500" : ""
                } ${isRTL ? 'text-right font-[Almarai]' : 'font-[Inter]'}`}
                placeholder={t.email}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <Lock className="w-4 h-4" />
                {t.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full py-2 px-3 pr-10 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${
                    errors.password ? "border-red-500" : ""
                  } ${isRTL ? 'text-right font-[Almarai] pl-10 pr-3' : 'font-[Inter]'}`}
                  placeholder={t.password}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 ${
                    isRTL ? 'left-3' : 'right-3'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label 
                  htmlFor="remember" 
                  className={`text-sm text-[#101920] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}
                >
                  {t.rememberMe}
                </Label>
              </div>
              <Link href="/forgot-password">
                <span className={`text-sm text-[#0C2836] hover:underline ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.forgotPassword}
                </span>
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className={`w-full bg-[#0C2836] hover:bg-[#0C2836]/90 text-white py-2 px-4 rounded font-semibold transition-colors ${
                isRTL ? 'font-[Almarai]' : 'font-[Inter]'
              }`}
            >
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {mutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {mutation.isPending ? (locale === "ar" ? "جاري تسجيل الدخول..." : "Signing in...") : t.signInButton}
              </div>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E6E6E6]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 bg-white text-[#666666] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.or}
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin('google')}
                className={`w-full border-[#E6E6E6] text-[#101920] hover:bg-gray-50 py-2 px-4 rounded font-medium transition-colors ${
                  isRTL ? 'font-[Almarai]' : 'font-[Inter]'
                }`}
              >
                <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Chrome className="w-4 h-4" />
                  {t.signInWithGoogle}
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin('microsoft')}
                className={`w-full border-[#E6E6E6] text-[#101920] hover:bg-gray-50 py-2 px-4 rounded font-medium transition-colors ${
                  isRTL ? 'font-[Almarai]' : 'font-[Inter]'
                }`}
              >
                <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-4 h-4 bg-[#00BCF2] rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  {t.signInWithMicrosoft}
                </div>
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm text-[#666666] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
              {t.noAccount}{" "}
              <Link href="/signup">
                <span className={`text-[#0C2836] hover:underline font-semibold ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.signUp}
                </span>
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <div className={`inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors ${
              isRTL ? 'flex-row-reverse font-[Almarai]' : 'font-[Inter]'
            }`}>
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t.backToHome}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}