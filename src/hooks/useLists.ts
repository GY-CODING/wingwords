import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';
import { BookList } from '@/domain/list.model';
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from '@/app/actions/accounts/user/lists/lists';

const LISTS_KEY = '/api/auth/lists';

interface UseListsReturn {
  lists: BookList[];
  isLoading: boolean;
  error: Error | null;
  isCreating: boolean;
  isDeleting: boolean;
  createList: (payload: {
    name: string;
    description?: string;
  }) => Promise<BookList | null>;
  updateList: (payload: {
    id: string;
    name?: string;
    description?: string;
  }) => Promise<BookList | null>;
  deleteList: (id: string) => Promise<void>;
}

export function useLists(): UseListsReturn {
  const { data, isLoading, error } = useSWR<BookList[]>(LISTS_KEY, getLists, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 30_000,
  });

  const { mutate } = useSWRConfig();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateList = async (payload: {
    name: string;
    description?: string;
  }): Promise<BookList | null> => {
    setIsCreating(true);
    try {
      const created = await createList(payload);
      await mutate(LISTS_KEY);
      return created;
    } catch {
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateList = async (payload: {
    id: string;
    name?: string;
    description?: string;
  }): Promise<BookList | null> => {
    try {
      const updated = await updateList(payload);
      await mutate(LISTS_KEY);
      return updated;
    } catch {
      return null;
    }
  };

  const handleDeleteList = async (id: string): Promise<void> => {
    setIsDeleting(true);
    // Optimistic update
    await mutate(
      LISTS_KEY,
      (current: BookList[] | undefined) =>
        current?.filter((l) => l.id !== (id as unknown)),
      { revalidate: false }
    );
    try {
      await deleteList(id);
      await mutate(LISTS_KEY);
    } catch {
      await mutate(LISTS_KEY);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    lists: data ?? [],
    isLoading,
    error: error ?? null,
    isCreating,
    isDeleting,
    createList: handleCreateList,
    updateList: handleUpdateList,
    deleteList: handleDeleteList,
  };
}
