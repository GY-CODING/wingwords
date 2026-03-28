import { renderHook, act, waitFor } from '@testing-library/react';
import { useGoodreadsImportSave } from './useGoodreadsImportSave';
import type { ImportBookResult } from './useGoodreadsImport';

// Mock server actions and mapper
jest.mock('@/app/actions/book/rateBook');
jest.mock('@/mapper/goodreadsImport.mapper', () => ({
  buildRateBookFormData: jest.fn(() => new FormData()),
}));

import rateBook from '@/app/actions/book/rateBook';

const mockRateBook = rateBook as jest.MockedFunction<typeof rateBook>;

const makeResult = (
  id: string,
  title: string,
  skipped = false
): ImportBookResult => ({
  source: {
    goodreadsId: id,
    title,
    author: 'Author',
    isbn: '',
    myRating: 4,
    averageRating: 4.0,
    shelf: 'read',
    dateRead: '2024/01/01',
    dateAdded: '2023/01/01',
    publisher: '',
    yearPublished: '2023',
    review: null,
  },
  candidates: [
    {
      id: `hc-${id}`,
      title,
      author: { id: 1, name: 'Author', image: { url: '' }, biography: '' },
      cover: { url: '' },
      series: [],
      pageCount: 300,
      description: '',
      averageRating: 4.0,
    },
  ],
  selectedCandidate: skipped
    ? null
    : {
        id: `hc-${id}`,
        title,
        author: { id: 1, name: 'Author', image: { url: '' }, biography: '' },
        cover: { url: '' },
        series: [],
        pageCount: 300,
        description: '',
        averageRating: 4.0,
      },
  skipped,
});

describe('useGoodreadsImportSave', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with idle status and zeroed progress', () => {
    const { result } = renderHook(() => useGoodreadsImportSave());

    expect(result.current.saveStatus).toBe('idle');
    expect(result.current.saveError).toBeNull();
    expect(result.current.saveProgress).toEqual({
      current: 0,
      total: 0,
      successCount: 0,
      errorCount: 0,
      failedTitles: [],
    });
  });

  describe('importBooks', () => {
    it('does nothing when results list is empty', async () => {
      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks([], 'user123');
      });

      expect(result.current.saveStatus).toBe('idle');
      expect(mockRateBook).not.toHaveBeenCalled();
    });

    it('does nothing when all books are skipped', async () => {
      const { result } = renderHook(() => useGoodreadsImportSave());
      const skipped = [makeResult('1', 'Dune', true)];

      await act(async () => {
        await result.current.importBooks(skipped, 'user123');
      });

      expect(result.current.saveStatus).toBe('idle');
      expect(mockRateBook).not.toHaveBeenCalled();
    });

    it('transitions to "done" when all books save successfully', async () => {
      mockRateBook.mockResolvedValue(undefined as never);

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks(
          [makeResult('1', 'Dune'), makeResult('2', 'Mistborn')],
          'user123'
        );
      });

      await waitFor(() => {
        expect(result.current.saveStatus).toBe('done');
      });

      expect(result.current.saveProgress.successCount).toBe(2);
      expect(result.current.saveProgress.errorCount).toBe(0);
      expect(result.current.saveProgress.failedTitles).toEqual([]);
    });

    it('counts successful and failed imports separately', async () => {
      mockRateBook
        .mockResolvedValueOnce(undefined as never)
        .mockRejectedValueOnce(new Error('Save failed'));

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks(
          [makeResult('1', 'Dune'), makeResult('2', 'Mistborn')],
          'user123'
        );
      });

      await waitFor(() =>
        expect(['done', 'error']).toContain(result.current.saveStatus)
      );

      expect(result.current.saveProgress.successCount).toBe(1);
      expect(result.current.saveProgress.errorCount).toBe(1);
    });

    it('records failed titles in saveProgress.failedTitles', async () => {
      mockRateBook.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks(
          [makeResult('1', 'Dune'), makeResult('2', 'Mistborn')],
          'user123'
        );
      });

      await waitFor(() => {
        expect(result.current.saveProgress.failedTitles.length).toBeGreaterThan(
          0
        );
      });

      expect(result.current.saveProgress.failedTitles).toContain('Dune');
      expect(result.current.saveProgress.failedTitles).toContain('Mistborn');
    });

    it('sets status to "error" when ALL books fail', async () => {
      mockRateBook.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks([makeResult('1', 'Dune')], 'user123');
      });

      await waitFor(() => {
        expect(result.current.saveStatus).toBe('error');
      });

      expect(result.current.saveError).toBeTruthy();
    });

    it('sets status to "done" (not "error") when at least one book saves', async () => {
      mockRateBook
        .mockResolvedValueOnce(undefined as never) // first succeeds
        .mockRejectedValueOnce(new Error('fail')); // second fails

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks(
          [makeResult('1', 'Dune'), makeResult('2', 'Mistborn')],
          'user123'
        );
      });

      await waitFor(() => {
        expect(result.current.saveStatus).toBe('done');
      });
    });

    it('sets total in progress to the number of non-skipped books', async () => {
      mockRateBook.mockResolvedValue(undefined as never);

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks(
          [
            makeResult('1', 'Dune'),
            makeResult('2', 'Mistborn'),
            makeResult('3', 'Skipped', true), // skipped
          ],
          'user123'
        );
      });

      await waitFor(() => expect(result.current.saveStatus).toBe('done'));

      expect(result.current.saveProgress.total).toBe(2);
    });

    it('calls rateBook with the correct username', async () => {
      mockRateBook.mockResolvedValue(undefined as never);

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks([makeResult('1', 'Dune')], 'testuser');
      });

      expect(mockRateBook).toHaveBeenCalledWith(
        expect.any(FormData),
        'testuser'
      );
    });
  });

  describe('resetSave', () => {
    it('resets all state back to initial values', async () => {
      mockRateBook.mockResolvedValue(undefined as never);

      const { result } = renderHook(() => useGoodreadsImportSave());

      await act(async () => {
        await result.current.importBooks([makeResult('1', 'Dune')], 'user');
      });

      await waitFor(() => expect(result.current.saveStatus).toBe('done'));

      act(() => {
        result.current.resetSave();
      });

      expect(result.current.saveStatus).toBe('idle');
      expect(result.current.saveError).toBeNull();
      expect(result.current.saveProgress).toEqual({
        current: 0,
        total: 0,
        successCount: 0,
        errorCount: 0,
        failedTitles: [],
      });
    });
  });
});
