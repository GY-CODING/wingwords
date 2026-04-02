import useSWR, { useSWRConfig } from 'swr';
import { BookList } from '@/domain/list.model';
import {
  getListById,
  addBookToList,
  updateBookInList,
  removeBookFromList,
  updateList as updateListAction,
} from '@/app/actions/accounts/user/lists/lists';

interface UseListReturn {
  list: BookList | null;
  isLoading: boolean;
  error: Error | null;
  addBook: (bookId: string, order?: number) => Promise<void>;
  updateBook: (bookId: string, order: number) => Promise<void>;
  updateMeta: (payload: {
    name?: string;
    description?: string;
  }) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
}

export function useList(id: string | null): UseListReturn {
  const cacheKey = id ? `/api/auth/lists/${id}` : null;

  const { data, isLoading, error } = useSWR<BookList>(
    cacheKey,
    () => getListById(id!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const { mutate } = useSWRConfig();

  const addBook = async (bookId: string, order?: number) => {
    if (!id) return;
    const updated = await addBookToList(id, bookId, order);
    await mutate(cacheKey, updated, { revalidate: false });
  };

  const updateBook = async (bookId: string, order: number) => {
    if (!id) return;
    const updated = await updateBookInList(id, bookId, order);
    await mutate(cacheKey, updated, { revalidate: false });
  };

  const updateMeta = async (payload: {
    name?: string;
    description?: string;
  }) => {
    if (!id) return;
    const updated = await updateListAction({ id, ...payload });
    await mutate(cacheKey, updated, { revalidate: false });
  };

  const removeBook = async (bookId: string) => {
    if (!id) return;
    // Optimistic remove
    await mutate(
      cacheKey,
      (current: BookList | undefined) =>
        current
          ? { ...current, books: current.books.filter((b) => b.id !== bookId) }
          : current,
      { revalidate: false }
    );
    try {
      await removeBookFromList(id, bookId);
      await mutate(cacheKey);
    } catch {
      await mutate(cacheKey);
    }
  };

  return {
    list: data ?? null,
    isLoading,
    error: error ?? null,
    addBook,
    updateBook,
    updateMeta,
    removeBook,
  };
}
