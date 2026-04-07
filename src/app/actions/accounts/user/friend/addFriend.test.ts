import addFriend from './addFriend';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('addFriend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if userId is missing', async () => {
    const formData = new FormData();
    await expect(addFriend(formData)).rejects.toThrow('User ID is required');
  });
  it('returns true if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'request-id' }),
    });
    const formData = new FormData();
    formData.set('userId', 'user-id');
    await expect(addFriend(formData)).resolves.toBe(true);
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });
    const formData = new FormData();
    formData.set('userId', 'user-id');
    await expect(addFriend(formData)).rejects.toThrow(
      'HTTP error! status: 500 - error'
    );
  });
  it('throws error if no data returned', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => null });
    const formData = new FormData();
    formData.set('userId', 'user-id');
    await expect(addFriend(formData)).rejects.toThrow(
      'No ApiFriendRequest data received from server'
    );
  });
  it('throws error if fetch throws', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const formData = new FormData();
    formData.set('userId', 'user-id');
    await expect(addFriend(formData)).rejects.toThrow(
      'Failed to add friend: Network error'
    );
  });
});
