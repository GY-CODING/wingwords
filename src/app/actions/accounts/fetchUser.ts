/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { User } from '@/domain/user.model';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function fetchUser(): Promise<User | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3001';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${protocol}://${host}/api/auth/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      // No hay sesión activa
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('No ApiFriendRequest data received from server');
    }

    return data as User;
  } catch (error: any) {
    // Si el error es por no autenticado, devuelve null
    if (error.message && error.message.includes('401')) {
      return null;
    }
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
