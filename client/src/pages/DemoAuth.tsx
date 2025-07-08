import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function DemoAuth() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Set demo user in localStorage
    const demoUser = {
      id: 19,
      email: "demo@contramind.ai",
      fullName: "Demo User",
      username: "demo@contramind.ai",
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('contramind_auth', JSON.stringify(demoUser));
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate('/user-dashboard');
    }, 100);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up demo authentication...</p>
      </div>
    </div>
  );
}