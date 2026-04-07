import removeBook from './removeBook';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

import { headers, cookies } from 'next/headers';

describe('removeBook', () => {
  const bookId = 'test-book-id';
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should throw error if bookId is missing', async () => {
    await expect(removeBook('')).rejects.toThrow('Book ID is required');
  });

  it('should call DELETE and succeed', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await expect(removeBook(bookId)).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/auth/books/${bookId}`),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should throw error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });

    await expect(removeBook(bookId)).rejects.toThrow(
      'HTTP error! status: 500 - error'
    );
  });
});
