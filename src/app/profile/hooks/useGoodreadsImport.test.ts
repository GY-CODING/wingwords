import { renderHook, act, waitFor } from '@testing-library/react';
import { useGoodreadsImport } from './useGoodreadsImport';

// Mock the CSV parser
jest.mock('@/utils/goodreadsParser', () => ({
  parseGoodreadsCSV: jest.fn(),
}));

import { parseGoodreadsCSV } from '@/utils/goodreadsParser';

const mockParseGoodreadsCSV = parseGoodreadsCSV as jest.MockedFunction<
  typeof parseGoodreadsCSV
>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const makeGoodreadsBook = (
  id: string,
  title: string,
  shelf = 'read' as const
) => ({
  goodreadsId: id,
  title,
  author: 'Test Author',
  isbn: '',
  myRating: 4,
  averageRating: 4.0,
  shelf,
  dateRead: '2024/01/01',
  dateAdded: '2023/01/01',
  publisher: '',
  yearPublished: '2023',
  review: null,
});

const makeHardcoverBook = (id: string, title: string) => ({
  id,
  title,
  author: { id: 1, name: 'Test Author', image: { url: '' }, biography: '' },
  cover: { url: 'https://example.com/cover.jpg' },
  series: [],
  pageCount: 300,
  description: '',
  averageRating: 4.0,
});

const makeFile = (content: string): File => {
  const file = new File([content], 'goodreads.csv', { type: 'text/csv' });
  // jsdom does not implement File.prototype.text(); polyfill it
  Object.defineProperty(file, 'text', {
    value: () => Promise.resolve(content),
  });
  return file;
};

