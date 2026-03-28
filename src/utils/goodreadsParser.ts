export type GoodreadsShelf = 'read' | 'to-read' | 'currently-reading';

export interface GoodreadsBook {
  goodreadsId: string;
  title: string;
  author: string;
  isbn: string;
  myRating: number;
  averageRating: number;
  shelf: GoodreadsShelf;
  dateRead: string | null;
  dateAdded: string;
  publisher: string;
  yearPublished: string;
  review: string | null;
}

/**
 * Parses a raw CSV string exported from Goodreads.
 * Handles quoted fields (including commas inside quotes) per RFC 4180.
 */
export function parseGoodreadsCSV(csvContent: string): GoodreadsBook[] {
  const lines = splitCSVLines(csvContent);
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]).map((h) => h.trim());

  const idx = {
    bookId: headers.indexOf('Book Id'),
    title: headers.indexOf('Title'),
    author: headers.indexOf('Author'),
    isbn: headers.indexOf('ISBN'),
    myRating: headers.indexOf('My Rating'),
    averageRating: headers.indexOf('Average Rating'),
    shelf: headers.indexOf('Exclusive Shelf'),
    dateRead: headers.indexOf('Date Read'),
    dateAdded: headers.indexOf('Date Added'),
    publisher: headers.indexOf('Publisher'),
    yearPublished: headers.indexOf('Year Published'),
    review: headers.indexOf('My Review'),
  };

  const books: GoodreadsBook[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVRow(line);

    const shelf = cleanField(cols[idx.shelf] ?? '') as GoodreadsShelf;
    if (!['read', 'to-read', 'currently-reading'].includes(shelf)) continue;

    const title = cleanField(cols[idx.title] ?? '');
    const author = cleanField(cols[idx.author] ?? '');
    if (!title || !author) continue;

    books.push({
      goodreadsId: cleanField(cols[idx.bookId] ?? ''),
      title,
      author,
      isbn: cleanISBN(cols[idx.isbn] ?? ''),
      myRating: parseInt(cols[idx.myRating] ?? '0', 10) || 0,
      averageRating: parseFloat(cols[idx.averageRating] ?? '0') || 0,
      shelf,
      dateRead: cleanField(cols[idx.dateRead] ?? '') || null,
      dateAdded: cleanField(cols[idx.dateAdded] ?? ''),
      publisher: cleanField(cols[idx.publisher] ?? ''),
      yearPublished: cleanField(cols[idx.yearPublished] ?? ''),
      review:
        idx.review !== -1 ? cleanField(cols[idx.review] ?? '') || null : null,
    });
  }

  return books;
}

/**
 * Splits CSV content into lines, respecting quoted multi-line fields.
 */
function splitCSVLines(csv: string): string[] {
  const lines: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      insideQuotes = !insideQuotes;
      current += ch;
    } else if (ch === '\n' && !insideQuotes) {
      lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Parses a single CSV row into an array of raw field strings.
 */
function parseCSVRow(row: string): string[] {
  const fields: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (insideQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (ch === ',' && !insideQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/** Strips surrounding quotes and whitespace from a field value. */
function cleanField(value: string): string {
  return value.replace(/^"+|"+$/g, '').trim();
}

/** Goodreads exports ISBNs as ="0000000000" — strip that wrapper. */
function cleanISBN(value: string): string {
  return cleanField(value)
    .replace(/^=?"?|"?$/g, '')
    .replace(/=/g, '');
}
