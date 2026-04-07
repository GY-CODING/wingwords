import { fetchActivities } from './fetchActivities';
jest.mock('next/headers', () => ({ headers: jest.fn() }));
import { headers } from 'next/headers';
describe('fetchActivities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns activities if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    const mockData = [{ id: '1', type: 'READ' }];
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockData });
    await expect(
      fetchActivities('11111111-2222-3333-4444-555555555555')
    ).resolves.toEqual(mockData);
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });
    await expect(
      fetchActivities('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow('HTTP error! status: 500');
  });
  it('throws error if fetch throws', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3001' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(
      fetchActivities('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow('Failed to get books: Network error');
  });
});
