/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * ⚠️ DEPRECATED: Este hook ha sido reemplazado por useFriendsActivityFeed
 *
 * **Por qué está deprecado:**
 * - Este hook hace N requests (uno por amigo) = lento y costoso
 * - El nuevo hook usa un endpoint único optimizado que hace JOIN en backend
 * - Mejora de rendimiento: ~5-10x más rápido
 *
 * **Usa en su lugar:**
 * ```typescript
 * import { useFriendsActivityFeed } from '@/hooks/activities/useFriendsActivityFeed';
 *
 * const { activities, bookIds, isLoading, error } = useFriendsActivityFeed();
 * ```
 *
 * @deprecated Use useFriendsActivityFeed instead
 * @see src/hooks/activities/useFriendsActivityFeed.ts
 */

import { useMemo } from 'react';
import useSWR from 'swr';
import { useFriends } from '@/hooks/useFriends';
import { Activity } from '@/domain/activity.model';
import { UUID } from 'crypto';
import {
  sortActivitiesByDate,
  extractBookId,
  formatRelativeDate,
  cleanActivityMessage,
} from '@/hooks/activities/utils/activityHelpers';

export interface FriendActivity extends Activity {
  userId: UUID;
  username: string;
  userPicture: string;
}

interface UseFriendsActivityResult {
  activities: FriendActivity[];
  bookIds: string[];
  isLoading: boolean;
  error: Error | null;
}

// Fetcher function que obtiene actividades de múltiples amigos
async function fetchAllFriendsActivities(
  friendIds: UUID[]
): Promise<Map<UUID, Activity[]>> {
  const activitiesMap = new Map<UUID, Activity[]>();

  await Promise.all(
    friendIds.map(async (friendId) => {
      try {
        const response = await fetch(
          `/api/public/books/profiles/${friendId}/activity`
        );
        if (response.ok) {
          const data = await response.json();
          activitiesMap.set(friendId, data);
        }
      } catch (error) {
        console.error(
          `[useFriendsActivity] Error fetching activities for ${friendId}:`,
          error
        );
      }
    })
  );

  return activitiesMap;
}

export function useFriendsActivity(): UseFriendsActivityResult {
  const { data: friends, isLoading: friendsLoading } = useFriends();

  // Crear keys para SWR basadas en los IDs de los amigos
  const friendIds = useMemo(() => {
    return friends?.map((friend) => friend.id) || [];
  }, [friends]);

  // Usar un único SWR que obtiene todas las actividades
  const {
    data: activitiesMap,
    isLoading: activitiesLoading,
    error,
  } = useSWR(
    friendIds.length > 0
      ? `/api/friends/activities?ids=${friendIds.join(',')}`
      : null,
    () => fetchAllFriendsActivities(friendIds),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  const isLoading = friendsLoading || activitiesLoading;

  // Formatear y combinar todas las actividades
  const processedActivities: FriendActivity[] = useMemo(() => {
    if (!friends || !activitiesMap) {
      return [];
    }

    const combined: FriendActivity[] = [];

    friends.forEach((friend) => {
      const activities = activitiesMap.get(friend.id);

      if (activities) {
        activities
          .filter((activity: Activity) => activity.date)
          .forEach((activity: Activity) => {
            const bookId = extractBookId(activity.message);
            const cleanedMessage = cleanActivityMessage(activity.message);
            const formattedDate = formatRelativeDate(activity.date);

            combined.push({
              ...activity,
              bookId: bookId || activity.bookId,
              message: cleanedMessage,
              date: new Date(activity.date),
              formattedDate,
              userId: friend.id,
              username: friend.username,
              userPicture: friend.picture,
            });
          });
      }
    });

    // Ordenar todas las actividades por fecha (más reciente primero)
    const sorted = combined.sort(sortActivitiesByDate);

    return sorted;
  }, [friends, activitiesMap]);

  // Extraer IDs únicos de libros para batch fetch
  const bookIds = useMemo(() => {
    const ids = processedActivities
      .map((activity) => activity.bookId)
      .filter((id): id is string => Boolean(id));
    const uniqueIds = Array.from(new Set(ids));
    return uniqueIds;
  }, [processedActivities]);

  return {
    activities: processedActivities,
    bookIds,
    isLoading,
    error: error || null,
  };
}