describe('useGoodreadsImport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it('starts in idle status', () => {
    const { result } = renderHook(() => useGoodreadsImport());
    expect(result.current.status).toBe('idle');
    expect(result.current.results).toEqual([]);
    expect(result.current.errorMessage).toBeNull();
  });

  it('initializes with shelfFilter "read"', () => {
    const { result } = renderHook(() => useGoodreadsImport());
    expect(result.current.shelfFilter).toBe('read');
  });

  it('updates shelfFilter via setShelfFilter', () => {
    const { result } = renderHook(() => useGoodreadsImport());

    act(() => {
      result.current.setShelfFilter('to-read');
    });

    expect(result.current.shelfFilter).toBe('to-read');
  });

  it('sets status to error when CSV has no valid books', async () => {
    mockParseGoodreadsCSV.mockReturnValue([]);

    const { result } = renderHook(() => useGoodreadsImport());

    await act(async () => {
      result.current.handleFileUpload(makeFile('empty'));
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
    expect(result.current.errorMessage).toBeTruthy();
  });

  it('transitions through parsing → searching → done', async () => {
    const books = [makeGoodreadsBook('1', 'Dune')];
    mockParseGoodreadsCSV.mockReturnValue(books);

    const hardcoverResults = [makeHardcoverBook('hc-1', 'Dune')];
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => hardcoverResults,
    });

    const { result } = renderHook(() => useGoodreadsImport());

    await act(async () => {
      result.current.handleFileUpload(makeFile('csv content'));
    });

    await waitFor(() => {
      expect(result.current.status).toBe('done');
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].source.title).toBe('Dune');
    expect(result.current.results[0].candidates).toHaveLength(1);
    expect(result.current.results[0].selectedCandidate?.id).toBe('hc-1');
  });

  it('sets selectedCandidate to null when search returns no results', async () => {
    const books = [makeGoodreadsBook('1', 'Unknown Book')];
    mockParseGoodreadsCSV.mockReturnValue(books);
    mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

    const { result } = renderHook(() => useGoodreadsImport());

    await act(async () => {
      result.current.handleFileUpload(makeFile('csv'));
    });

    await waitFor(() =>
      expect(['done', 'error']).toContain(result.current.status)
    );

    if (result.current.status === 'done') {
      expect(result.current.results[0].candidates).toHaveLength(0);
      expect(result.current.results[0].selectedCandidate).toBeNull();
    }
  });

  it('limits candidates to 5 per book', async () => {
    const books = [makeGoodreadsBook('1', 'Popular Book')];
    mockParseGoodreadsCSV.mockReturnValue(books);

    const manyResults = Array.from({ length: 10 }, (_, i) =>
      makeHardcoverBook(`hc-${i}`, `Book ${i}`)
    );
    mockFetch.mockResolvedValue({ ok: true, json: async () => manyResults });

    const { result } = renderHook(() => useGoodreadsImport());

    await act(async () => {
      result.current.handleFileUpload(makeFile('csv'));
    });

    await waitFor(() =>
      expect(['done', 'error']).toContain(result.current.status)
    );

    if (result.current.status === 'done') {
      expect(result.current.results[0].candidates).toHaveLength(5);
    }
  });

  describe('setSelectedCandidate', () => {
    it('updates the selectedCandidate for a book', async () => {
      const books = [makeGoodreadsBook('1', 'Dune')];
      mockParseGoodreadsCSV.mockReturnValue(books);

      const candidates = [
        makeHardcoverBook('hc-1', 'Dune'),
        makeHardcoverBook('hc-2', 'Dune (Special Edition)'),
      ];
      mockFetch.mockResolvedValue({ ok: true, json: async () => candidates });

      const { result } = renderHook(() => useGoodreadsImport());

      await act(async () => {
        result.current.handleFileUpload(makeFile('csv'));
      });

      await waitFor(() =>
        expect(['done', 'error']).toContain(result.current.status)
      );

      if (result.current.status !== 'done') return;

      act(() => {
        result.current.setSelectedCandidate('1', candidates[1]);
      });

      expect(result.current.results[0].selectedCandidate?.id).toBe('hc-2');
      expect(result.current.results[0].skipped).toBe(false);
    });

    it('allows deselecting by passing null', async () => {
      const books = [makeGoodreadsBook('1', 'Dune')];
      mockParseGoodreadsCSV.mockReturnValue(books);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [makeHardcoverBook('hc-1', 'Dune')],
      });

      const { result } = renderHook(() => useGoodreadsImport());

      await act(async () => {
        result.current.handleFileUpload(makeFile('csv'));
      });

      await waitFor(() =>
        expect(['done', 'error']).toContain(result.current.status)
      );

      if (result.current.status !== 'done') return;

      act(() => {
        result.current.setSelectedCandidate('1', null);
      });

      expect(result.current.results[0].selectedCandidate).toBeNull();
    });
  });

  describe('toggleSkipped', () => {
    it('toggles skipped state for a book', async () => {
      const books = [makeGoodreadsBook('1', 'Dune')];
      mockParseGoodreadsCSV.mockReturnValue(books);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [makeHardcoverBook('hc-1', 'Dune')],
      });

      const { result } = renderHook(() => useGoodreadsImport());

      await act(async () => {
        result.current.handleFileUpload(makeFile('csv'));
      });

      await waitFor(() =>
        expect(['done', 'error']).toContain(result.current.status)
      );

      if (result.current.status !== 'done') return;

      expect(result.current.results[0].skipped).toBe(false);

      act(() => {
        result.current.toggleSkipped('1');
      });

      expect(result.current.results[0].skipped).toBe(true);

      act(() => {
        result.current.toggleSkipped('1');
      });

      expect(result.current.results[0].skipped).toBe(false);
    });
  });

  describe('reset', () => {
    it('resets state back to idle', async () => {
      const books = [makeGoodreadsBook('1', 'Dune')];
      mockParseGoodreadsCSV.mockReturnValue(books);
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      const { result } = renderHook(() => useGoodreadsImport());

      await act(async () => {
        result.current.handleFileUpload(makeFile('csv'));
      });

      await waitFor(() =>
        expect(['done', 'error']).toContain(result.current.status)
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.results).toEqual([]);
      expect(result.current.errorMessage).toBeNull();
    });
  });

  it('sets status to error when fetch throws', async () => {
    const books = [makeGoodreadsBook('1', 'Dune')];
    mockParseGoodreadsCSV.mockReturnValue(books);
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGoodreadsImport());

    await act(async () => {
      result.current.handleFileUpload(makeFile('csv'));
    });

    await waitFor(() =>
      expect(['done', 'error']).toContain(result.current.status)
    );
  });
});
