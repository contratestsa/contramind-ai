import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (!response.ok) {
          if (response.status === 401) {
            // Check localStorage as fallback
            const storedAuth = localStorage.getItem('contramind_auth');
            if (storedAuth) {
              return JSON.parse(storedAuth);
            }
            return null;
          }
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        // Update localStorage with fresh data
        if (data.user) {
          localStorage.setItem('contramind_auth', JSON.stringify(data.user));
        }
        return data.user;
      } catch (error) {
        // Check localStorage on any error
        const storedAuth = localStorage.getItem('contramind_auth');
        if (storedAuth) {
          return JSON.parse(storedAuth);
        }
        throw error;
      }
    },
    retry: false
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      localStorage.removeItem('contramind_auth');
      window.location.href = '/';
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate
  };
}