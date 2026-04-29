/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '@/domain/user.model';
import fetchUser from '@/app/actions/accounts/fetchUser';
import { setProfile } from '@/store/userSlice';
import { SWR_KEYS } from '@/lib/swrKeys';
interface useUserProps {
  data: User | null;
  isLoading: boolean;
  error: Error | null;
}
export function useUser(): useUserProps {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSWR(SWR_KEYS.user, fetchUser, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 30000,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    focusThrottleInterval: 30000,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setProfile(data));
    }
  }, [data, dispatch]);

  return {
    data: data || null,
    isLoading,
    error,
  };
}
