import fetchHallOfFame from '@/app/actions/book/halloffame/fetchHallOfFame';
import { SWR_KEYS } from '@/lib/swrKeys';
import useSWR from 'swr';

export function useUserQuote(userId: string): {
  quote: string;
  isLoading: boolean;
} {
  const { data, isLoading } = useSWR(
    userId ? SWR_KEYS.hallOfFame(userId) : null,
    () => fetchHallOfFame(userId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    quote: data?.quote || '',
    isLoading,
  };
}
