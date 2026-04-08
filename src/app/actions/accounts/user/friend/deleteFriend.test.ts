import deleteFriend from './deleteFriend';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('deleteFriend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if userId is missing', async () => {
    await expect(deleteFriend('')).rejects.toThrow('User ID is required');
  });
  it('returns true if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    await expect(deleteFriend('user-id')).resolves.toBe(true);
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });
    await expect(deleteFriend('user-id')).rejects.toThrow(
      'HTTP error! status: 500 - error'
    );
  });
  it('throws error if fetch throws', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(deleteFriend('user-id')).rejects.toThrow(
      'Failed to delete friend: Network error'
    );
  });
});
