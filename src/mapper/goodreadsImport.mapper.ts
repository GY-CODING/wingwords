import { EBookStatus } from '@gycoding/nebula';
import type { GoodreadsBook, GoodreadsShelf } from '@/utils/goodreadsParser';

/**
 * Maps a Goodreads shelf string to the internal EBookStatus enum.
 */
const SHELF_TO_STATUS: Record<GoodreadsShelf, EBookStatus> = {
  read: EBookStatus.READ,
  'to-read': EBookStatus.WANT_TO_READ,
  'currently-reading': EBookStatus.READING,
};

export interface GoodreadsImportUserData {
  status: EBookStatus;
  rating: number;
  startDate: string;
  endDate: string;
  review: string;
  progress: number;
}

/**
 * Maps a single GoodreadsBook to the UserData shape expected by rateBook / the API.
 *
 * - Shelf → status
 * - myRating (1-5 int) → rating (0-5 float, kept as-is)
 * - dateRead → endDate (ISO string or empty)
 * - review → review
 * - progress is derived from status: READ=1, READING=0, WANT_TO_READ=0
 */
export function mapGoodreadsBookToUserData(
  book: GoodreadsBook
): GoodreadsImportUserData {
  const status = SHELF_TO_STATUS[book.shelf] ?? EBookStatus.WANT_TO_READ;

  const progress =
    status === EBookStatus.READ ? 1 : status === EBookStatus.READING ? 0 : 0;

  return {
    status,
    rating: book.myRating,
    startDate: '',
    endDate: book.dateRead ?? '',
    review: book.review ?? '',
    progress,
  };
}

/**
 * Builds a FormData object compatible with rateBook() from a GoodreadsBook
 * and the resolved Hardcover book id.
 */
export function buildRateBookFormData(
  hardcoverBookId: string,
  goodreadsBook: GoodreadsBook
): FormData {
  const userData = mapGoodreadsBookToUserData(goodreadsBook);
  const fd = new FormData();
  fd.set('bookId', hardcoverBookId);
  fd.set('rating', String(userData.rating));
  fd.set('status', userData.status);
  fd.set('startDate', userData.startDate);
  fd.set('endDate', userData.endDate);
  fd.set('review', userData.review);
  fd.set('progress', String(userData.progress));
  return fd;
}
