import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
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

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم تسجيل الدخول بنجاح', 'Login Successful'),
        description: t('مرحباً بك في ContraMind', 'Welcome to ContraMind')
      });
      setIsLoginOpen(false);
      setLoginData({ email: '', password: '', rememberMe: false });
    },
    onError: (error: Error) => {
      toast({
        title: t('خطأ في تسجيل الدخول', 'Login Error'),
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('تم إنشاء الحساب بنجاح', 'Account Created Successfully'),
        description: t('يمكنك الآن تسجيل الدخول', 'You can now sign in')
      });
      setIsSignupOpen(false);
      setIsLoginOpen(true);
      setSignupData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        jobTitle: '',
        acceptTerms: false
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('خطأ في إنشاء الحساب', 'Signup Error'),
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email: loginData.email,
      password: loginData.password
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: t('خطأ في كلمة المرور', 'Password Error'),
        description: t('كلمتا المرور غير متطابقتين', 'Passwords do not match'),
        variant: "destructive"
      });
      return;
    }

    if (!signupData.acceptTerms) {
      toast({
        title: t('الموافقة مطلوبة', 'Agreement Required'),
        description: t('يرجى الموافقة على الشروط والأحكام', 'Please accept the terms and conditions'),
        variant: "destructive"
      });
      return;
    }

    signupMutation.mutate({
      fullName: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
      username: signupData.email // Use email as username
    });
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
            <DialogTitle className="tracking-tight text-2xl font-bold text-[#0c2836] text-center">
              {t('تسجيل الدخول', 'Sign In')}
            </DialogTitle>
            <p className="text-gray-600 mt-2 text-center">
              {t('أدخل بياناتك للوصول إلى حسابك', 'Enter your credentials to access your account')}
            </p>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('البريد الإلكتروني', 'Email')}
              </Label>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder={t('أدخل البريد الإلكتروني', 'Enter your email')}
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('كلمة المرور', 'Password')}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder={t('أدخل كلمة المرور', 'Enter your password')}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] focus:outline-none focus:ring-4 focus:ring-[#B7DEE8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loginMutation.isPending ? t('جاري تسجيل الدخول...', 'Signing in...') : t('تسجيل الدخول', 'Sign In')}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('أو استمر مع', 'Or continue with')}
              </p>
              <div className="flex gap-3 mt-3">
                <a 
                  href="/api/auth/google"
                  className="flex-1 h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] flex items-center justify-center no-underline"
                >
                  Google
                </a>
                <a 
                  href="/api/auth/microsoft"
                  className="flex-1 h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] flex items-center justify-center no-underline"
                >
                  Microsoft
                </a>
              </div>
            </div>

            <div className="text-center pt-4">
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
            <DialogTitle className={`text-2xl font-bold text-[#0c2836] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('إنشاء حساب جديد', 'Create New Account')}
            </DialogTitle>
            <p className={`text-gray-600 mt-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('انضم إلى ContraMind اليوم', 'Join ContraMind today')}
            </p>
          </DialogHeader>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('الاسم الكامل', 'Full Name')}
              </Label>
              <Input
                type="text"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('البريد الإلكتروني', 'Email')}
              </Label>
              <Input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder={t('أدخل البريد الإلكتروني', 'Enter your email')}
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('كلمة المرور', 'Password')}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder={t('أدخل كلمة المرور', 'Enter your password')}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('تأكيد كلمة المرور', 'Confirm Password')}
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  placeholder={t('أعد إدخال كلمة المرور', 'Re-enter your password')}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={signupData.acceptTerms}
                onChange={(e) => setSignupData({ ...signupData, acceptTerms: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
                {t(
                  'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بـ ContraMind',
                  'I agree to ContraMind\'s Terms of Service and Privacy Policy'
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] focus:outline-none focus:ring-4 focus:ring-[#B7DEE8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {signupMutation.isPending ? t('جاري إنشاء الحساب...', 'Creating account...') : t('إنشاء حساب', 'Create Account')}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('أو استمر مع', 'Or continue with')}
              </p>
              <div className="flex gap-3 mt-3">
                <a 
                  href="/api/auth/google"
                  className="flex-1 h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] flex items-center justify-center no-underline"
                >
                  Google
                </a>
                <a 
                  href="/api/auth/microsoft"
                  className="flex-1 h-14 bg-[#0C2836] text-white font-medium text-lg rounded-full transition-colors duration-200 hover:bg-[#2b4f62] flex items-center justify-center no-underline"
                >
                  Microsoft
                </a>
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