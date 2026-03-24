/* eslint-disable @typescript-eslint/no-unused-vars */
import { Activity, feedActivity } from '@/domain/activity.model';
import { useCallback, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useUserProfiles } from './useUserProfiles';
import {
  cleanActivityMessage,
  extractBookId,
  formatRelativeDate,
  sortActivitiesByDate,
} from './utils/activityHelpers';

/**
 * Interface para actividades de amigos con información del usuario
 */
export interface FriendActivity extends Activity {
  /** profileId del autor de la actividad */
  profileId: string;
  userId: string;
  username: string | null;
  userPicture: string | null;
  /** Array de profileIds que han dado like */
  likes: string[];
}

/**
 * Interface para el resultado del hook
 */
export interface UseFriendsActivityFeedResult {
  activities: FriendActivity[];
  bookIds: string[];
  isLoading: boolean;
  error: Error | null;
  loadMore?: () => void;
  hasNext?: boolean;
  isLoadingMore?: boolean;
}

/**
 * Fetcher para obtener actividades
 */
async function fetchFriendsActivityFeed(): Promise<feedActivity[]> {
  const response = await fetch('/api/auth/books/activity', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) {
      return [];
    }
    throw new Error(`Failed to fetch friends activity: ${response.status}`);
  }

  const data = await response.json();
  return data as feedActivity[];
}
type PageResult = {
  activities: feedActivity[];
  hasNext: boolean;
};

const PAGE_SIZE = 50;

async function fetchPage(key: string): Promise<PageResult> {
  // key expected: '/api/auth/books/activity?page=X&size=Y'
  const query = key.split('?')[1] || '';
  const params = new URLSearchParams(query);
  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? PAGE_SIZE);

  const response = await fetch(
    `/api/auth/books/activity?page=${page}&size=${size}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    if (response.status === 401) return { activities: [], hasNext: false };
    throw new Error(`Failed to fetch friends activity: ${response.status}`);
  }

  const data = (await response.json()) as feedActivity[];
  const hasNext = response.headers.get('X-Has-Next') === 'true';
  return { activities: data, hasNext };
}

export function useFriendsActivityFeed(): UseFriendsActivityFeedResult {
  // 1. Actividades paginadas con SWR Infinite
  // Nota: el waterfall activities → profiles es inherente (necesitamos los profileIds
  // de las actividades para poder pedir los perfiles). La solución real requiere que
  // el backend embeba los perfiles en la respuesta. Mientras tanto:
  // - keepPreviousData: muestra datos cacheados instantáneamente en navegación
  // - revalidateOnFocus + refreshInterval: sensación near-realtime sin WebSockets
  // - profiles cache (120s dedup): el segundo paso es casi instantáneo en visitas repetidas
  const {
    data: pages,
    error,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite<PageResult>(
    (index) => `/api/auth/books/activity?page=${index}&size=${PAGE_SIZE}`,
    fetchPage,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  );

  // 2. Extraer profileIds únicos (usando profileId del modelo FeedActivity)
  const allActivities = useMemo(
    () => (pages ? pages.flatMap((p) => p.activities) : []),
    [pages]
  );

  const uniqueProfileIds = useMemo(() => {
    if (!allActivities || allActivities.length === 0) return [];
    const ids = Array.from(
      new Set(
        allActivities
          .map((activity) => activity.profileId)
          .filter((id): id is string => Boolean(id))
      )
    );
    return ids;
  }, [allActivities]);

  // 3. Obtener perfiles con hook optimizado (con caché SWR)
  const { profiles, isLoading: loadingProfiles } =
    useUserProfiles(uniqueProfileIds);

  // 4. Procesar actividades: agregar username y picture
  const processedActivities: FriendActivity[] = useMemo(() => {
    if (!allActivities || allActivities.length === 0) return [];

    const processed = allActivities
      .map((activity) => {
        // Obtener perfil usando profileId (puede estar cargando aún)
        const userProfile = profiles[activity.profileId];

        // Extraer datos del perfil o null para mostrar skeleton
        const username = userProfile?.username || null;
        const userPicture = userProfile?.picture || null;

        // Procesar datos de la actividad
        const bookId = extractBookId(activity.message);
        const cleanedMessage = cleanActivityMessage(activity.message);
        const formattedDate = formatRelativeDate(activity.date);

        return {
          activityId: activity.id,
          profileId: activity.profileId,
          userId: activity.userId,
          username,
          userPicture,
          bookId: bookId || activity.bookId,
          message: cleanedMessage,
          date: new Date(activity.date),
          formattedDate,
          likes: activity.likes ?? [],
        };
      })
      .sort(sortActivitiesByDate);

    return processed;
  }, [allActivities, profiles]);

  // 5. Extraer bookIds únicos
  const bookIds = useMemo(() => {
    const ids = processedActivities
      .map((activity) => activity.bookId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [processedActivities]);

  const hasNext = useMemo(() => {
    if (!pages || pages.length === 0) return false;
    return pages[pages.length - 1].hasNext;
  }, [pages]);

  const loadMore = useCallback(() => {
    if (hasNext) setSize((s) => s + 1);
  }, [hasNext, setSize]);

  const isLoading = !pages && !error;
  const isLoadingMore = isValidating && size > 1;

  return {
    activities: processedActivities,
    bookIds,
    isLoading,
    error: error || null,
    loadMore,
    hasNext,
    isLoadingMore,
  };
}
