/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import getAccountsUser from '@/app/actions/accounts/user/fetchAccountsUser';
import getFriendRequests from '@/app/actions/accounts/user/friend/fetchFriendRequest';
import manageRequest from '@/app/actions/accounts/user/friend/handleRequest';
import { FriendRequest, User } from '@/domain/friend.model';
import { ECommands } from '@/utils/constants/ECommands';
import { UUID } from 'crypto';
import React, { useState } from 'react';
import useSWR from 'swr';

// Extended interface that combines FriendRequest with User data
type FriendRequestWithUser = {
  id: string;
  from: string;
  to: string;
  user: User | null;
};

interface useFriendRequestsProps {
  data: FriendRequest[] | undefined;
  isLoading: boolean;
  error: Error | null;
  profilesID: UUID[] | undefined;
  users: User[] | undefined;
  isLoadingUsers: boolean;
  friendRequestsWithUsers: FriendRequestWithUser[] | undefined;
  count: number;
  handleManageRequest: (requestId: string, command: ECommands) => Promise<void>;
  isLoadingManageRequest: (requestId: string) => boolean;
  errorManageRequest: boolean;
  setErrorManageRequest: (error: boolean) => void;
  setIsLoadingManageRequest: (isLoading: boolean) => void;
  isSuccessManageRequest: boolean;
  setIsSuccessManageRequest: (isSuccess: boolean) => void;
}

export function useFriendRequests(profileId: UUID): useFriendRequestsProps {
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(
    new Set()
  );
  const [errorManageRequest, setErrorManageRequest] = useState<boolean>(false);
  const [isSuccessManageRequest, setIsSuccessManageRequest] =
    useState<boolean>(false);

  const {
    data,
    isLoading,
    error,
    mutate: mutateRequests,
  } = useSWR(
    profileId ? ['friendRequests', profileId] : null,
    ([, id]) => getFriendRequests(id),
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000,
    }
  );

  const {
    data: users,
    isLoading: isLoadingUsers,
    mutate: mutateUsers,
  } = useSWR(
    data ? ['getAccountsUsers', data.map((r) => r.from)] : null,
    async ([, ids]) => Promise.all(ids.map(getAccountsUser)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
    }
  );

  const friendRequestsWithUsers: FriendRequestWithUser[] | undefined =
    React.useMemo(() => {
      if (!data || !users || data.length !== users.length) {
        return undefined;
      }

      return data.map((request, index) => ({
        ...request,
        user: users[index],
      }));
    }, [data, users]);

  const handleManageRequest = async (requestId: string, command: ECommands) => {
    setLoadingRequests((prev) => new Set(prev).add(requestId));
    setErrorManageRequest(false);
    setIsSuccessManageRequest(false);

    // Optimistic: eliminar la solicitud de la lista de inmediato
    await mutateRequests(
      (current: FriendRequest[] | undefined) =>
        current?.filter((r) => r.id !== requestId),
      { revalidate: false }
    );

    try {
      const formData = new FormData();
      formData.append('requestId', requestId);
      formData.append('command', command);
      await manageRequest(formData);
      setIsSuccessManageRequest(true);
      // Sincronizar con el servidor
      await Promise.all([mutateRequests(), mutateUsers()]);
    } catch (error: any) {
      setErrorManageRequest(true);
      console.error(error);
      setIsSuccessManageRequest(false);
      // Rollback: revalidar desde el servidor
      await Promise.all([mutateRequests(), mutateUsers()]);
    } finally {
      setLoadingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const isLoadingManageRequest = (requestId: string) => {
    return loadingRequests.has(requestId);
  };

  return {
    data,
    isLoading,
    error,
    profilesID: data?.map((r) => r.from) as UUID[] | undefined,
    users: users as User[] | undefined,
    isLoadingUsers,
    friendRequestsWithUsers,
    count: data?.length || 0,
    handleManageRequest,
    isLoadingManageRequest,
    errorManageRequest,
    setErrorManageRequest,
    setIsLoadingManageRequest: () => {},
    isSuccessManageRequest,
    setIsSuccessManageRequest,
  };
}
