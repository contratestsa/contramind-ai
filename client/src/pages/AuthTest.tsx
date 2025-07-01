import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User, Mail, Calendar } from 'lucide-react';

interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  username: string;
  createdAt: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  user?: AuthUser;
  loading: boolean;
  error?: string;
}

export default function AuthTest() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ 
    isAuthenticated: false, 
    loading: true 
  });
  const [testResults, setTestResults] = useState({
    googleRedirect: null as boolean | null,
    microsoftRedirect: null as boolean | null,
  });

  // Check authentication status on page load
  useEffect(() => {
    checkAuthStatus();
    
    // Check URL parameters for auth success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      // Refresh auth status after successful OAuth
      setTimeout(checkAuthStatus, 500);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const data = await response.json();
        setAuthStatus({
          isAuthenticated: true,
          user: data.user,
          loading: false
        });
      } else {
        setAuthStatus({
          isAuthenticated: false,
          loading: false
        });
      }
    } catch (error) {
      setAuthStatus({
        isAuthenticated: false,
        loading: false,
        error: 'Failed to check authentication status'
      });
    }
  };

  const testOAuthRedirect = async (provider: 'google' | 'microsoft') => {
    try {
      const response = await fetch(`/api/auth/${provider}`, {
        method: 'GET',
        redirect: 'manual'
      });
      
      const success = response.status === 302;
      setTestResults(prev => ({
        ...prev,
        [`${provider}Redirect`]: success
      }));
      
      if (success) {
        // Actually redirect to test the flow
        window.location.href = `/api/auth/${provider}`;
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [`${provider}Redirect`]: false
      }));
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthStatus({ isAuthenticated: false, loading: false });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <Clock className="h-4 w-4 text-gray-400" />;
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  if (authStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OAuth Authentication Test
          </h1>
          <p className="text-gray-600">
            Test and verify Google and Microsoft OAuth authentication flows
          </p>
        </div>

        {/* Authentication Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </CardTitle>
            <CardDescription>
              Current user authentication state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={authStatus.isAuthenticated ? "default" : "secondary"}>
                  {authStatus.isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </Badge>
                <StatusIcon status={authStatus.isAuthenticated} />
              </div>
              
              {authStatus.user && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">User Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Name:</span>
                      <span>{authStatus.user.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Email:</span>
                      <span>{authStatus.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Created:</span>
                      <span>{new Date(authStatus.user.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={logout} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                  >
                    Logout
                  </Button>
                </div>
              )}

              {authStatus.error && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-red-800 text-sm">{authStatus.error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OAuth Test Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Google OAuth Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded"></div>
                Google OAuth Test
              </CardTitle>
              <CardDescription>
                Test Google authentication flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Redirect Test:</span>
                  <StatusIcon status={testResults.googleRedirect} />
                </div>
                
                <Button 
                  onClick={() => testOAuthRedirect('google')}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={authStatus.isAuthenticated}
                >
                  {authStatus.isAuthenticated ? 'Already Authenticated' : 'Test Google Login'}
                </Button>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Client ID: 488413842682-bsn4qa2st861c4432l6rceg5msml95cd</p>
                  <p>Redirect: /api/auth/google/callback</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Microsoft OAuth Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded"></div>
                Microsoft OAuth Test
              </CardTitle>
              <CardDescription>
                Test Microsoft authentication flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Redirect Test:</span>
                  <StatusIcon status={testResults.microsoftRedirect} />
                </div>
                
                <Button 
                  onClick={() => testOAuthRedirect('microsoft')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={authStatus.isAuthenticated}
                >
                  {authStatus.isAuthenticated ? 'Already Authenticated' : 'Test Microsoft Login'}
                </Button>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Client ID: 14f5f2ce-738e-4865-99dd-a0028f03b088</p>
                  <p>Redirect: /api/auth/microsoft/callback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click either "Test Google Login" or "Test Microsoft Login"</li>
              <li>You'll be redirected to the respective OAuth provider</li>
              <li>Complete the authentication process</li>
              <li>You'll be redirected back to /coming-soon?auth=success</li>
              <li>Navigate back to this page to see your authentication status</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}