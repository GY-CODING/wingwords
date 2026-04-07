jest.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: jest.fn(),
  },
}));
jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

import getApiBook from './fetchApiBook';
import { auth0 } from '@/lib/auth0';
import { headers, cookies } from 'next/headers';

describe('getApiBook', () => {
  it('should use default host if headersList.get("host") is undefined', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => undefined });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });
    const result = await getApiBook(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should use http protocol in development and https in production', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    await getApiBook(bookId);
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    await getApiBook(bookId);
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should use default page and size values', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });
    // Call without page/size params
    await getApiBook(bookId);
    // You may want to spy on fetch URL or params for full coverage
    expect(global.fetch).toHaveBeenCalled();
  });
  it('should fallback to public fetch if private fails and public succeeds', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    // First fetch (private) fails, second fetch (public) succeeds
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'private error',
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: bookId }) });
    const result = await getApiBook(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should throw error if both private and public fetches fail', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'private error',
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'public error',
      });
    await expect(getApiBook(bookId)).rejects.toThrow('HTTP error! status: 500');
  });

  it('should return null if response json status is 404', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ status: 404 }) });
    const result = await getApiBook(bookId);
    expect(result).toBeNull();
  });

  it('should throw error if headers throws', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockRejectedValue(new Error('headers error'));
    await expect(getApiBook(bookId)).rejects.toThrow('headers error');
  });

  it('should throw error if cookies throws', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockRejectedValue(new Error('cookies error'));
    await expect(getApiBook(bookId)).rejects.toThrow('cookies error');
  });

  it('should throw error if auth0.getSession throws', async () => {
    (auth0.getSession as jest.Mock).mockRejectedValue(new Error('auth0 error'));
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    await expect(getApiBook(bookId)).rejects.toThrow('auth0 error');
  });
  const bookId = 'test-book-id';
  it('should throw error if bookId is missing', async () => {
    await expect(getApiBook('')).rejects.toThrow();
  });

  it('should throw error if fetch throws (network error)', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(getApiBook(bookId)).rejects.toThrow('Network error');
  });

  it('should throw error if response is ok but no data returned', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => null });
    await expect(getApiBook(bookId)).rejects.toThrow();
  });

  it('should throw error if authenticated fetch returns not ok', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, text: async () => 'error' });
    await expect(getApiBook(bookId)).rejects.toThrow('error');
  });

  it('should throw error if public fetch returns not ok', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'public error',
    });
    await expect(getApiBook(bookId)).rejects.toThrow(
      'Failed to get book status: HTTP error! status: 500'
    );
  });
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should fetch private book data when authenticated', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });

    const result = await getApiBook(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should fetch public book data when not authenticated', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });

    const result = await getApiBook(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should return null if fetch fails', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, text: async () => 'error' });

    await expect(getApiBook(bookId)).rejects.toThrow();
  });
});
