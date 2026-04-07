/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { ECommands } from '@/utils/constants/ECommands';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function manageRequest(
  formData: FormData
): Promise<boolean> {
  try {
    const requestId = formData.get('requestId') as string;
    const command = formData.get('command') as string;

    if (!requestId) {
      throw new Error('User ID is required');
    }

    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3001';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/books/friends/manage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          requestId: requestId,
          command: command as ECommands,
        }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      return true;
    }

    // For other successful responses, try to parse JSON
    const data = await response.json();
    if (!data) {
      throw new Error('No ApiFriendRequest data received from server');
    }

    return true;
  } catch (error: any) {
    throw new Error(`Failed to manage request: ${error.message}`);
  }
}
