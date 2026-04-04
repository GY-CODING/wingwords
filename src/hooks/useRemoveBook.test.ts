/* eslint-disable react/no-children-prop */
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRemoveBook } from './useRemoveBook';
import libraryReducer from '@/store/librarySlice';

// Mock the removeBook function
jest.mock('@/app/actions/book/removeBook');
// Mock swr global mutate
jest.mock('swr', () => ({
  ...jest.requireActual('swr'),
  mutate: jest.fn(),
}));

import removeBook from '@/app/actions/book/removeBook';

const mockRemoveBook = removeBook as jest.MockedFunction<typeof removeBook>;

function createWrapper() {
  const store = configureStore({ reducer: { library: libraryReducer } });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store, children });
  }
  return Wrapper;
}

describe('useRemoveBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isSuccess).toBe(false);
    expect(typeof result.current.handleDeleteBook).toBe('function');
    expect(typeof result.current.setIsSuccess).toBe('function');
    expect(typeof result.current.setError).toBe('function');
    expect(typeof result.current.setIsLoading).toBe('function');
  });

  it('should handle successful book deletion', async () => {
    const mockBookId = 'book-123';
    const mockMutate = jest.fn();

    mockRemoveBook.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDeleteBook(mockBookId, mockMutate);
    });

    expect(mockRemoveBook).toHaveBeenCalledWith(mockBookId);
    expect(mockMutate).toHaveBeenCalledWith(null, { revalidate: false });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle book deletion error', async () => {
    const mockBookId = 'book-123';
    const mockError = new Error('Failed to delete book');
    const mockMutate = jest.fn();

    mockRemoveBook.mockRejectedValue(mockError);

    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDeleteBook(mockBookId, mockMutate);
    });

    expect(mockRemoveBook).toHaveBeenCalledWith(mockBookId);
    expect(mockMutate).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it('should handle book deletion without mutate callback', async () => {
    const mockBookId = 'book-456';

    mockRemoveBook.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDeleteBook(mockBookId);
    });

    expect(mockRemoveBook).toHaveBeenCalledWith(mockBookId);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should set loading to true during deletion', async () => {
    const mockBookId = 'book-789';

    // Mock a delayed response
    mockRemoveBook.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );

    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    // Start the async operation without awaiting immediately
    let deletePromise: Promise<void>;
    act(() => {
      deletePromise = result.current.handleDeleteBook(mockBookId);
    });

    // Check loading state during operation
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(null);

    // Wait for completion
    await act(async () => {
      await deletePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should allow manual state updates', () => {
    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setIsSuccess(true);
    });

    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.setError(new Error('Manual error'));
    });

    expect(result.current.error).toEqual(new Error('Manual error'));

    act(() => {
      result.current.setIsLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should reset states between operations', async () => {
    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    // First operation - error
    const mockError = new Error('First error');
    mockRemoveBook.mockRejectedValueOnce(mockError);

    await act(async () => {
      await result.current.handleDeleteBook('book-1');
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isSuccess).toBe(false);

    // Second operation - success
    mockRemoveBook.mockResolvedValueOnce(undefined);

    await act(async () => {
      await result.current.handleDeleteBook('book-2');
    });

    expect(result.current.error).toBe(null);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle multiple concurrent deletions', async () => {
    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    mockRemoveBook.mockResolvedValue(undefined);

    await act(async () => {
      await Promise.all([
        result.current.handleDeleteBook('book-1'),
        result.current.handleDeleteBook('book-2'),
      ]);
    });

    expect(mockRemoveBook).toHaveBeenCalledWith('book-1');
    expect(mockRemoveBook).toHaveBeenCalledWith('book-2');
    expect(mockRemoveBook).toHaveBeenCalledTimes(2);
  });

  it('should handle empty book id', async () => {
    mockRemoveBook.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRemoveBook(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleDeleteBook('');
    });

    expect(mockRemoveBook).toHaveBeenCalledWith('');
    expect(result.current.isSuccess).toBe(true);
  });
});
