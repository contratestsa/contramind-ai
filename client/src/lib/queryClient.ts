import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAccessToken, refreshAccessToken, isTokenExpired, clearTokens } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Get authorization headers, refreshing token if needed
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  let token = getAccessToken();
  
  if (token && isTokenExpired(token)) {
    // Try to refresh the token
    const newTokens = await refreshAccessToken();
    if (newTokens) {
      token = newTokens.accessToken;
    } else {
      // Refresh failed, clear tokens and redirect to login
      clearTokens();
      window.location.href = '/login';
      return {};
    }
  }
  
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  
  const res = await fetch(url, {
    method,
    headers: {
      ...authHeaders,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  // Handle token expiration
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      const newAuthHeaders = await getAuthHeaders();
      const retryRes = await fetch(url, {
        method,
        headers: {
          ...newAuthHeaders,
          ...(data ? { "Content-Type": "application/json" } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      await throwIfResNotOk(retryRes);
      return retryRes;
    } else {
      // Refresh failed, clear tokens and redirect to login
      clearTokens();
      window.location.href = '/login';
    }
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const authHeaders = await getAuthHeaders();
    
    const res = await fetch(queryKey[0] as string, {
      headers: authHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Handle token expiration
    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        const newAuthHeaders = await getAuthHeaders();
        const retryRes = await fetch(queryKey[0] as string, {
          headers: newAuthHeaders,
        });
        
        if (unauthorizedBehavior === "returnNull" && retryRes.status === 401) {
          return null;
        }
        
        await throwIfResNotOk(retryRes);
        return await retryRes.json();
      } else {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
      }
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
