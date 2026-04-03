import fetchHallOfFame from '@/app/actions/book/halloffame/fetchHallOfFame';
import useSWR from 'swr';

/**
 * Hook ligero que solo extrae la quote del usuario desde el endpoint de Hall of Fame.
 * A diferencia de useHallOfFame, NO dispara useHardcoverBatch, por lo que
 * es ideal para usarlo en el dashboard donde solo se necesita la frase.
 */
export function useUserQuote(userId: string): {
  quote: string;
  isLoading: boolean;
} {
  const { data, isLoading } = useSWR(
    userId ? `/api/public/accounts/halloffame/${userId}` : null,
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
