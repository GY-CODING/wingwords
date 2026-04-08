import sendActivity from './sendActivities';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('sendActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns activity if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const mockData = { id: '1', type: 'READ' };
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockData });
    const formData = new FormData();
    formData.set('message', 'test');
    await expect(sendActivity(formData)).resolves.toEqual(mockData);
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });
    const formData = new FormData();
    formData.set('message', 'test');
    await expect(sendActivity(formData)).rejects.toThrow(
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
      .mockResolvedValue({ ok: true, json: async () => null });
    const formData = new FormData();
    formData.set('message', 'test');
    await expect(sendActivity(formData)).rejects.toThrow(
      'No ApiBook data received from server'
    );
  });
  it('throws error if fetch throws', async () => {
    (headers as jest.Mock).mockResolvedValue({
      get: () => `localhost:${process.env.PORT || 3001}`,
    });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const formData = new FormData();
    formData.set('message', 'test');
    await expect(sendActivity(formData)).rejects.toThrow('Network error');
  });
});
