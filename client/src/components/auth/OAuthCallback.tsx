import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { storeTokens } from '@/lib/auth';
import { queryClient } from '@/lib/queryClient';

export default function OAuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Extract tokens from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth authentication failed:', error);
      // Redirect to home with error message (no /login route exists)
      setLocation('/?authError=' + error);
      return;
    }

    if (accessToken && refreshToken) {
      // Store the tokens
      storeTokens({
        accessToken,
        refreshToken
      });

      // Invalidate auth queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      // Clear URL parameters and redirect to dashboard
      window.history.replaceState({}, document.title, window.location.pathname);
      setLocation('/dashboard');
    } else {
      // No tokens found, redirect to home
      setLocation('/');
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}