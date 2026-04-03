'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { User } from '@/domain/user.model';
import useSWR from 'swr';
import fetchUser from '@/app/actions/accounts/fetchUser';

interface GyCodingUserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

const GyCodingUserContext = createContext<GyCodingUserContextType>({
  user: null,
  isLoading: true,
  error: null,
});

export const useGyCodingUser = () => useContext(GyCodingUserContext);

export const GyCodingUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR('/api/auth/get', fetchUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
    errorRetryCount: 3,
  });

  const contextValue = useMemo(
    () => ({ user: user || null, isLoading, error }),
    [user, isLoading, error]
  );

  return (
    <GyCodingUserContext.Provider value={contextValue}>
      {children}
    </GyCodingUserContext.Provider>
  );
};
