import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type HardcoverBook from '@/domain/HardcoverBook';

/** Tiempo de vida del cache de librería en ms (5 minutos) */
const LIBRARY_CACHE_TTL_MS = 5 * 60 * 1000;

type LibraryStatus = 'idle' | 'loading' | 'done' | 'error';

interface LibraryState {
  books: HardcoverBook[];
  status: LibraryStatus;
  userId: string | null;
  error: string | null;
  cachedAt: number | null;
}

const initialState: LibraryState = {
  books: [],
  status: 'idle',
  userId: null,
  error: null,
  cachedAt: null,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibraryLoading(state, action: PayloadAction<string>) {
      state.status = 'loading';
      state.userId = action.payload;
      state.error = null;
    },
    setLibraryBooks(
      state,
      action: PayloadAction<{ books: HardcoverBook[]; userId: string }>
    ) {
      state.books = action.payload.books;
      state.userId = action.payload.userId;
      state.status = 'done';
      state.error = null;
      state.cachedAt = Date.now();
    },
    setLibraryError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    clearLibrary(state) {
      state.books = [];
      state.status = 'idle';
      state.userId = null;
      state.error = null;
      state.cachedAt = null;
    },
    invalidateLibrary(state) {
      state.cachedAt = null;
    },
  },
});

export const {
  setLibraryLoading,
  setLibraryBooks,
  setLibraryError,
  clearLibrary,
  invalidateLibrary,
} = librarySlice.actions;

/** Selector que comprueba si el cache sigue siendo válido */
export const selectIsLibraryCacheValid = (
  state: { library: LibraryState },
  userId: string | null
): boolean => {
  const { library } = state;
  if (!userId || library.userId !== userId || library.status !== 'done')
    return false;
  if (!library.cachedAt) return false;
  return Date.now() - library.cachedAt < LIBRARY_CACHE_TTL_MS;
};

export default librarySlice.reducer;
