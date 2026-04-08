import fetchUser from './fetchUser';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('fetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns null if response is 401', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({ status: 401, ok: false });
    await expect(fetchUser()).resolves.toBeNull();
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 500, ok: false, text: async () => 'error' });
    await expect(fetchUser()).rejects.toThrow(
      'HTTP error! status: 500 - error'
    );
  });
  it('throws error if no data returned', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, ok: true, json: async () => null });
    await expect(fetchUser()).rejects.toThrow(
      'No ApiFriendRequest data received from server'
    );
  });
  it('returns data if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const mockData = { id: 'user-id', name: 'Test User' };
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, ok: true, json: async () => mockData });
    await expect(fetchUser()).resolves.toEqual(mockData);
  });
});
