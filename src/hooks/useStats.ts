/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';
import { UUID } from 'crypto';
import getStats from '@/service/stats.service';
import { SWR_KEYS } from '@/lib/swrKeys';

interface UseStatsResult<T> {
  data?: T;
  isLoading: boolean;
  error?: Error;
}

export function useStats(id: UUID | null): UseStatsResult<any> {
  const { data, error, isLoading } = useSWR(
    id ? SWR_KEYS.stats(id) : null,
    () => (id ? getStats(id) : Promise.resolve(undefined)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
    }
  );

  return { data, isLoading, error };
}
