'use client';

import { useState, useCallback, useRef } from 'react';
import {
  parseGoodreadsCSV,
  GoodreadsBook,
  GoodreadsShelf,
} from '@/utils/goodreadsParser';
import type HardcoverBook from '@/domain/HardcoverBook';

export type ImportStatus = 'idle' | 'parsing' | 'searching' | 'done' | 'error';

export interface ImportBookResult {
  source: GoodreadsBook;
  candidates: HardcoverBook[];
  selectedCandidate: HardcoverBook | null;
  skipped: boolean;
}

export interface UseGoodreadsImportReturn {
  status: ImportStatus;
  parsedBooks: GoodreadsBook[];
  results: ImportBookResult[];
  progress: { current: number; total: number };
  errorMessage: string | null;
  shelfFilter: GoodreadsShelf | 'all';
  setShelfFilter: (shelf: GoodreadsShelf | 'all') => void;
  handleFileUpload: (file: File) => void;
  setSelectedCandidate: (
    goodreadsId: string,
    candidate: HardcoverBook | null
  ) => void;
  toggleSkipped: (goodreadsId: string) => void;
  reset: () => void;
}

const SEARCH_CONCURRENCY = 3;

export function useGoodreadsImport(): UseGoodreadsImportReturn {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [parsedBooks, setParsedBooks] = useState<GoodreadsBook[]>([]);
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
    setParsedBooks([]);
    setResults([]);
    setProgress({ current: 0, total: 0 });
    setErrorMessage(null);
  }, []);

  const searchHardcover = async (title: string): Promise<HardcoverBook[]> => {
    const res = await fetch('/api/hardcover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: title }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  const handleFileUpload = useCallback(async (file: File) => {
    abortRef.current = false;
    setStatus('parsing');
    setErrorMessage(null);
    setResults([]);

    try {
      const text = await file.text();
      const books = parseGoodreadsCSV(text);

      if (books.length === 0) {
        setErrorMessage('No valid books found in the CSV file.');
        setStatus('error');
        return;
      }

      setParsedBooks(books);
      setStatus('searching');
      setProgress({ current: 0, total: books.length });

      const initialResults: ImportBookResult[] = books.map((b) => ({
        source: b,
        candidates: [],
        selectedCandidate: null,
        skipped: false,
      }));
      setResults(initialResults);

      // Process in concurrent batches
      for (let i = 0; i < books.length; i += SEARCH_CONCURRENCY) {
        if (abortRef.current) break;

        const batch = books.slice(i, i + SEARCH_CONCURRENCY);
        const batchResults = await Promise.allSettled(
          batch.map((book) => searchHardcover(`${book.title} ${book.author}`))
        );

        setResults((prev) => {
          const updated = [...prev];
          batchResults.forEach((result, idx) => {
            const bookIndex = i + idx;
            const candidates =
              result.status === 'fulfilled' ? result.value.slice(0, 5) : [];
            updated[bookIndex] = {
              ...updated[bookIndex],
              candidates,
              selectedCandidate: candidates[0] ?? null,
            };
          });
          return updated;
        });

        setProgress({
          current: Math.min(i + SEARCH_CONCURRENCY, books.length),
          total: books.length,
        });
      }

      setStatus('done');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unknown error parsing CSV'
      );
      setStatus('error');
    }
  }, []);

  const setSelectedCandidate = useCallback(
    (goodreadsId: string, candidate: HardcoverBook | null) => {
      setResults((prev) =>
        prev.map((r) =>
          r.source.goodreadsId === goodreadsId
            ? { ...r, selectedCandidate: candidate, skipped: false }
            : r
        )
      );
    },
    []
  );

  const toggleSkipped = useCallback((goodreadsId: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.source.goodreadsId === goodreadsId ? { ...r, skipped: !r.skipped } : r
      )
    );
  }, []);

  return {
    status,
    parsedBooks,
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
