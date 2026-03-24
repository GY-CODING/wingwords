/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';
import { useStats } from './useStats';

// Mock SWR
jest.mock('swr');

import useSWR from 'swr';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe('useStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state with undefined data', () => {
    const mockStats = { totalBooks: 10, totalPages: 1000 };

    mockUseSWR.mockReturnValue({
      data: mockStats,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useStats('user-123' as any));

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useStats('user-123' as any));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch stats');

    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useStats('user-123' as any));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it('should call getStats with correct userId', () => {
    const userId = 'user-123' as any;

    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useStats(userId));

    expect(mockUseSWR).toHaveBeenCalledWith(
      `/api/public/accounts/${userId}/books/stats`,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should not fetch when userId is empty', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useStats('' as any));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should not fetch when userId is null', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useStats(null));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should handle undefined userId', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    // @ts-expect-error - Testing with undefined
    renderHook(() => useStats(undefined));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should return undefined data when no stats are found', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useStats('user-123' as any));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle successful data fetching with complex stats', () => {
    const mockStats = {
      totalBooks: 25,
      totalPages: 5000,
      averageRating: 4.2,
      booksByGenre: {
        Fiction: 15,
        'Non-Fiction': 10,
      },
      readingStreak: 7,
      favoriteAuthor: 'Test Author',
    };

    mockUseSWR.mockReturnValue({
      data: mockStats,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useStats('user-123' as any));

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle empty stats object', () => {
    const mockStats = {};

    mockUseSWR.mockReturnValue({
      data: mockStats,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useStats('user-123' as any));

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
