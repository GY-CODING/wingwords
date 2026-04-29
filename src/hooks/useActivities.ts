/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchActivities } from '@/app/actions/book/activities/fetchActivities';
import { Activity } from '@/domain/activity.model';
import { SWR_KEYS } from '@/lib/swrKeys';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import useSWR from 'swr';

interface useActivitiesProps {
  data: any | undefined;
  isLoading: boolean;
  error: Error | null;
  formattedActivities?: Activity[];
  uniqueBookIds: string[];
}

export function useActivities(id?: UUID): useActivitiesProps {
  const { data, isLoading, error } = useSWR(
    id ? SWR_KEYS.activities(id) : null,
    () => fetchActivities(id!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  // Filtrar, ordenar y formatear las actividades
  const formattedActivities =
    data
      ?.filter((activity: any) => activity.date) // Filtrar actividades con fecha válida
      .sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Ordenar de más reciente a más antigua
      })
      .map((activity: any) => ({
        activityId: activity.id as string | undefined,
        bookId: activity.message.match(/\[(.*?)\]/)?.[1] || '', // Extraer el ID del mensaje
        message: activity.message.replace(/\[.*?\]\s*/, ''),
        date: activity.date,
        formattedDate: new Date(activity.date).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        likes: activity.likes,
      })) || undefined;

  // Extraer IDs únicos de libros para usar con useHardcoverBatch
  const uniqueBookIds = useMemo(() => {
    if (!formattedActivities) return [];
    const ids = formattedActivities
      .map((activity) => activity.bookId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [formattedActivities]);

  return {
    data: formattedActivities,
    isLoading,
    error,
    uniqueBookIds,
  };
}
