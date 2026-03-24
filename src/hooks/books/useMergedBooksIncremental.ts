import { useState } from 'react';
import useSWR from 'swr';
import type HardcoverBook from '../../domain/HardcoverBook';

export type ProfileUserData = {
  editionId?: string;
  status?: string;
  rating?: number;
  review?: string;
  progress?: number;
  startedAt?: string;
  finishedAt?: string;
  [key: string]: unknown;
};

export type ProfileBookSummary = {
  id: string;
  averageRating?: number;
  userData?: ProfileUserData;
};

type Result = {
  data: HardcoverBook[];
  isLoading: boolean;
  error: Error | null;
  isDone: boolean;
};

/**
 * useMergedBooksIncremental
 *
 * Estrategia optimizada en 3 fases:
 * 1. Fase de resúmenes: recoge todas las páginas de summaries en paralelo
 *    (batches de CONCURRENT_PAGES). Estas son peticiones ligeras.
 * 2. Fase Hardcover: UNA sola petición batch con todos los IDs recogidos.
 *    Elimina el patrón anterior de N peticiones Hardcover (una por página).
 * 3. Merge: combina userData del backend con los datos ricos de Hardcover.
 */

const CONCURRENT_PAGES = 5;
const MAX_PAGES = 50; // guarda frente a bucles infinitos (~250 libros con pageSize 5)
const HARDCOVER_CHUNK_SIZE = 150; // límite seguro por petición a Hardcover

async function fetchSummaryPage(
  profileId: string,
  page: number,
  pageSize: number
): Promise<ProfileBookSummary[]> {
  const res = await fetch(
    `/api/public/books?profileId=${profileId}&page=${page}&size=${pageSize}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as ProfileBookSummary[];
  return Array.isArray(data) ? data : [];
}

async function fetchHardcoverChunk(ids: string[]): Promise<HardcoverBook[]> {
  if (ids.length === 0) return [];
  const res = await fetch('/api/hardcover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error(`Hardcover HTTP ${res.status}`);
  return (await res.json()) as HardcoverBook[];
}

async function fetchAllMergedBooks(
  profileId: string,
  pageSize: number
): Promise<HardcoverBook[]> {
  // Fase 1: recoger todos los summaries
  const allSummaries: ProfileBookSummary[] = [];

  const firstPage = await fetchSummaryPage(profileId, 0, pageSize);
  if (firstPage.length === 0) return [];
  allSummaries.push(...firstPage);

  if (firstPage.length >= pageSize) {
    let pageIndex = 1;
    let hasMore = true;

    while (hasMore && pageIndex < MAX_PAGES) {
      const pageNumbers = Array.from(
        { length: Math.min(CONCURRENT_PAGES, MAX_PAGES - pageIndex) },
        (_, i) => pageIndex + i
      );

      const pages = await Promise.all(
        pageNumbers.map((p) => fetchSummaryPage(profileId, p, pageSize))
      );

      for (const page of pages) {
        allSummaries.push(...page);
        if (page.length < pageSize) {
          hasMore = false;
          break;
        }
      }

      pageIndex += pageNumbers.length;
    }
  }

  // Fase 2: única llamada batch a Hardcover (en chunks si hay muchos ids)
  const ids = allSummaries.map((s) => s.id).filter(Boolean);
  if (ids.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += HARDCOVER_CHUNK_SIZE) {
    chunks.push(ids.slice(i, i + HARDCOVER_CHUNK_SIZE));
  }

  const hardcoverBooks = (
    await Promise.all(chunks.map(fetchHardcoverChunk))
  ).flat();

  // Fase 3: merge userData de summaries → datos Hardcover
  const summaryById = new Map(allSummaries.map((s) => [s.id, s.userData]));
  return hardcoverBooks.map((hb) => ({
    ...hb,
    userData: summaryById.get(hb.id) ?? hb.userData,
  }));
}

export default function useMergedBooksIncremental(
  profileId?: string,
  pageSize = 5
): Result {
  const [isDone, setIsDone] = useState(false);

  const { data, isLoading, error } = useSWR(
    profileId ? [`/api/merged-books/${profileId}`, pageSize] : null,
    ([, size]) => fetchAllMergedBooks(profileId!, size as number),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
      onSuccess: () => setIsDone(true),
      onError: () => setIsDone(true),
    }
  );

  return {
    data: data || [],
    isLoading,
    error: error || null,
    isDone: isDone || (!isLoading && !!data),
  };
}
