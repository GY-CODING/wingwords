import getApiBookPublic from './fetchApiBookPublic';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

import { headers } from 'next/headers';

describe('getApiBookPublic', () => {
  const bookId = 'test-book-id';
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should return book data if found', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ id: bookId }),
    });
    const result = await getApiBookPublic(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should return null if status is 404', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ status: 404 }),
    });
    const result = await getApiBookPublic(bookId);
    expect(result).toBeNull();
  });

  it('should throw error if fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(getApiBookPublic(bookId)).rejects.toThrow(
      'Failed to get book status: Network error'
    );
  });
});
