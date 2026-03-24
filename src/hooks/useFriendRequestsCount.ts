import getFriendRequests from '@/app/actions/accounts/user/friend/fetchFriendRequest';
import { UUID } from 'crypto';
import useSWR from 'swr';

interface useFriendRequestsCountProps {
  count: number;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<unknown>;
}

export function useFriendRequestsCount(
  profileId: UUID
): useFriendRequestsCountProps {
  const { data, isLoading, error, mutate } = useSWR(
    profileId ? ['friendRequests', profileId] : null,
    ([, id]) => getFriendRequests(id),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const count = data?.length || 0;

  return {
    count,
    isLoading,
    error,
    mutate,
  };
}
