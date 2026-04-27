import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Friend, User } from '@/domain/friend.model';
import queryUsers from '@/app/actions/accounts/user/fetchUsers';
import addFriend from '@/app/actions/accounts/user/friend/addFriend';
import { Profile } from '@gycoding/nebula';

function profileToUser(profile: Profile, friendIdSet: Set<string>): User {
  return {
    id: profile.id as User['id'],
    username: profile.username,
    phoneNumber: profile.phoneNumber,
    picture: profile.picture,
    biography: profile.biography,
    isFriend: friendIdSet.has(profile.id as string),
  };
}

export function useUserSearch(currentUserId?: string, friends: Friend[] = []) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  // Stable set of friend IDs to avoid infinite re-renders from array reference changes
  const friendIds = friends.map((f) => f.id).join(',');

  useEffect(() => {
    const friendIdSet = new Set(friendIds.split(',').filter(Boolean));
    const fetchUsers = async () => {
      if (debouncedSearch) {
        const formData = new FormData();
        formData.append('username', debouncedSearch);
        const result = await queryUsers(formData);
        setUsers(
          result
            .map((p) => profileToUser(p, friendIdSet))
            .filter((u) => !currentUserId || u.id !== currentUserId)
        );
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [debouncedSearch, currentUserId, friendIds]);

  const handleAddFriend = async (userId: string) => {
    try {
      setIsAddingFriend(true);
      const formData = new FormData();
      formData.append('userId', userId);
      await addFriend(formData);
      setSuccessMessage(true);

      // Actualizar la lista para marcar al usuario como amigo
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFriend: true } : user
        )
      );
    } catch (error) {
      console.error('Error adding friend:', error);
      setErrorMessage(true);
    } finally {
      setIsAddingFriend(false);
    }
  };

  return {
    search,
    setSearch,
    users,
    isAddingFriend,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    handleAddFriend,
  };
}
