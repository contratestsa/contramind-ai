import * as React from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, User, Building, Briefcase, ArrowRight, ArrowLeft, UserPlus, Check, X } from "lucide-react";
import { useLanguageAwareNavigation } from "@/components/LanguageRouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';

interface SignupFormProps {
  locale: "en" | "ar";
  onLanguageToggle: () => void;
}

const translations = {
  en: {
    createAccount: "Create Account",
    joinContraMind: "Join ContraMind and discover the future of legal technology",
    tagline: "The Future of Law, Powered by AI",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    company: "Company Name",
    jobTitle: "Job Title",
    fullNamePlaceholder: "Enter your full name",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    confirmPasswordPlaceholder: "Re-enter your password",
    companyPlaceholder: "Your company name",
    jobTitlePlaceholder: "Lawyer, Legal Advisor, etc...",
    acceptTerms: "I accept the Terms of Service and Privacy Policy",
    createAccountButton: "Create Account",
    creatingAccount: "Creating account...",
    orContinueWith: "Or continue with",
    google: "Google",
    microsoft: "Microsoft",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    // Validation messages
    fullNameRequired: "Full name is required",
    invalidEmail: "Please enter a valid email",
    passwordTooShort: "Password must be at least 6 characters",
    passwordMismatch: "Passwords do not match",
    termsRequired: "You must accept the terms and conditions",
    // Password strength
    passwordStrength: "Password Strength",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
    // Toast messages
    signupError: "Signup Error",
    signupSuccess: "Account Created Successfully",
    canNowLogin: "You can now log in with your credentials",
    errorCreating: "An error occurred while creating your account"
  },
  ar: {
    createAccount: "إنشاء حساب جديد",
    joinContraMind: "انضم إلى كونترامايند واكتشف مستقبل التكنولوجيا القانونية",
    tagline: "مستقبل القانون، مدعوم بالذكاء الاصطناعي",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    company: "اسم الشركة",
    jobTitle: "المسمى الوظيفي",
    fullNamePlaceholder: "أدخل اسمك الكامل",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
    companyPlaceholder: "اسم شركتك",
    jobTitlePlaceholder: "محامي، مستشار قانوني، إلخ...",
    acceptTerms: "أوافق على شروط الخدمة وسياسة الخصوصية",
    createAccountButton: "إنشاء حساب",
    creatingAccount: "جاري إنشاء الحساب...",
    orContinueWith: "أو متابعة باستخدام",
    google: "جوجل",
    microsoft: "مايكروسوفت",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    // Validation messages
    fullNameRequired: "الاسم الكامل مطلوب",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    passwordTooShort: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
    passwordMismatch: "كلمات المرور غير متطابقة",
    termsRequired: "يجب الموافقة على الشروط والأحكام",
    // Password strength
    passwordStrength: "قوة كلمة المرور",
    weak: "ضعيفة",
    fair: "مقبولة",
    good: "جيدة",
    strong: "قوية",
    // Toast messages
    signupError: "خطأ في إنشاء الحساب",
    signupSuccess: "تم إنشاء الحساب بنجاح",
    canNowLogin: "يمكنك الآن تسجيل الدخول باستخدام بياناتك",
    errorCreating: "حدث خطأ أثناء إنشاء الحساب"
  }
};

type FormData = InsertUser & {
  confirmPassword: string;
  company?: string;
  jobTitle?: string;
  acceptTerms: boolean;
};

