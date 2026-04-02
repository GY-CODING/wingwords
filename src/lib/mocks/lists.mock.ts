import { BookList } from '@/domain/list.model';
import { UUID } from 'crypto';

/**
 * Mock lists used while the backend /lists endpoint is not yet published.
 * Each BookListItem.id is a Hardcover book ID.
 * Replace this file with real API calls once the backend is live.
 */
export const MOCK_LISTS: BookList[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as UUID,
    name: 'To Buy',
    description: 'Books I want to buy and have it physically on my shelf',
    books: [
      { id: '374131', order: 1 },
      { id: '386446', order: 2 },
      { id: '427522', order: 3 },
      { id: '459452', order: 4 },
      { id: '665261', order: 5 },
    ],
  },
];
