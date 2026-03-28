'use client';

import { useState, useCallback, useRef } from 'react';
import { parseHardcoverCSV } from '@/utils/hardcoverParser';
import type { GoodreadsShelf } from '@/utils/goodreadsParser';
import type HardcoverBook from '@/domain/HardcoverBook';
import type {
  ImportBookResult,
  ImportStatus,
  UseGoodreadsImportReturn,
} from './useGoodreadsImport';

const FETCH_BATCH_SIZE = 20;

/**
 * Variant of useGoodreadsImport for Hardcover CSV exports.
 *
 * Because the CSV already contains Hardcover Book IDs, this hook skips the
 * title-search step and instead batch-fetches book details directly via the
 * /api/hardcover endpoint (ids[] mode).  Each result comes back with
 * selectedCandidate pre-filled and preferredEditionId set to the specific
 * edition from the export.
 *
 * Returns the same UseGoodreadsImportReturn interface so it is a drop-in
 * replacement in the profile page.
 */
export function useHardcoverCsvImport(): UseGoodreadsImportReturn {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [results, setResults] = useState<ImportBookResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shelfFilter, setShelfFilter] = useState<GoodreadsShelf | 'all'>(
    'read'
  );

  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatus('idle');
    setResults([]);
    setProgress({ current: 0, total: 0 });
    setErrorMessage(null);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    abortRef.current = false;
    setStatus('parsing');
    setErrorMessage(null);
    setResults([]);

    try {
      const text = await file.text();
      const csvBooks = parseHardcoverCSV(text);

      if (csvBooks.length === 0) {
        setErrorMessage('No valid books found in the Hardcover CSV file.');
        setStatus('error');
        return;
      }

      setStatus('searching'); // reuse existing status — "fetching" in UI
      setProgress({ current: 0, total: csvBooks.length });

      // Seed results immediately so the list renders at once
      const initialResults: ImportBookResult[] = csvBooks.map((b) => ({
        source: b,
        importSource: 'hardcover',
        candidates: [],
        selectedCandidate: null,
        skipped: false,
        preferredEditionId: b.hardcoverEditionId,
      }));
      setResults(initialResults);

      // Batch-fetch book details from Hardcover
      const ids = csvBooks.map((b) => b.goodreadsId); // goodreadsId = hardcoverBookId
      const allBooks: HardcoverBook[] = [];

      for (let i = 0; i < ids.length; i += FETCH_BATCH_SIZE) {
        if (abortRef.current) break;

        const batch = ids.slice(i, i + FETCH_BATCH_SIZE);
        try {
          const res = await fetch('/api/hardcover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: batch }),
          });
          if (res.ok) {
            const books: HardcoverBook[] = await res.json();
            allBooks.push(...books);
          }
        } catch {
          // Non-fatal: books not fetched will show as "not found"
        }

        setProgress({
          current: Math.min(i + FETCH_BATCH_SIZE, ids.length),
          total: ids.length,
        });
      }

      if (abortRef.current) return;

      // Match each CSV row to its fetched Hardcover book by ID
      const bookById = new Map(allBooks.map((b) => [b.id, b]));

      setResults(
        csvBooks.map((csvBook) => {
          const hardcoverBook = bookById.get(csvBook.goodreadsId) ?? null;
          return {
            source: csvBook,
            importSource: 'hardcover',
            candidates: hardcoverBook ? [hardcoverBook] : [],
            selectedCandidate: hardcoverBook,
            skipped: false,
            preferredEditionId: csvBook.hardcoverEditionId,
          };
        })
      );

      setStatus('done');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unknown error parsing CSV'
      );
      setStatus('error');
    }
  }, []);

  const setSelectedCandidate = useCallback(
    (id: string, candidate: HardcoverBook | null) => {
      setResults((prev) =>
        prev.map((r) =>
          r.source.goodreadsId === id
            ? { ...r, selectedCandidate: candidate, skipped: false }
            : r
        )
      );
    },
    []
  );

  const toggleSkipped = useCallback((id: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.source.goodreadsId === id ? { ...r, skipped: !r.skipped } : r
      )
    );
  }, []);

  return {
    status,
    parsedBooks: results.map((r) => r.source),
    results,
    progress,
    errorMessage,
    shelfFilter,
    setShelfFilter,
    handleFileUpload,
    setSelectedCandidate,
    toggleSkipped,
    reset,
  };
}
