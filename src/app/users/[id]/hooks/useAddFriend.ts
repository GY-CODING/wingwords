'use client';
import addFriend from '@/app/actions/accounts/user/friend/addFriend';
import deleteFriend from '@/app/actions/accounts/user/friend/deleteFriend';
import { Friend } from '@/domain/friend.model';
import { useFriends } from '@/hooks/useFriends';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface UseAddFriendReturn {
  isFriend: boolean;
  isAdding: boolean;
  isSuccess: boolean;
  isError: boolean;
  isRemoving: boolean;
  isRemoveSuccess: boolean;
  isRemoveError: boolean;
  handleAddFriend: () => Promise<void>;
  handleRemoveFriend: () => Promise<void>;
  setIsSuccess: (v: boolean) => void;
  setIsError: (v: boolean) => void;
  setIsRemoveSuccess: (v: boolean) => void;
  setIsRemoveError: (v: boolean) => void;
}

export function useAddFriend(targetUserId: string): UseAddFriendReturn {
  const { data: friends } = useFriends();
  const { mutate } = useSWRConfig();

  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isRemoving, setIsRemoving] = useState(false);
  const [isRemoveSuccess, setIsRemoveSuccess] = useState(false);
  const [isRemoveError, setIsRemoveError] = useState(false);

  const isFriend = friends?.some((f: Friend) => f.id === targetUserId) ?? false;

  const handleAddFriend = async () => {
    if (isFriend || isAdding) return;
    setIsAdding(true);
    setIsError(false);
    try {
      const formData = new FormData();
      formData.set('userId', targetUserId);
      await addFriend(formData);
      setIsSuccess(true);
      mutate('/api/auth/users/accounts/friends');
    } catch {
      setIsError(true);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!isFriend || isRemoving) return;
    setIsRemoving(true);
    setIsRemoveError(false);
    try {
      await deleteFriend(targetUserId);
      setIsRemoveSuccess(true);
      mutate('/api/auth/users/accounts/friends');
    } catch {
      setIsRemoveError(true);
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    isFriend,
    isAdding,
    isSuccess,
    isError,
    isRemoving,
    isRemoveSuccess,
    isRemoveError,
    handleAddFriend,
    handleRemoveFriend,
    setIsSuccess,
    setIsError,
    setIsRemoveSuccess,
    setIsRemoveError,
  };
}
