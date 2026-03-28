'use client';

import { useState, useCallback } from 'react';
import rateBook from '@/app/actions/book/rateBook';
import { buildRateBookFormData } from '@/mapper/goodreadsImport.mapper';
import type { ImportBookResult } from './useGoodreadsImport';

export type SaveStatus = 'idle' | 'saving' | 'done' | 'error';

export interface SaveProgress {
  current: number;
  total: number;
  successCount: number;
  errorCount: number;
  failedTitles: string[];
}

export interface UseGoodreadsImportSaveReturn {
  saveStatus: SaveStatus;
  saveProgress: SaveProgress;
  saveError: string | null;
  importBooks: (results: ImportBookResult[], username: string) => Promise<void>;
  resetSave: () => void;
}

const SAVE_CONCURRENCY = 3;

/**
 * Iterates over the selected ImportBookResults and calls rateBook() for each one
 * using the data mapped from the Goodreads source.
 */
export function useGoodreadsImportSave(): UseGoodreadsImportSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveProgress, setSaveProgress] = useState<SaveProgress>({
    current: 0,
    total: 0,
    successCount: 0,
    errorCount: 0,
    failedTitles: [],
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  const resetSave = useCallback(() => {
    setSaveStatus('idle');
    setSaveProgress({
      current: 0,
      total: 0,
      successCount: 0,
      errorCount: 0,
      failedTitles: [],
    });
    setSaveError(null);
  }, []);

  const importBooks = useCallback(
    async (results: ImportBookResult[], username: string) => {
      const toSave = results.filter(
        (r) => !r.skipped && r.selectedCandidate !== null
      );

      if (toSave.length === 0) return;

      setSaveStatus('saving');
      setSaveError(null);
      setSaveProgress({
        current: 0,
        total: toSave.length,
        successCount: 0,
        errorCount: 0,
        failedTitles: [],
      });

      let successCount = 0;
      let errorCount = 0;
      const failedTitles: string[] = [];

      for (let i = 0; i < toSave.length; i += SAVE_CONCURRENCY) {
        const batch = toSave.slice(i, i + SAVE_CONCURRENCY);

        await Promise.allSettled(
          batch.map(async (result) => {
            const hardcoverBookId = result.selectedCandidate!.id;
            const formData = buildRateBookFormData(
              hardcoverBookId,
              result.source
            );
            try {
              await rateBook(formData, username);
              successCount++;
            } catch {
              errorCount++;
              failedTitles.push(result.source.title);
            }
          })
        );

        setSaveProgress({
          current: Math.min(i + SAVE_CONCURRENCY, toSave.length),
          total: toSave.length,
          successCount,
          errorCount,
          failedTitles: [...failedTitles],
        });
      }

      if (errorCount > 0 && successCount === 0) {
        setSaveError('All imports failed. Please try again.');
        setSaveStatus('error');
      } else {
        setSaveStatus('done');
      }
    },
    []
  );

  return { saveStatus, saveProgress, saveError, importBooks, resetSave };
}
