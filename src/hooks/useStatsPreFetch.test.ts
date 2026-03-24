import { renderHook } from '@testing-library/react';
import { useStatsPreFetch } from './useStatsPreFetch';
import { UUID } from 'crypto';

// Mock SWR
jest.mock('swr');

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock getStats
jest.mock('@/service/stats.service');

import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

// Helper function to create complete SWR mock
const createSWRMock = (
  data: unknown,
  error: Error | null = null,
  isLoading: boolean = false,
  isValidating: boolean = false
) => ({
  data,
  error,
  isLoading,
  mutate: jest.fn(),
  isValidating,
});

describe('useStatsPreFetch', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  it('should dispatch setStatsLoading when isLoading is true', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000' as UUID;
    const storedUserId = 'different-user';

    mockUseSelector.mockReturnValue({ userId: storedUserId });
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, true));

    renderHook(() => useStatsPreFetch(userId));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStatsLoading',
    });
  });

  it('should dispatch setStats when data is received', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001' as UUID;
    const storedUserId = 'different-user';
    const mockStats = { totalBooks: 10, totalPages: 1000 };

    mockUseSelector.mockReturnValue({ userId: storedUserId });
    mockUseSWR.mockReturnValue({
      data: mockStats,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useStatsPreFetch(userId));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStats',
      payload: { data: mockStats, userId },
    });
  });

  it('should dispatch setStatsError when error occurs', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440002' as UUID;
    const storedUserId = 'different-user';
    const mockError = new Error('Failed to fetch stats');

    mockUseSelector.mockReturnValue({ userId: storedUserId });
    mockUseSWR.mockReturnValue(createSWRMock(undefined, mockError, false));

    renderHook(() => useStatsPreFetch(userId));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStatsError',
      payload: mockError.message,
    });
  });

  it('should not fetch when userId equals storedUserId', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440003' as UUID;
    const storedUserId = '550e8400-e29b-41d4-a716-446655440003';

    mockUseSelector.mockReturnValue({ userId: storedUserId });

    renderHook(() => useStatsPreFetch(userId));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should fetch when userId is different from storedUserId', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440004' as UUID;
    const storedUserId = 'different-user';

    mockUseSelector.mockReturnValue({ userId: storedUserId });
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, false));

    renderHook(() => useStatsPreFetch(userId));

    expect(mockUseSWR).toHaveBeenCalledWith(
      `/api/public/accounts/${userId}/books/stats`,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should not fetch when userId is undefined', () => {
    mockUseSelector.mockReturnValue({ userId: undefined });

    renderHook(() => useStatsPreFetch(undefined));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should handle multiple state changes correctly', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440005' as UUID;
    const storedUserId = 'different-user';
    const mockStats = { totalBooks: 15, totalPages: 1500 };

    mockUseSelector.mockReturnValue({ userId: storedUserId });

    // First render - loading
    mockUseSWR.mockReturnValueOnce(createSWRMock(undefined, null, true));

    const { rerender } = renderHook(() => useStatsPreFetch(userId));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStatsLoading',
    });

    // Second render - data received
    mockUseSWR.mockReturnValueOnce(createSWRMock(mockStats, null, false));

    rerender();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStats',
      payload: { data: mockStats, userId },
    });
  });

  it('should handle error after successful data', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440006' as UUID;
    const storedUserId = 'different-user';
    const mockStats = { totalBooks: 10, totalPages: 1000 };
    const mockError = new Error('Network error');

    mockUseSelector.mockReturnValue({ userId: storedUserId });

    // First render - success
    mockUseSWR.mockReturnValueOnce(createSWRMock(mockStats, null, false));

    const { rerender } = renderHook(() => useStatsPreFetch(userId));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStats',
      payload: { data: mockStats, userId },
    });

    // Second render - error
    mockUseSWR.mockReturnValueOnce(createSWRMock(undefined, mockError, false));

    rerender();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStatsError',
      payload: mockError.message,
    });
  });

  it('should handle empty stats data', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440007' as UUID;
    const storedUserId = 'different-user';
    const mockStats = {};

    mockUseSelector.mockReturnValue({ userId: storedUserId });
    mockUseSWR.mockReturnValue(createSWRMock(mockStats, null, false));

    renderHook(() => useStatsPreFetch(userId));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'stats/setStats',
      payload: { data: mockStats, userId },
    });
  });
});
