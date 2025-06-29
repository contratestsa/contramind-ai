import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, User, Building, Briefcase, ArrowRight, ArrowLeft, Chrome, UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  jobTitle?: string;
}

interface SignupFormProps {
  locale: "en" | "ar";
  onLanguageToggle: () => void;
}

export default function SignupForm({ locale, onLanguageToggle }: SignupFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    jobTitle: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupData>>({});

  const isRTL = locale === "ar";

  const t = {
    signUp: locale === "ar" ? "إنشاء حساب" : "Sign Up",
    joinUs: locale === "ar" ? "انضم إلينا" : "Join us",
    tagline: locale === "ar" ? "منصة الذكاء الاصطناعي للعقود" : "AI Contract Management Platform",
    fullName: locale === "ar" ? "الاسم الكامل" : "Full Name",
    email: locale === "ar" ? "البريد الإلكتروني" : "Email",
    password: locale === "ar" ? "كلمة المرور" : "Password",
    confirmPassword: locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password",
    company: locale === "ar" ? "الشركة / المؤسسة" : "Company / Organization",
    jobTitle: locale === "ar" ? "المسمى الوظيفي" : "Job Title",
    signUpButton: locale === "ar" ? "إنشاء حساب" : "Create Account",
    signUpWithGoogle: locale === "ar" ? "التسجيل بجوجل" : "Sign up with Google",
    signUpWithMicrosoft: locale === "ar" ? "التسجيل بمايكروسوفت" : "Sign up with Microsoft",
    or: locale === "ar" ? "أو" : "or",
    haveAccount: locale === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?",
    signIn: locale === "ar" ? "تسجيل الدخول" : "Sign in",
    backToHome: locale === "ar" ? "العودة للرئيسية" : "Back to Home",
    passwordRequirements: locale === "ar" ? "متطلبات كلمة المرور:" : "Password Requirements:",
    minLength: locale === "ar" ? "8 أحرف على الأقل" : "At least 8 characters",
    hasUppercase: locale === "ar" ? "حرف كبير واحد على الأقل" : "At least one uppercase letter",
    hasLowercase: locale === "ar" ? "حرف صغير واحد على الأقل" : "At least one lowercase letter",
    hasNumber: locale === "ar" ? "رقم واحد على الأقل" : "At least one number"
  };

  const jobTitles = [
    { value: 'lawyer', ar: 'محامي', en: 'Lawyer' },
    { value: 'legal_counsel', ar: 'مستشار قانوني', en: 'Legal Counsel' },
    { value: 'paralegal', ar: 'مساعد قانوني', en: 'Paralegal' },
    { value: 'contract_manager', ar: 'مدير عقود', en: 'Contract Manager' },
    { value: 'legal_assistant', ar: 'مساعد قانوني', en: 'Legal Assistant' },
    { value: 'compliance_officer', ar: 'مسؤول امتثال', en: 'Compliance Officer' },
    { value: 'business_owner', ar: 'صاحب عمل', en: 'Business Owner' },
    { value: 'entrepreneur', ar: 'رائد أعمال', en: 'Entrepreneur' },
    { value: 'other', ar: 'أخرى', en: 'Other' },
  ];

  const mutation = useMutation({
    mutationFn: async (data: Omit<SignupData, 'confirmPassword'>) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Signup failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: locale === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully",
        description: locale === "ar" ? "مرحباً بك في ContraMind" : "Welcome to ContraMind",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ في إنشاء الحساب" : "Signup error",
        description: error.message,
      });
    },
  });

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
    return requirements;
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<SignupData> = {};

    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = locale === "ar" ? "الاسم الكامل مطلوب" : "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === "ar" ? "بريد إلكتروني غير صحيح" : "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = locale === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = locale === "ar" ? "كلمة المرور لا تلبي المتطلبات" : "Password doesn't meet requirements";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = locale === "ar" ? "كلمات المرور غير متطابقة" : "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    mutation.mutate(signupData);
  };

  const handleOAuthSignup = (provider: 'google' | 'microsoft') => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[500px] w-full space-y-8">
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
            {t.signUp}
          </h1>
          
          <p className={`text-white/70 mb-2 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.joinUs}
          </p>

          <p className={`text-[#B7DEE8] text-sm font-medium ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
            {t.tagline}
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
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
                } ${isRTL ? 'text-right font-[Almarai]' : 'font-[Inter]'}`}
                placeholder={t.fullName}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
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
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className={`text-xs font-medium text-gray-700 ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                    {t.passwordRequirements}
                  </p>
                  <div className="space-y-1">
                    {[
                      { key: 'minLength', label: t.minLength, valid: passwordValidation.minLength },
                      { key: 'hasUppercase', label: t.hasUppercase, valid: passwordValidation.hasUppercase },
                      { key: 'hasLowercase', label: t.hasLowercase, valid: passwordValidation.hasLowercase },
                      { key: 'hasNumber', label: t.hasNumber, valid: passwordValidation.hasNumber },
                    ].map((req) => (
                      <div key={req.key} className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {req.valid ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`${req.valid ? 'text-green-600' : 'text-red-500'} ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
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
                  className={`w-full py-2 px-3 pr-10 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${
                    errors.confirmPassword ? "border-red-500" : ""
                  } ${isRTL ? 'text-right font-[Almarai] pl-10 pr-3' : 'font-[Inter]'}`}
                  placeholder={t.confirmPassword}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 ${
                    isRTL ? 'left-3' : 'right-3'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Company */}
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
                className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${isRTL ? 'text-right font-[Almarai]' : 'font-[Inter]'}`}
                placeholder={t.company}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label 
                htmlFor="jobTitle" 
                className={`text-[#101920] font-semibold flex items-center gap-2 ${isRTL ? 'font-[Almarai] flex-row-reverse' : 'font-[Inter]'}`}
              >
                <Briefcase className="w-4 h-4" />
                {t.jobTitle}
              </Label>
              <Select value={formData.jobTitle} onValueChange={(value) => handleInputChange('jobTitle', value)}>
                <SelectTrigger className={`w-full py-2 px-3 border-[#E6E6E6] focus:border-[#0C2836] focus:ring-[#0C2836] rounded ${isRTL ? 'text-right font-[Almarai]' : 'font-[Inter]'}`}>
                  <SelectValue placeholder={t.jobTitle} />
                </SelectTrigger>
                <SelectContent>
                  {jobTitles.map((title) => (
                    <SelectItem key={title.value} value={title.value}>
                      {locale === "ar" ? title.ar : title.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sign Up Button */}
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
                  <UserPlus className="w-4 h-4" />
                )}
                {mutation.isPending ? (locale === "ar" ? "جاري إنشاء الحساب..." : "Creating account...") : t.signUpButton}
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
                onClick={() => handleOAuthSignup('google')}
                className={`w-full border-[#E6E6E6] text-[#101920] hover:bg-gray-50 py-2 px-4 rounded font-medium transition-colors ${
                  isRTL ? 'font-[Almarai]' : 'font-[Inter]'
                }`}
              >
                <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Chrome className="w-4 h-4" />
                  {t.signUpWithGoogle}
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignup('microsoft')}
                className={`w-full border-[#E6E6E6] text-[#101920] hover:bg-gray-50 py-2 px-4 rounded font-medium transition-colors ${
                  isRTL ? 'font-[Almarai]' : 'font-[Inter]'
                }`}
              >
                <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-4 h-4 bg-[#00BCF2] rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  {t.signUpWithMicrosoft}
                </div>
              </Button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm text-[#666666] ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
              {t.haveAccount}{" "}
              <Link href="/login">
                <span className={`text-[#0C2836] hover:underline font-semibold ${isRTL ? 'font-[Almarai]' : 'font-[Inter]'}`}>
                  {t.signIn}
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