import { useState } from "react";
import { motion } from "framer-motion";
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const t = translations[locale];
  const isRTL = locale === "ar";
  
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      setLocation("/dashboard");
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
    <div className={`min-h-screen bg-gradient-to-br from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8`} dir={isRTL ? "rtl" : "ltr"}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center mb-6 cursor-pointer"
            >
              <img 
                src={logoImage} 
                alt="ContraMind"
                className="h-16 w-auto"
                style={{ padding: '8px' }} // 0.5× logomark height clearspace
              />
            </motion.div>
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
                className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${
                  errors.email ? "border-red-500" : ""
                } ${isRTL ? 'text-right' : 'text-left'}`}
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
                  className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${isRTL ? 'pl-10 text-right' : 'pr-10 text-left'} ${
                    errors.password ? "border-red-500" : ""
                  }`}
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
              
              <Link href="/forgot-password">
                <a className={`text-sm text-[#0C2836] hover:text-[#1a4a5c] font-medium ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.forgotPassword}
                </a>
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#B7DEE8] hover:bg-[#a5c9d6] text-white font-semibold py-2 rounded transition-all duration-300 flex items-center justify-center gap-2"
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
              >
                <Chrome className="w-4 h-4" />
                <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.google}</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="border-[#E6E6E6] hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0C2836">
                  <path d="M23.64 12.204c0-.436-.036-.887-.098-1.345h-11.48v2.541h6.564c-.284 1.498-1.144 2.769-2.437 3.622v2.999h3.947c2.305-2.123 3.634-5.249 3.634-8.936z"/>
                  <path d="M12.062 24c3.297 0 6.065-1.095 8.087-2.959l-3.947-2.999c-1.095.738-2.497 1.174-4.14 1.174-3.174 0-5.861-2.144-6.828-5.03h-4.073v3.098C3.24 21.348 7.317 24 12.062 24z"/>
                  <path d="M5.234 14.186c-.244-.738-.383-1.523-.383-2.334s.139-1.596.383-2.334V6.42H1.161C.422 7.889 0 9.407 0 11.852s.422 3.963 1.161 5.432l4.073-3.098z"/>
                  <path d="M12.062 4.653c1.789 0 3.398.615 4.661 1.823l3.497-3.497C18.122 1.186 15.354 0 12.062 0 7.317 0 3.24 2.652 1.161 6.42l4.073 3.098c.967-2.886 3.654-5.03 6.828-5.03z"/>
                </svg>
                <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.microsoft}</span>
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
              {t.noAccount}{" "}
              <Link href="/signup">
                <a className={`font-semibold text-[#0C2836] hover:text-[#1a4a5c] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.createAccount}
                </a>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}