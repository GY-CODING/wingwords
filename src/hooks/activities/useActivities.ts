import useSWR from 'swr';
import { Activity } from '@/domain/activity.model';
import { fetchActivities } from '@/app/actions/activities/fetchActivities';
import { SWR_KEYS } from '@/lib/swrKeys';
import {
  sortActivitiesByDate,
  extractBookId,
  formatActivityDate,
  cleanActivityMessage,
} from './utils/activityHelpers';

interface UseActivitiesResult {
  activities: Activity[];
  bookIds: string[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function useActivities(): UseActivitiesResult {
  const { data, isLoading, error, mutate } = useSWR(
    SWR_KEYS.myActivities,
    fetchActivities,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000, // 1 minuto
      keepPreviousData: true, // Muestra datos previos mientras revalida
    }
  );

  // Process activities
  const processedActivities: Activity[] = (data || [])
    .map((activity) => {
      const bookId = extractBookId(activity.message);
      const cleanedMessage = cleanActivityMessage(activity.message);
      const formattedDate = formatActivityDate(activity.date);

      return {
        ...activity,
        bookId: bookId || activity.bookId,
        message: cleanedMessage,
        formattedDate,
        date: new Date(activity.date),
      };
    })
    .sort(sortActivitiesByDate);

  // Extract unique book IDs for batch fetch
  const bookIds = Array.from(
    new Set(
      processedActivities
        .map((activity) => activity.bookId)
        .filter((id): id is string => Boolean(id))
    )
  );

  return {
    activities: processedActivities,
    bookIds,
    isLoading,
    error: error || null,
    mutate,
  };
}
