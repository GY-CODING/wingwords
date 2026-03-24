import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import { RootState } from '@/store';
import { setStatsLoading, setStats, setStatsError } from '@/store/statsSlice';
import getStats from '@/service/stats.service';
import { UUID } from 'crypto';

export function useStatsPreFetch(userId: UUID | undefined) {
  const dispatch = useDispatch();
  const { userId: storedUserId } = useSelector(
    (state: RootState) => state.stats
  );

  const { data, error, isLoading } = useSWR(
    userId && userId !== storedUserId
      ? `/api/public/accounts/${userId}/books/stats`
      : null,
    () => getStats(userId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    if (isLoading) dispatch(setStatsLoading());
    if (data) dispatch(setStats({ data, userId: userId! }));
    if (error) dispatch(setStatsError(error.message));
  }, [data, error, isLoading, dispatch, userId]);
}
