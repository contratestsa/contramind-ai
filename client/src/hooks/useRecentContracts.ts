import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface RecentContract {
  id: number;
  title: string;
  partyName: string;
  type: string;
  status: string;
  date: string;
  riskLevel?: string;
  fileUrl?: string;
  lastViewedAt?: string;
}

export function useRecentContracts(limit = 5) {
  const { data, isLoading } = useQuery<{ contracts: RecentContract[] }>({
    queryKey: ['/api/contracts/recent', limit],
    queryFn: async () => {
      const response = await fetch(`/api/contracts/recent?limit=${limit}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch recent contracts');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 0 // Always fetch fresh data
  });

  const touchMutation = useMutation({
    mutationFn: async (contractId: number) => {
      const response = await fetch('/api/contracts/touch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contractId })
      });
      
      if (!response.ok) throw new Error('Failed to touch contract');
    },
    onSuccess: () => {
      // Invalidate recent contracts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/contracts/recent'] });
    }
  });

  return {
    recent: data?.contracts || [],
    isLoading,
    touch: touchMutation.mutate
  };
}