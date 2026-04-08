import rateBook from './rateBook';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));
jest.mock('./fetchBookById', () => jest.fn());
jest.mock('./activities/setActivity', () => ({ setActivity: jest.fn() }));

import { EStatus } from '@/utils/constants/EStatus';
import { EActivity } from '@/utils/constants/formatActivity';
import { EBookStatus } from '@gycoding/nebula';
import { cookies, headers } from 'next/headers';
import { setActivity } from './activities/setActivity';
import fetchBookById from './fetchBookById';

describe('rateBook', () => {
  let originalFetch: typeof global.fetch;
  const username = 'testuser';
  const bookId = 'book-id';
  const book = { id: bookId, title: 'Book Title' };
  const userData = { status: EStatus.READ, progress: 100, rating: 5 };

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should throw error if bookId is missing', async () => {
    const formData = new FormData();
    await expect(rateBook(formData, username)).rejects.toThrow(
      'Book ID is required'
    );
  });

  it('should throw error if rating is invalid', async () => {
    const formData = new FormData();
    formData.set('bookId', bookId);
    formData.set('rating', 'invalid');
    await expect(rateBook(formData, username)).rejects.toThrow(
      'Rating must be a number between 0 and 5'
    );
  });

  it('should call PATCH and return bookRatingData', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bookRatingData: { userData } }),
    });
    (fetchBookById as jest.Mock).mockResolvedValue(book);
    const formData = new FormData();
    formData.set('bookId', bookId);
    formData.set('rating', '5');
    formData.set('status', EStatus.READ);
    formData.set('progress', '100');
    formData.set('startDate', '2023-01-01');
    formData.set('endDate', '2023-01-02');
    const result = await rateBook(formData, username, {
      status: EStatus.READING,
      progress: 50,
      rating: 3,
      userId: '',
      startDate: '',
      endDate: '',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/auth/books/${bookId}`),
      expect.objectContaining({ method: 'PATCH' })
    );
    expect(result).toEqual({ userData });
  });

  it('should throw error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    });
    const formData = new FormData();
    formData.set('bookId', bookId);
    formData.set('rating', '5');
    await expect(rateBook(formData, username)).rejects.toThrow(
      'HTTP error! status: 500 - error'
    );
  });

  it('should throw error if no bookRatingData returned', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    const formData = new FormData();
    formData.set('bookId', bookId);
    formData.set('rating', '5');
    await expect(rateBook(formData, username)).rejects.toThrow(
      'No ApiBook data received from server'
    );
  });

  it('should call setActivity for status, progress, and rating changes', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        bookRatingData: {
          userData: {
            status: EStatus.READ, // status changed to READ
            progress: 100,
            rating: 5,
            userId: 'user-id',
            startDate: '2023-01-01',
            endDate: '2023-01-02',
          },
        },
      }),
    });
    (fetchBookById as jest.Mock).mockResolvedValue(book);
    const formData = new FormData();
    formData.set('bookId', bookId);
    formData.set('rating', '5');
    formData.set('status', EStatus.READING);
    formData.set('progress', '100');
    formData.set('startDate', '2023-01-01');
    formData.set('endDate', '2023-01-02');
    await rateBook(formData, username, {
      status: EBookStatus.READING, // previous status is READING
      progress: 50, // diferente al nuevo (100)
      rating: 3,
      userId: 'user-id',
      startDate: '2023-01-01',
      endDate: '2023-01-02',
    });
    // Debug: print all calls to setActivity

    console.log('setActivity calls:', (setActivity as jest.Mock).mock.calls);
    expect(setActivity).toHaveBeenCalledWith(
      EActivity.BOOK_READ,
      username,
      book
    );
    expect(setActivity).toHaveBeenCalledWith(
      EActivity.BOOK_RATED,
      username,
      book,
      undefined,
      5
    );
  });

  it('should throw error if fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const formData = new FormData();
    formData.set('bookId', bookId);
    formData.set('rating', '5');
    await expect(rateBook(formData, username)).rejects.toThrow(
      'Failed to rate book: Network error'
    );
  });
});
