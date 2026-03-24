import useSWR from 'swr';
import { useMemo } from 'react';

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
  data: ProfileBookSummary[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * useProfileBooks
 *
 * Recupera todos los items (paginados) de la API de Spring para un perfil.
 *
 * ## Optimizaciones de SWR:
 * - **dedupingInterval: 5000ms** - Evita peticiones duplicadas durante 5 segundos
 * - **keepPreviousData: true** - Mantiene datos previos mientras revalida (evita UI vacía)
 * - **revalidateOnFocus: false** - No revalida al volver al tab (ahorra peticiones)
 * - **revalidateOnReconnect: true** - Sí revalida al recuperar conexión (datos frescos)
 * - **shouldRetryOnError: false** - No reintenta automáticamente en error (evita spam)
 *
 * ## Paginación:
 * - Llama a `/api/public/books?profileId=${profileId}&page=${page}&size=${size}`
 * - Acumula páginas hasta que la página devuelta sea menor al tamaño
 * - La key de SWR incluye profileId y pageSize para cache consistente
 *
 * @param profileId - ID del perfil del usuario
 * @param pageSize - Tamaño de página (default: 50)
 * @returns Objeto con data (array de summaries), isLoading y error
 */
export function useProfileBooks(profileId?: string, pageSize = 50): Result {
  // Fetcher que maneja la paginación completa
  const fetcher = async (key: string) => {
    // Extraer profileId del key
    const [, id] = key.split('|');
    if (!id) return [];

    const accumulated: ProfileBookSummary[] = [];
    let page = 0;

    while (true) {
      const url = `/api/public/books?profileId=${id}&page=${page}&size=${pageSize}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const pageData = (await res.json()) as ProfileBookSummary[];

      if (!Array.isArray(pageData) || pageData.length === 0) break;
      accumulated.push(...pageData);

      if (pageData.length < pageSize) break;
      page += 1;
    }

    return accumulated;
  };

  // Key estable para SWR (null cuando no hay profileId)
  const swrKey = profileId ? `profile-books|${profileId}|${pageSize}` : null;

  const { data, error, isLoading } = useSWR<ProfileBookSummary[], Error>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      keepPreviousData: true, // Mantener datos previos mientras carga
      shouldRetryOnError: false, // No reintentar automáticamente
    }
  );

  // Memoizar para retornar array vacío estable cuando no hay data
  const stableData = useMemo(() => data ?? [], [data]);

  return {
    data: stableData,
    isLoading,
    error: error ?? null,
  };
}

export default useProfileBooks;
