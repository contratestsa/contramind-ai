// Simple authentication state management using localStorage
interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  username?: string;
}

const AUTH_KEY = 'contramind_auth';

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
}

export function getAuthUser(): AuthUser | null {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearAuthUser() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('auth-change'));
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}