import { useEffect } from 'react';
import useMergedBooksIncremental from './useMergedBooksIncremental';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setLibraryLoading,
  setLibraryBooks,
  setLibraryError,
} from '@/store/librarySlice';
import type HardcoverBook from '@/domain/HardcoverBook';

interface UseLibraryResult {
  data: HardcoverBook[];
  isLoading: boolean;
  isDone: boolean;
  error: Error | null;
}

/**
 * useLibrary
 *
 * Single source of truth for the user's merged library books.
 * - First call (e.g. from useProfilePage) fetches via useMergedBooksIncremental
 *   and stores the result in Redux.
 * - Subsequent calls (ListCard, lists/[id]/page, stats, hall of fame…) read
 *   directly from the Redux store — zero extra network requests.
 * - If the userId changes (e.g. viewing another user's profile) the store is
 *   bypassed and a fresh fetch is triggered.
 */
export default function useLibrary(
  userId?: string,
  pageSize = 50
): UseLibraryResult {
  const dispatch = useAppDispatch();
  const {
    books,
    status,
    userId: cachedUserId,
  } = useAppSelector((s) => s.library);

  const isCacheValid = !!userId && cachedUserId === userId && status === 'done';

  // Only call the incremental hook when we don't have a valid cache
  const {
    data: fetchedBooks,
    isLoading,
    isDone: fetchDone,
    error,
  } = useMergedBooksIncremental(isCacheValid ? undefined : userId, pageSize);

  // Sync fetched result → Redux store
  useEffect(() => {
    if (!userId || isCacheValid) return;

    if (isLoading && status !== 'loading') {
      dispatch(setLibraryLoading(userId));
    }

    if (fetchDone && fetchedBooks.length > 0) {
      dispatch(setLibraryBooks({ books: fetchedBooks, userId }));
    }

    if (error) {
      dispatch(setLibraryError(error.message));
    }
  }, [
    isLoading,
    fetchDone,
    fetchedBooks,
    error,
    userId,
    isCacheValid,
    status,
    dispatch,
  ]);

  if (isCacheValid) {
    return { data: books, isLoading: false, isDone: true, error: null };
  }

  return {
    data: fetchedBooks,
    isLoading,
    isDone: fetchDone,
    error,
  };
}
