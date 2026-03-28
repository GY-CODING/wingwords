import type { GoodreadsBook, GoodreadsShelf } from './goodreadsParser';
import { splitCSVLines, parseCSVRow, cleanField } from './goodreadsParser';

const STATUS_TO_SHELF: Record<string, GoodreadsShelf | undefined> = {
  Read: 'read',
  'Currently Reading': 'currently-reading',
  'Want to Read': 'to-read',
};

/**
 * Detects whether a CSV is a Goodreads or Hardcover export based on its header row.
 */
export function detectCsvFormat(
  csvContent: string
): 'goodreads' | 'hardcover' | 'unknown' {
  const firstLine = csvContent.split('\n')[0] ?? '';
  if (firstLine.includes('Hardcover Book ID')) return 'hardcover';
  if (firstLine.includes('Exclusive Shelf')) return 'goodreads';
  return 'unknown';
}

/**
 * Parses a Hardcover CSV export into GoodreadsBook-shaped objects so the
 * existing import flow can handle both formats transparently.
 *
 * Field mapping:
 * - Hardcover Book ID   → goodreadsId  (used as the unique row key)
 * - Hardcover Edition ID → hardcoverEditionId
 * - Status              → shelf  (Read / Currently Reading / Want to Read)
 * - Rating              → myRating  (Hardcover uses 0–5 float)
 * - Date Finished       → dateRead
 * - Date Started        → dateStarted
 * - Date Added          → dateAdded
 */
export function parseHardcoverCSV(csvContent: string): GoodreadsBook[] {
  const lines = splitCSVLines(csvContent);
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0] ?? '').map((h) => cleanField(h));

  const idx = {
    title: headers.indexOf('Title'),
    author: headers.indexOf('Author'),
    status: headers.indexOf('Status'),
    hardcoverBookId: headers.indexOf('Hardcover Book ID'),
    hardcoverEditionId: headers.indexOf('Hardcover Edition ID'),
    isbn13: headers.indexOf('ISBN 13'),
    isbn10: headers.indexOf('ISBN 10'),
    publisher: headers.indexOf('Publisher'),
    publishDate: headers.indexOf('Publish Date'),
    rating: headers.indexOf('Rating'),
    review: headers.indexOf('Review'),
    dateAdded: headers.indexOf('Date Added'),
    dateStarted: headers.indexOf('Date Started'),
    dateFinished: headers.indexOf('Date Finished'),
  };

  // Require the critical Hardcover-specific columns to be present
  if (idx.hardcoverBookId === -1 || idx.status === -1) return [];

  const books: GoodreadsBook[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = parseCSVRow(line);

    const statusRaw = cleanField(cols[idx.status] ?? '');
    const shelf = STATUS_TO_SHELF[statusRaw];
    if (!shelf) continue;

    const title = cleanField(cols[idx.title] ?? '');
    const author = cleanField(cols[idx.author] ?? '');
    if (!title || !author) continue;

    const hardcoverBookId = cleanField(cols[idx.hardcoverBookId] ?? '');
    if (!hardcoverBookId) continue;

    const hardcoverEditionId =
      cleanField(cols[idx.hardcoverEditionId] ?? '') || undefined;
    const ratingRaw = cleanField(cols[idx.rating] ?? '');
    const rating = ratingRaw ? parseFloat(ratingRaw) : 0;
    const isbn =
      cleanField(cols[idx.isbn13] ?? '') || cleanField(cols[idx.isbn10] ?? '');

    // First author segment only (Hardcover lists translators too, e.g. "Brandon Sanderson, Rafael...")
    const primaryAuthor = cleanField(author.split(',')[0] ?? author);

    books.push({
      goodreadsId: hardcoverBookId,
      title,
      author: primaryAuthor,
      isbn,
      myRating: rating,
      averageRating: 0,
      shelf,
      dateRead: cleanField(cols[idx.dateFinished] ?? '') || null,
      dateAdded: cleanField(cols[idx.dateAdded] ?? ''),
      dateStarted: cleanField(cols[idx.dateStarted] ?? '') || null,
      publisher: cleanField(cols[idx.publisher] ?? ''),
      yearPublished:
        cleanField(cols[idx.publishDate] ?? '').split('-')[0] ?? '',
      review: cleanField(cols[idx.review] ?? '') || null,
      hardcoverEditionId,
    });
  }

  return books;
}
