import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useSimpleLanguage } from "@/hooks/useSimpleLanguage";
import { useTypography } from "@/hooks/useTypography";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language, dir } = useSimpleLanguage();
  const typography = useTypography();
  
  const [formData, setFormData] = useState<InsertUser>({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const signupMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("تم إنشاء الحساب بنجاح", "Account Created Successfully"),
        description: t("يمكنك الآن تسجيل الدخول باستخدام بياناتك", "You can now log in with your credentials"),
        variant: "default",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: t("خطأ في إنشاء الحساب", "Signup Error"),
        description: error.message || t("حدث خطأ أثناء إنشاء الحساب", "An error occurred while creating your account"),
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = t("الاسم الكامل مطلوب", "Full name is required");
    }
    
    if (!formData.username.trim()) {
      newErrors.username = t("اسم المستخدم مطلوب", "Username is required");
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t("البريد الإلكتروني مطلوب", "Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("البريد الإلكتروني غير صحيح", "Invalid email format");
    }
    
    if (!formData.password) {
      newErrors.password = t("كلمة المرور مطلوبة", "Password is required");
    } else if (formData.password.length < 6) {
      newErrors.password = t("كلمة المرور يجب أن تكون على الأقل 6 أحرف", "Password must be at least 6 characters");
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = t("تأكيد كلمة المرور مطلوب", "Password confirmation is required");
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = t("كلمات المرور غير متطابقة", "Passwords do not match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      signupMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof InsertUser | 'confirmPassword', value: string) => {
    if (field === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" dir={dir}>
      <div className="max-w-md w-full space-y-8">
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 cursor-pointer"
            >
              <span className="text-2xl font-bold text-white">CM</span>
            </motion.div>
          </Link>
          
          <h2 className={`${typography.headingMedium} text-white mb-2`}>
            {t("إنشاء حساب جديد", "Create Account")}
          </h2>
          
          <p className={`${typography.body} text-white/70`}>
            {t("انضم إلى كونترامايند واكتشف مستقبل التكنولوجيا القانونية", "Join ContraMind and discover the future of legal technology")}
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className={`${typography.bodySemiBold} text-gray-700 flex items-center gap-2`}>
                <User className="w-4 h-4" />
                {t("الاسم الكامل", "Full Name")}
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full bg-[#f0f3f5] border-gray-300 focus:border-[#0c2836] focus:ring-[#0c2836] ${
                  errors.fullName ? "border-red-500" : ""
                }`}
                placeholder={t("أدخل اسمك الكامل", "Enter your full name")}
                disabled={signupMutation.isPending}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className={`${typography.bodySemiBold} text-gray-700`}>
                {t("اسم المستخدم", "Username")}
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full bg-[#f0f3f5] border-gray-300 focus:border-[#0c2836] focus:ring-[#0c2836] ${
                  errors.username ? "border-red-500" : ""
                }`}
                placeholder={t("اختر اسم مستخدم", "Choose a username")}
                disabled={signupMutation.isPending}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`${typography.bodySemiBold} text-gray-700 flex items-center gap-2`}>
                <Mail className="w-4 h-4" />
                {t("البريد الإلكتروني", "Email Address")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full bg-[#f0f3f5] border-gray-300 focus:border-[#0c2836] focus:ring-[#0c2836] ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder={t("أدخل بريدك الإلكتروني", "Enter your email")}
                disabled={signupMutation.isPending}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className={`${typography.bodySemiBold} text-gray-700 flex items-center gap-2`}>
                <Lock className="w-4 h-4" />
                {t("كلمة المرور", "Password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full bg-[#f0f3f5] border-gray-300 focus:border-[#0c2836] focus:ring-[#0c2836] ${dir === 'rtl' ? 'pl-10' : 'pr-10'} ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder={t("أدخل كلمة المرور", "Enter your password")}
                  disabled={signupMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={`${typography.bodySemiBold} text-gray-700 flex items-center gap-2`}>
                <Lock className="w-4 h-4" />
                {t("تأكيد كلمة المرور", "Confirm Password")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full bg-[#f0f3f5] border-gray-300 focus:border-[#0c2836] focus:ring-[#0c2836] ${dir === 'rtl' ? 'pl-10' : 'pr-10'} ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder={t("أعد إدخال كلمة المرور", "Re-enter your password")}
                  disabled={signupMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full bg-[#0c2836] hover:bg-[#1a4a5c] text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {signupMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("جاري إنشاء الحساب...", "Creating account...")}
                </div>
              ) : (
                <>
                  {t("إنشاء حساب", "Create Account")}
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={`${typography.body} text-gray-600`}>
              {t("لديك حساب بالفعل؟", "Already have an account?")}{" "}
              <Link href="/login">
                <a className="font-semibold text-[#0c2836] hover:text-[#1a4a5c]">
                  {t("تسجيل الدخول", "Sign in")}
                </a>
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/">
            <a className="text-white/70 hover:text-white text-sm flex items-center justify-center gap-2">
              {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("العودة إلى الصفحة الرئيسية", "Back to home")}
            </a>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}