import fetchHallOfFame from './fetchHallOfFame';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('fetchHallOfFame', () => {
  let originalFetch: typeof global.fetch;
  beforeAll(() => {
    originalFetch = global.fetch;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });
  it('returns null if userId is missing', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    await expect(fetchHallOfFame('')).resolves.toBeNull();
  });
  it('returns null if response is 401', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({ status: 401, ok: false });
    await expect(fetchHallOfFame('user-id')).resolves.toBeNull();
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 500, ok: false, text: async () => 'error' });
    await expect(fetchHallOfFame('user-id')).rejects.toThrow(
      'HTTP error! status: 500 - error'
    );
  });
  it('throws error if no data returned', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, ok: true, json: async () => null });
    await expect(fetchHallOfFame('user-id')).rejects.toThrow(
      'No ApiFriendRequest data received from server'
    );
  });
  it('returns data if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const mockData = { books: [] };
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, ok: true, json: async () => mockData });
    await expect(fetchHallOfFame('user-id')).resolves.toEqual(mockData);
  });
});
