import { User } from '@/domain/user.model';
import { auth0 } from '@/lib/auth0';
import clientPromise from '@/lib/mongodb';
import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth0.getSession();

  if (!session) {
    logger.warn('No active session found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.sub;
  logger.debug('Session retrieved', { userId });

  if (!userId) {
    return NextResponse.json({ error: 'No user session' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('GYAccounts');
    const dbBooks = client.db('GYBooks');
    const userDoc = await db.collection('Metadata').findOne({ userId });

    if (!userDoc) {
      logger.warn('User not found', { userId });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileId = userDoc.profile?.id;
    const userBooksDoc = await dbBooks
      .collection('Metadata')
      .findOne({ profileId });

    logger.info('User retrieved', { profileId });

    return NextResponse.json({
      ...userDoc.profile,
      biography: userBooksDoc?.biography || '',
    } as User);
  } catch (error) {
    logger.error('User could not be retrieved', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
