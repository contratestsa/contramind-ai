import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginData } from "@shared/schema";
import { useSimpleLanguage } from "@/hooks/useSimpleLanguage";
import { useTypography } from "@/hooks/useTypography";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language, dir } = useSimpleLanguage();
  const typography = useTypography();
  
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("تم تسجيل الدخول بنجاح", "Login Successful"),
        description: t("مرحباً بك في كونترامايند", "Welcome to ContraMind"),
        variant: "default",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: t("خطأ في تسجيل الدخول", "Login Error"),
        description: error.message || t("البريد الإلكتروني أو كلمة المرور غير صحيحة", "Invalid email or password"),
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
          newErrors.email = t("يرجى إدخال بريد إلكتروني صحيح", "Please enter a valid email");
        }
        if (error.path[0] === "password") {
          newErrors.password = t("كلمة المرور يجب أن تكون على الأقل 6 أحرف", "Password must be at least 6 characters");
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
    <div className="min-h-screen bg-gradient-to-br from-[#0c2836] via-[#1a4a5c] to-[#2c6b7a] flex items-center justify-center px-4 sm:px-6 lg:px-8" dir={dir}>
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
            {t("تسجيل الدخول", "Sign In")}
          </h2>
          
          <p className={`${typography.body} text-white/70`}>
            {t("مرحباً بك مرة أخرى في كونترامايند", "Welcome back to ContraMind")}
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={loginMutation.isPending}
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
                  disabled={loginMutation.isPending}
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

            {/* Forgot Password Link */}
            <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
              <Link href="/forgot-password">
                <a className="text-sm text-[#0c2836] hover:text-[#1a4a5c] font-medium">
                  {t("نسيت كلمة المرور؟", "Forgot your password?")}
                </a>
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#0c2836] hover:bg-[#1a4a5c] text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("جاري تسجيل الدخول...", "Signing in...")}
                </div>
              ) : (
                <>
                  {t("تسجيل الدخول", "Sign In")}
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`${typography.body} text-gray-600`}>
              {t("ليس لديك حساب؟", "Don't have an account?")}{" "}
              <Link href="/signup">
                <a className="font-semibold text-[#0c2836] hover:text-[#1a4a5c]">
                  {t("إنشاء حساب جديد", "Create account")}
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