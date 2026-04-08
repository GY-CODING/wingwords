import { getStats } from './fetchUserStats';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

import { headers } from 'next/headers';

describe('getStats', () => {
  const profileId = '11111111-2222-3333-4444-555555555555';
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should return stats data if found', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    const statsData = { booksRead: 10, pagesRead: 500 };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => statsData,
    });
    const result = await getStats(profileId);
    expect(result).toEqual(statsData);
  });

  it('should throw error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    });
    await expect(getStats(profileId)).rejects.toThrow(
      'HTTP error! status: 500'
    );
  });

  it('should throw error if fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(getStats(profileId)).rejects.toThrow(
      'Failed to get books: Network error'
    );
  });
});