export default function SignupForm({ locale, onLanguageToggle }: SignupFormProps) {
  const { navigateTo } = useLanguageAwareNavigation();
  const { toast } = useToast();
  const t = translations[locale];
  const isRTL = locale === "ar";
  
  const [formData, setFormData] = React.useState<FormData>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    company: "",
    jobTitle: "",
    acceptTerms: false,
  });
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 1) return { text: t.weak, color: "text-red-500" };
    if (strength <= 2) return { text: t.fair, color: "text-yellow-500" };
    if (strength <= 3) return { text: t.good, color: "text-blue-500" };
    return { text: t.strong, color: "text-green-500" };
  };

  const signupMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.signupSuccess,
        description: t.canNowLogin,
        variant: "default",
      });
      navigateTo("/login");
    },
    onError: (error: any) => {
      toast({
        title: t.signupError,
        description: error.message || t.errorCreating,
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t.fullNameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.invalidEmail;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    
    if (!formData.password) {
      newErrors.password = t.passwordTooShort;
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordTooShort;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t.termsRequired;
    }

    // Generate username from email
    if (formData.email && !newErrors.email) {
      const username = formData.email.split('@')[0];
      setFormData(prev => ({ ...prev, username }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, acceptTerms, company, jobTitle, ...submitData } = formData;
      signupMutation.mutate(submitData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="min-h-screen from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#0d2836] pl-[90px] pr-[90px] ml-[-180px] mr-[-180px] mt-[-40px] mb-[-40px] pt-[0px] pb-[0px]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[400px] w-full space-y-8">
        

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
              
            </motion.div>
          </Link>
          
          <h1 className={`text-3xl font-bold text-white mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Space_Grotesk]'}`}>
            {t.createAccount}
          </h1>
          
          <p className={`text-white/70 mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.joinContraMind}
          </p>

          <p className={`text-[#B7DEE8] text-sm font-medium ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.tagline}
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="fullName" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <User className="w-4 h-4" />
                {t.fullName}
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${
                  errors.fullName ? "border-red-500" : ""
                } ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t.fullNamePlaceholder}
                disabled={signupMutation.isPending}
                dir={isRTL ? "rtl" : "ltr"}
                aria-label={t.fullName}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm" role="alert">{errors.fullName}</p>
              )}
            </div>

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
                disabled={signupMutation.isPending}
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
                  disabled={signupMutation.isPending}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                      {t.passwordStrength}
                    </span>
                    <span className={`text-xs ${passwordStrengthInfo.color} ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                      {passwordStrengthInfo.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength <= 1 ? 'bg-red-500 w-1/4' :
                        passwordStrength <= 2 ? 'bg-yellow-500 w-2/4' :
                        passwordStrength <= 3 ? 'bg-blue-500 w-3/4' :
                        'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm" role="alert">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="confirmPassword" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <Lock className="w-4 h-4" />
                {t.confirmPassword}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${isRTL ? 'pl-10 text-right' : 'pr-10 text-left'} ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder={t.confirmPasswordPlaceholder}
                  disabled={signupMutation.isPending}
                  dir={isRTL ? "rtl" : "ltr"}
                  aria-label={t.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600`}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center gap-1">
                  {formData.password === formData.confirmPassword ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'} ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                    {formData.password === formData.confirmPassword ? "Passwords match" : "Passwords don't match"}
                  </span>
                </div>
              )}
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm" role="alert">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Company Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="company" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <Building className="w-4 h-4" />
                {t.company}
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t.companyPlaceholder}
                disabled={signupMutation.isPending}
                dir={isRTL ? "rtl" : "ltr"}
                aria-label={t.company}
              />
            </div>

            {/* Job Title Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="jobTitle" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <Briefcase className="w-4 h-4" />
                {t.jobTitle}
              </Label>
              <Input
                id="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t.jobTitlePlaceholder}
                disabled={signupMutation.isPending}
                dir={isRTL ? "rtl" : "ltr"}
                aria-label={t.jobTitle}
              />
            </div>

            {/* Terms Acceptance */}
            <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange("acceptTerms", checked === true)}
                className="mt-1"
              />
              <Label 
                htmlFor="acceptTerms" 
                className={`text-sm text-[#101920] leading-5 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}
              >
                {t.acceptTerms}
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm" role="alert">{errors.acceptTerms}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full bg-[#B7DEE8] hover:bg-[#a5c9d6] text-white font-semibold py-2 rounded transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {signupMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.creatingAccount}</span>
                </div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span className={isRTL ? 'font-[Almarai]' : 'font-[Inter]'}>{t.createAccountButton}</span>
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

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
              {t.alreadyHaveAccount}{" "}
              <Link href="/login" className={`font-semibold text-[#0C2836] hover:text-[#1a4a5c] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                {t.signIn}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}