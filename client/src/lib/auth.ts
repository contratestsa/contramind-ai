// JWT Token Management
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Store JWT tokens in localStorage
 */
export function storeTokens(tokens: TokenPair): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Get the access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get the refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear all tokens from localStorage
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<TokenPair | null> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const tokens = await response.json();
    storeTokens(tokens);
    return tokens;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearTokens();
    return null;
  }
}

/**
 * Parse JWT token to get payload
 */
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  // Check if token expires in less than 1 minute
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  return expirationTime - currentTime < 60000; // 1 minute buffer
}

/**
 * Get Authorization header with JWT token
 */
export function getAuthHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}