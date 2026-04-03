import useSWR, { useSWRConfig } from 'swr';
import { BookList } from '@/domain/list.model';
import {
  getListById,
  addBookToList,
  removeBookFromList,
  deleteList as deleteListAction,
  updateList as updateListAction,
} from '@/app/actions/accounts/user/lists/lists';

interface UseListReturn {
  list: BookList | null;
  isLoading: boolean;
  error: Error | null;
  addBook: (bookId: string) => Promise<void>;
  reorderBooks: (orderedBookIds: string[]) => Promise<void>;
  updateMeta: (payload: {
    name?: string;
    description?: string;
  }) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
  deleteList: () => Promise<void>;
}

export function useList(id: string | null): UseListReturn {
  const cacheKey = id ? `/api/auth/lists/${id}` : null;

  const { data, isLoading, error } = useSWR<BookList>(
    cacheKey,
    () => getListById(id!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 30_000,
      keepPreviousData: true,
    }
  );

  const { mutate } = useSWRConfig();

  const addBook = async (bookId: string) => {
    if (!id) return;
    await addBookToList(id, bookId);
    await mutate(cacheKey);
  };

  const reorderBooks = async (orderedBookIds: string[]) => {
    if (!id || !data) return;
    // Use the list-level PATCH — must include name, description, and all books
    const books = orderedBookIds.map((bookId, index) => ({
      bookId,
      order: index,
    }));
    try {
      const updated = await updateListAction({
        id,
        name: data.name,
        description: data.description,
        books,
      });
      await mutate(cacheKey, updated, { revalidate: false });
    } catch {
      await mutate(cacheKey);
    }
  };

  const updateMeta = async (payload: {
    name?: string;
    description?: string;
  }) => {
    if (!id) return;
    // Must include the current books array — the GY API wipes books if omitted
    const books =
      data?.books.map((b, index) => ({
        bookId: b.id,
        order: b.order ?? index,
      })) ?? [];
    const updated = await updateListAction({ id, ...payload, books });
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
    reorderBooks,
    updateMeta,
    removeBook,
    deleteList: async () => {
      if (!id) return;
      await deleteListAction(id);
      await mutate(cacheKey, undefined, { revalidate: false });
    },
  };
}
