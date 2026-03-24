import { renderHook } from '@testing-library/react';
import { useActivities } from './useActivities';
import * as swr from 'swr';

// Mock SWR
jest.mock('swr');

// Mock the fetch function
jest.mock('@/app/actions/book/activities/fetchActivities');

const mockUseSWR = swr.default as jest.MockedFunction<typeof swr.default>;

describe('useActivities', () => {
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockActivitiesData = [
    {
      date: '2024-01-15T10:00:00Z',
      message: '[book-123] User added a new book',
    },
    {
      date: '2024-01-10T08:30:00Z',
      message: '[book-456] User rated a book 5 stars',
    },
    {
      date: null, // This should be filtered out
      message: '[book-789] Invalid activity',
    },
  ];

  const expectedFormattedActivities = [
    {
      bookId: 'book-123',
      message: 'User added a new book',
      date: '2024-01-15T10:00:00Z',
      formattedDate: '15/01/2024',
    },
    {
      bookId: 'book-456',
      message: 'User rated a book 5 stars',
      date: '2024-01-10T08:30:00Z',
      formattedDate: '10/01/2024',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should return formatted activities when fetch is successful', () => {
    mockUseSWR.mockReturnValue({
      data: mockActivitiesData,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(expectedFormattedActivities);
    expect(result.current.error).toBeUndefined();
  });

  it('should filter out activities without date', () => {
    const dataWithNullDate = [
      {
        date: '2024-01-15T10:00:00Z',
        message: '[book-123] Valid activity',
      },
      {
        date: null,
        message: '[book-456] Invalid activity',
      },
    ];

    mockUseSWR.mockReturnValue({
      data: dataWithNullDate,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].bookId).toBe('book-123');
    expect(result.current.data?.[0].formattedDate).toBe('15/01/2024');
  });

  it('should sort activities by date (most recent first)', () => {
    const unsortedData = [
      {
        date: '2024-01-10T08:30:00Z',
        message: '[book-456] Older activity',
      },
      {
        date: '2024-01-15T10:00:00Z',
        message: '[book-123] Newer activity',
      },
    ];

    mockUseSWR.mockReturnValue({
      data: unsortedData,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.data?.[0].bookId).toBe('book-123'); // Newer first
    expect(result.current.data?.[0].formattedDate).toBe('15/01/2024');
    expect(result.current.data?.[1].bookId).toBe('book-456'); // Older second
    expect(result.current.data?.[1].formattedDate).toBe('10/01/2024');
  });

  it('should extract bookId from message correctly', () => {
    const dataWithBookIds = [
      {
        date: '2024-01-15T10:00:00Z',
        message: '[book-123] User action',
      },
      {
        date: '2024-01-14T09:00:00Z',
        message: 'No brackets here',
      },
    ];

    mockUseSWR.mockReturnValue({
      data: dataWithBookIds,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.data?.[0].bookId).toBe('book-123');
    expect(result.current.data?.[0].formattedDate).toBe('15/01/2024');
    expect(result.current.data?.[1].bookId).toBe(''); // No brackets found
    expect(result.current.data?.[1].formattedDate).toBe('14/01/2024');
  });

  it('should clean message by removing bookId prefix', () => {
    const dataWithPrefixes = [
      {
        date: '2024-01-15T10:00:00Z',
        message: '[book-123] User added a book',
      },
    ];

    mockUseSWR.mockReturnValue({
      data: dataWithPrefixes,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.data?.[0].message).toBe('User added a book');
    expect(result.current.data?.[0].formattedDate).toBe('15/01/2024');
  });

  it('should return error when fetch fails', () => {
    const mockError = new Error('Failed to fetch activities');
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  it('should handle empty data array', () => {
    mockUseSWR.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.data).toEqual([]);
  });

  it('should handle undefined data', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useActivities(mockUserId));

    expect(result.current.data).toBeUndefined();
  });

  it('should call fetchActivities with correct id', () => {
    mockUseSWR.mockReturnValue({
      data: mockActivitiesData,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useActivities(mockUserId));

    expect(mockUseSWR).toHaveBeenCalledWith(
      `/api/public/books/activities?userId=${mockUserId}`,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it('should handle undefined id', () => {
    mockUseSWR.mockReturnValue({
      data: mockActivitiesData,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useActivities(undefined));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });
});
