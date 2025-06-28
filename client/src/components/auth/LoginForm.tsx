import * as React from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft, LogIn } from "lucide-react";
import { useLanguageAwareNavigation } from "@/components/LanguageRouter";
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

const translations = {
  en: {
    signIn: "Sign In",
    welcomeBack: "Welcome back to ContraMind",
    tagline: "The Future of Law, Powered by AI",
    email: "Email Address",
    password: "Password",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot your password?",
    signInButton: "Sign In",
    signingIn: "Signing in...",
    orContinueWith: "Or continue with",
    google: "Google",
    microsoft: "Microsoft",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
    invalidEmail: "Please enter a valid email",
    passwordTooShort: "Password must be at least 6 characters",
    loginError: "Login Error",
    loginSuccess: "Login Successful",
    welcome: "Welcome to ContraMind",
    invalidCredentials: "Invalid email or password"
  },
  ar: {
    signIn: "تسجيل الدخول",
    welcomeBack: "مرحباً بك مرة أخرى في كونترامايند",
    tagline: "مستقبل القانون، مدعوم بالذكاء الاصطناعي",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "نسيت كلمة المرور؟",
    signInButton: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    orContinueWith: "أو متابعة باستخدام",
    google: "جوجل",
    microsoft: "مايكروسوفت",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب جديد",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    passwordTooShort: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
    loginError: "خطأ في تسجيل الدخول",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    welcome: "مرحباً بك في كونترامايند",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
  }
};

export default function LoginForm({ locale, onLanguageToggle }: LoginFormProps) {
  const { navigateTo } = useLanguageAwareNavigation();
  const { toast } = useToast();
  const t = translations[locale];
  const isRTL = locale === "ar";
  
  const [formData, setFormData] = React.useState<LoginData>({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.loginSuccess,
        description: t.welcome,
        variant: "default",
      });
      navigateTo("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: t.loginError,
        description: error.message || t.invalidCredentials,
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path[0] === "email") {
          newErrors.email = t.invalidEmail;
        }
        if (error.path[0] === "password") {
          newErrors.password = t.passwordTooShort;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      loginMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#0d2836] pl-[30px] pr-[30px] ml-[-168px] mr-[-168px] pt-[0px] pb-[0px] mt-[-40px] mb-[-40px]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[400px] w-full space-y-8">
        

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          
          
          <h1 className={`text-3xl font-bold text-white mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Space_Grotesk]'}`}>
            {t.signIn}
          </h1>
          
          <p className={`text-white/70 mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.welcomeBack}
          </p>

          <p className={`text-[#B7DEE8] text-sm font-medium ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.tagline}
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
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
                className="flex h-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full py-3 px-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C2836] focus:border-transparent text-gray-800 placeholder-gray-400 text-left bg-[#ffffff]"
                placeholder={t.emailPlaceholder}
                disabled={loginMutation.isPending}
                dir={isRTL ? "rtl" : "ltr"}
                aria-label={t.email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm" role="alert">{errors.email}</p>
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
                  className="flex h-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full py-3 px-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C2836] focus:border-transparent text-gray-800 placeholder-gray-400 pr-10 text-left bg-[#ffffff]"
                  placeholder={t.passwordPlaceholder}
                  disabled={loginMutation.isPending}
                  dir={isRTL ? "rtl" : "ltr"}
                  aria-label={t.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm" role="alert">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={`flex items-center ${isRTL ? 'justify-between' : 'justify-between'}`}>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label 
                  htmlFor="remember" 
                  className={`text-sm text-[#101920] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}
                >
                  {t.rememberMe}
                </Label>
              </div>
              
              <Link href="/forgot-password" className={`text-sm text-[#0C2836] hover:text-[#1a4a5c] font-medium ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                {t.forgotPassword}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#B7DEE8] hover:bg-[#a5c9d6] text-[#0d2836] font-semibold py-2 rounded transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.signingIn}</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.signInButton}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E6E6E6]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 bg-white text-gray-500 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.orContinueWith}
                </span>
              </div>
            </div>

            {/* SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-[#E6E6E6] hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={() => alert("Google login placeholder")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.google}</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="border-[#E6E6E6] hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={() => alert("Microsoft login placeholder")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
                  <path fill="#0078D4" d="M12.623 0H24v11.372H12.623z"/>
                  <path fill="#00BCF2" d="M0 12.623h11.377V24H0z"/>
                  <path fill="#40E0D0" d="M12.623 12.623H24V24H12.623z"/>
                </svg>
                <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.microsoft}</span>
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
              {t.noAccount}{" "}
              <button 
                onClick={() => navigateTo('/signup')}
                className={`font-semibold text-[#0C2836] hover:text-[#1a4a5c] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}
              >
                {t.createAccount}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}