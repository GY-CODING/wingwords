 
'use server';

import { headers, cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
import { Profile } from '@gycoding/nebula';

export default async function getAccountsUser(
  id: string
): Promise<Profile | null> {
  if (!id) throw new Error('No username provided in formData');

  const session = await auth0.getSession();
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3001';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const urlPrivate = `${protocol}://${host}/api/auth/books/profiles/${id}`;
  const urlPublic = `${protocol}://${host}/api/public/books/profiles/${id}`;

  // Si hay sesión, intenta privada primero
  if (session?.user) {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      const privateRes = await fetch(urlPrivate, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        credentials: 'include',
        cache: 'no-store',
      });
      const privateText = await privateRes.clone().text();
      if (privateRes.ok) {
        return JSON.parse(privateText) as Profile;
      }
      // Si la privada no va, sigue a la pública
    } catch (error) {
      console.warn('[DEBUG] Error in private fetch:', error);
    }
  }

  // Si no hay sesión o la privada falla, intenta pública
  try {
    const publicRes = await fetch(urlPublic, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const publicText = await publicRes.clone().text();
    if (publicRes.ok) {
      return JSON.parse(publicText) as Profile;
    }
    console.warn('[DEBUG] Public fetch failed:', publicRes.status, publicText);
    return null;
  } catch (error) {
    console.warn('[DEBUG] Error in public fetch:', error);
    return null;
  }
}
