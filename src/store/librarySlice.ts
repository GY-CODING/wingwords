import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type HardcoverBook from '@/domain/HardcoverBook';

type LibraryStatus = 'idle' | 'loading' | 'done' | 'error';

interface LibraryState {
  books: HardcoverBook[];
  status: LibraryStatus;
  userId: string | null;
  error: string | null;
}

const initialState: LibraryState = {
  books: [],
  status: 'idle',
  userId: null,
  error: null,
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
    },
  },
});

export const {
  setLibraryLoading,
  setLibraryBooks,
  setLibraryError,
  clearLibrary,
} = librarySlice.actions;

export default librarySlice.reducer;
