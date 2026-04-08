import getAccountsUser from './fetchAccountsUser';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
jest.mock('@/lib/auth0', () => ({ auth0: { getSession: jest.fn() } }));
import { headers, cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
describe('getAccountsUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if id is missing', async () => {
    await expect(getAccountsUser('')).rejects.toThrow(
      'No username provided in formData'
    );
  });
  it('returns user if private fetch is ok', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({ user: true });
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: () => ({
        text: async () => JSON.stringify({ id: 'user-id', name: 'Test User' }),
      }),
    });
    await expect(getAccountsUser('user-id')).resolves.toEqual({
      id: 'user-id',
      name: 'Test User',
    });
  });
  it('returns user if public fetch is ok', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({});
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: () => ({
        text: async () => JSON.stringify({ id: 'user-id', name: 'Test User' }),
      }),
    });
    await expect(getAccountsUser('user-id')).resolves.toEqual({
      id: 'user-id',
      name: 'Test User',
    });
  });
  it('returns null if public fetch fails', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({});
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      clone: () => ({ text: async () => 'error' }),
      status: 500,
    });
    await expect(getAccountsUser('user-id')).resolves.toBeNull();
  });
});
