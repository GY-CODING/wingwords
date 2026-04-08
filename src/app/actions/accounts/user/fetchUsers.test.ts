import queryUsers from './fetchUsers';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('queryUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if username is missing', async () => {
    const formData = new FormData();
    await expect(queryUsers(formData)).rejects.toThrow(
      'No username provided in formData'
    );
  });
  it('returns users if private fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const mockData = [{ id: 'user-id', name: 'Test User' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: () => ({ text: async () => JSON.stringify(mockData) }),
      status: 200,
    });
    const formData = new FormData();
    formData.set('username', 'testuser');
    await expect(queryUsers(formData)).resolves.toEqual(mockData);
  });
  it('returns users if public fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: () => ({
        text: async () =>
          JSON.stringify([{ id: 'user-id', name: 'Test User' }]),
      }),
      status: 200,
    });
    const formData = new FormData();
    formData.set('username', 'testuser');
    await expect(queryUsers(formData)).resolves.toEqual([
      { id: 'user-id', name: 'Test User' },
    ]);
  });
  it('throws error if public fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      clone: () => ({ text: async () => 'error' }),
      status: 500,
    });
    const formData = new FormData();
    formData.set('username', 'testuser');
    await expect(queryUsers(formData)).rejects.toThrow(
      'Public fetch failed. Status: 500 - error'
    );
  });
});
