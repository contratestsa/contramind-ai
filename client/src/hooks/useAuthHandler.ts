// Simple OAuth handler that runs on page load
export function handleOAuthResponse() {
  const urlParams = new URLSearchParams(window.location.search);
  const authStatus = urlParams.get('auth');
  const error = urlParams.get('error');

  if (authStatus === 'success') {
    console.log('OAuth authentication successful');
    alert('تم تسجيل الدخول بنجاح / Login Successful');
    // Clean up URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    // Reload to update user state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  if (error) {
    console.error('OAuth authentication failed:', error);
    alert('فشل في تسجيل الدخول / Authentication Failed');
    // Clean up URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}