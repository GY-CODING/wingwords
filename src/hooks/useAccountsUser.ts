/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { User } from '@/domain/friend.model';
import getAccountsUser from '@/app/actions/accounts/user/fetchAccountsUser';
import { SWR_KEYS } from '@/lib/swrKeys';

interface useBookProps {
  data: User | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAccountsUser(id: string): useBookProps {
  const { data, isLoading, error } = useSWR(
    id ? SWR_KEYS.accountsUser(id) : null,
    () => getAccountsUser(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data || null,
    isLoading,
    error,
  };
}
