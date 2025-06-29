import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User, Building2, Briefcase } from 'lucide-react';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import logoImage from '@assets/RGB_Logo Design - ContraMind (V001)-01 (1)_1749730411676.png';

interface AuthModalsProps {
  triggerLoginButton?: React.ReactNode;
  triggerSignupButton?: React.ReactNode;
}

export default function AuthModals({ triggerLoginButton, triggerSignupButton }: AuthModalsProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { language, t } = useSimpleLanguage();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    acceptTerms: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم تسجيل الدخول بنجاح', 'Login Successful'),
        description: t('مرحباً بك في ContraMind', 'Welcome to ContraMind')
      });
      setIsLoginOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('خطأ في تسجيل الدخول', 'Login Error'),
        description: error.message
      });
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          username: data.email // Use email as username
        })
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم إنشاء الحساب بنجاح', 'Account Created Successfully'),
        description: t('مرحباً بك في ContraMind', 'Welcome to ContraMind')
      });
      setIsSignupOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('خطأ في إنشاء الحساب', 'Signup Error'),
        description: error.message
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        variant: 'destructive',
        title: t('خطأ في البيانات', 'Validation Error'),
        description: t('يرجى ملء جميع الحقول المطلوبة', 'Please fill in all required fields')
      });
      return;
    }
    loginMutation.mutate({ email: loginData.email, password: loginData.password });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('خطأ في البيانات', 'Validation Error'),
        description: t('يرجى ملء جميع الحقول المطلوبة', 'Please fill in all required fields')
      });
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('خطأ في كلمة المرور', 'Password Error'),
        description: t('كلمتا المرور غير متطابقتان', 'Passwords do not match')
      });
      return;
    }
    if (!signupData.acceptTerms) {
      toast({
        variant: 'destructive',
        title: t('موافقة مطلوبة', 'Agreement Required'),
        description: t('يرجى الموافقة على الشروط والأحكام', 'Please accept the terms and conditions')
      });
      return;
    }
    signupMutation.mutate(signupData);
  };

  return (
    <>
      {/* Login Trigger */}
      <div onClick={() => setIsLoginOpen(true)}>
        {triggerLoginButton || (
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/10 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {t('تسجيل الدخول', 'Login')}
          </Button>
        )}
      </div>
      {/* Signup Trigger */}
      <div onClick={() => setIsSignupOpen(true)}>
        {triggerSignupButton || (
          <Button
            size="sm"
            className="bg-white text-[#0c2836] hover:bg-white/90 flex items-center gap-2 font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            {t('إنشاء حساب', 'Sign Up')}
          </Button>
        )}
      </div>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-md mx-auto bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#0c2836] rounded-xl flex items-center justify-center">
                <img src={logoImage} alt="ContraMind" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-[#0c2836] mb-2 text-center">
              {t('تسجيل الدخول', 'Sign In')}
            </DialogTitle>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 text-center">
                {t('مرحباً بعودتك إلى ContraMind', 'Welcome back to ContraMind')}
              </p>
              <p className="text-xs text-gray-500 text-center">
                {t('مستقبل القانون، مدعوم بالذكاء الاصطناعي', 'The Future of Law, Powered by AI')}
              </p>
            </div>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('عنوان البريد الإلكتروني', 'Email Address')}
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
                className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('كلمة المرور', 'Password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder={t('أدخل كلمة المرور', 'Enter your password')}
                  className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginData.rememberMe}
                  onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                {t('تذكرني', 'Remember me')}
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('نسيت كلمة المرور؟', 'Forgot your password?')}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#B7DEE8] hover:bg-[#9CD3E0] text-[#0c2836] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loginMutation.isPending ? t('جاري تسجيل الدخول...', 'Signing in...') : t('تسجيل الدخول', 'Sign In')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('أو استمر مع', 'Or continue with')}
              </p>
              <div className="flex gap-3 mt-3">
                <Button variant="outline" className="flex-1 py-2 bg-[#0c2836] text-white border-[#0c2836] hover:bg-[#1a3a4a]">
                  Google
                </Button>
                <Button variant="outline" className="flex-1 py-2 bg-[#0c2836] text-white border-[#0c2836] hover:bg-[#1a3a4a]">
                  Microsoft
                </Button>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {t('ليس لديك حساب؟', "Don't have an account?")}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsSignupOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('إنشاء حساب', 'Create account')}
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="max-w-md mx-auto bg-white rounded-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#0c2836] rounded-xl flex items-center justify-center">
                <img src={logoImage} alt="ContraMind" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-[#0c2836] mb-2 text-center">
              {t('إنشاء حساب', 'Create Account')}
            </DialogTitle>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 text-center">
                {t('انضم إلى ContraMind واكتشف مستقبل التكنولوجيا القانونية', 'Join ContraMind and discover the future of legal technology')}
              </p>
              <p className="text-xs text-gray-500 text-right">
                {t('مستقبل القانون، مدعوم بالذكاء الاصطناعي', 'The Future of Law, Powered by AI')}
              </p>
            </div>
          </DialogHeader>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('الاسم الكامل', 'Full Name')}
              </label>
              <input
                type="text"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('عنوان البريد الإلكتروني', 'Email Address')}
              </label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
                className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('كلمة المرور', 'Password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder={t('أدخل كلمة مرور قوية', 'Enter a strong password')}
                  className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('تأكيد كلمة المرور', 'Confirm Password')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  placeholder={t('أعد إدخال كلمة المرور', 'Re-enter your password')}
                  className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {t('الشركة', 'Company')}
                </label>
                <input
                  type="text"
                  value={signupData.company}
                  onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                  placeholder={t('اختياري', 'Optional')}
                  className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0c2836] flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {t('المسمى الوظيفي', 'Job Title')}
                </label>
                <input
                  type="text"
                  value={signupData.jobTitle}
                  onChange={(e) => setSignupData({ ...signupData, jobTitle: e.target.value })}
                  placeholder={t('اختياري', 'Optional')}
                  className="w-full px-4 py-3 bg-[#0c2836] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={signupData.acceptTerms}
                onChange={(e) => setSignupData({ ...signupData, acceptTerms: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                required
              />
              <label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-relaxed">
                {t(
                  'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بـ ContraMind',
                  'I agree to ContraMind\'s Terms of Service and Privacy Policy'
                )}
              </label>
            </div>

            <Button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full bg-[#B7DEE8] hover:bg-[#9CD3E0] text-[#0c2836] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {signupMutation.isPending ? t('جاري إنشاء الحساب...', 'Creating account...') : t('إنشاء حساب', 'Create Account')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('أو استمر مع', 'Or continue with')}
              </p>
              <div className="flex gap-3 mt-3">
                <Button variant="outline" className="flex-1 py-2 bg-[#0c2836] text-white border-[#0c2836] hover:bg-[#1a3a4a]">
                  Google
                </Button>
                <Button variant="outline" className="flex-1 py-2 bg-[#0c2836] text-white border-[#0c2836] hover:bg-[#1a3a4a]">
                  Microsoft
                </Button>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignupOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('تسجيل الدخول', 'Sign in')}
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}