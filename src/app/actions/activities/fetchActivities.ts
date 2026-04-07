'use server';

import { Activity, feedActivity } from '@/domain/activity.model';
import { cookies, headers } from 'next/headers';

export async function fetchActivities(): Promise<Activity[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3001';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const url = `${protocol}://${host}/api/auth/books/activity`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (response.status === 401) {
      // Usuario no autenticado, retornar array vacío
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchActivities] Error:', response.status, errorText);
      throw new Error(`Failed to fetch activities: ${response.status}`);
    }

    const data = await response.json();
    return data as feedActivity[];
  } catch (error) {
    console.error('[fetchActivities] Exception:', error);
    throw error;
  }
}
