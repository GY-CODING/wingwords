import { logger } from '@/utils/logger';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function getStats(profileId: string): Promise<any> {
  try {
    const response = await fetch(
      `/api/public/accounts/${profileId}/books/stats`
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Error fetching stats', { profileId }, errorText);
      throw new Error(errorText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error in getStats', { profileId }, error);
    throw new Error(
      `Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
