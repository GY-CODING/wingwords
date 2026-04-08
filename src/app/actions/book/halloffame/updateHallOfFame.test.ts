/* eslint-disable @typescript-eslint/no-explicit-any */
import updateHallOfFame from './updateHallOfFame';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('updateHallOfFame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if formData is missing', async () => {
    await expect(updateHallOfFame(undefined as any)).rejects.toThrow(
      'No quote provided in formData'
    );
  });
  it('returns text if private fetch is OK', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('quote', 'test quote');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: () => ({ text: async () => 'quote updated' }),
      status: 200,
    });
    await expect(updateHallOfFame(formData)).resolves.toBe('quote updated');
  });
  it('returns text if private fetch is 401', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('quote', 'test quote');
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      clone: () => ({ text: async () => 'unauthorized' }),
      status: 401,
    });
    await expect(updateHallOfFame(formData)).resolves.toBe('unauthorized');
  });
  it('throws error if private fetch is not OK and not 401', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('quote', 'test quote');
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      clone: () => ({ text: async () => 'server error' }),
      status: 500,
    });
    await expect(updateHallOfFame(formData)).rejects.toThrow(
      'Private fetch failed. Status: 500 - server error'
    );
  });
  it('throws error if fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('quote', 'test quote');
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(updateHallOfFame(formData)).rejects.toThrow('Network error');
  });
});
