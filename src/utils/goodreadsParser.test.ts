import { parseGoodreadsCSV } from './goodreadsParser';

const CSV_HEADER =
  'Book Id,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Average Rating,Publisher,Binding,Number of Pages,Year Published,Original Publication Year,Date Read,Date Added,Bookshelves,Bookshelves with positions,Exclusive Shelf,My Review,Spoiler,Private Notes,Read Count,Owned Copies';

function makeRow(overrides: Partial<Record<string, string>> = {}): string {
  const defaults: Record<string, string> = {
    'Book Id': '1',
    Title: 'The Way of Kings',
    Author: 'Brandon Sanderson',
    'Author l-f': 'Sanderson, Brandon',
    'Additional Authors': '',
    ISBN: '="0765326353"',
    ISBN13: '="9780765326355"',
    'My Rating': '5',
    'Average Rating': '4.64',
    Publisher: 'Tor Books',
    Binding: 'Hardcover',
    'Number of Pages': '1007',
    'Year Published': '2010',
    'Original Publication Year': '2010',
    'Date Read': '2024/01/15',
    'Date Added': '2023/12/01',
    Bookshelves: '',
    'Bookshelves with positions': '',
    'Exclusive Shelf': 'read',
    'My Review': '',
    Spoiler: '',
    'Private Notes': '',
    'Read Count': '1',
    'Owned Copies': '0',
  };
  const merged = { ...defaults, ...overrides };
  return Object.values(merged)
    .map((v) =>
      (v ?? '').includes(',') || (v ?? '').includes('"')
        ? `"${v ?? ''}"`
        : (v ?? '')
    )
    .join(',');
}

function buildCSV(rows: string[]): string {
  return [CSV_HEADER, ...rows].join('\n');
}

describe('parseGoodreadsCSV', () => {
  describe('basic parsing', () => {
    it('returns empty array for CSV with only headers', () => {
      expect(parseGoodreadsCSV(CSV_HEADER)).toEqual([]);
    });

    it('returns empty array for empty string', () => {
      expect(parseGoodreadsCSV('')).toEqual([]);
    });

    it('parses a single read book correctly', () => {
      const csv = buildCSV([makeRow()]);
      const result = parseGoodreadsCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        goodreadsId: '1',
        title: 'The Way of Kings',
        author: 'Brandon Sanderson',
        myRating: 5,
        averageRating: 4.64,
        shelf: 'read',
        dateRead: '2024/01/15',
        dateAdded: '2023/12/01',
      });
    });

    it('parses to-read shelf', () => {
      const csv = buildCSV([
        makeRow({ 'Exclusive Shelf': 'to-read', 'Date Read': '' }),
      ]);
      const result = parseGoodreadsCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0].shelf).toBe('to-read');
      expect(result[0].dateRead).toBeNull();
    });

    it('parses currently-reading shelf', () => {
      const csv = buildCSV([
        makeRow({ 'Exclusive Shelf': 'currently-reading' }),
      ]);
      const result = parseGoodreadsCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0].shelf).toBe('currently-reading');
    });

    it('skips rows with unknown shelf', () => {
      const csv = buildCSV([makeRow({ 'Exclusive Shelf': 'favorites' })]);
      expect(parseGoodreadsCSV(csv)).toHaveLength(0);
    });

    it('skips rows with missing title', () => {
      const csv = buildCSV([makeRow({ Title: '' })]);
      expect(parseGoodreadsCSV(csv)).toHaveLength(0);
    });

    it('skips rows with missing author', () => {
      const csv = buildCSV([makeRow({ Author: '' })]);
      expect(parseGoodreadsCSV(csv)).toHaveLength(0);
    });

    it('parses multiple books', () => {
      const csv = buildCSV([
        makeRow({ 'Book Id': '1', Title: 'Book A', Author: 'Author A' }),
        makeRow({
          'Book Id': '2',
          Title: 'Book B',
          Author: 'Author B',
          'Exclusive Shelf': 'to-read',
        }),
        makeRow({
          'Book Id': '3',
          Title: 'Book C',
          Author: 'Author C',
          'Exclusive Shelf': 'currently-reading',
        }),
      ]);
      const result = parseGoodreadsCSV(csv);
      expect(result).toHaveLength(3);
    });
  });

  describe('ISBN cleaning', () => {
    it('strips Goodreads ="<isbn>" notation', () => {
      const csv = buildCSV([makeRow({ ISBN: '="0765326353"' })]);
      const result = parseGoodreadsCSV(csv);
      expect(result[0].isbn).toBe('0765326353');
    });

    it('handles empty ISBN', () => {
      const csv = buildCSV([makeRow({ ISBN: '' })]);
      const result = parseGoodreadsCSV(csv);
      expect(result[0].isbn).toBe('');
    });
  });

  describe('rating parsing', () => {
    it('parses integer rating correctly', () => {
      const csv = buildCSV([makeRow({ 'My Rating': '4' })]);
      expect(parseGoodreadsCSV(csv)[0].myRating).toBe(4);
    });

    it('defaults to 0 for missing rating', () => {
      const csv = buildCSV([makeRow({ 'My Rating': '' })]);
      expect(parseGoodreadsCSV(csv)[0].myRating).toBe(0);
    });
  });

  describe('date handling', () => {
    it('returns null for empty dateRead', () => {
      const csv = buildCSV([makeRow({ 'Date Read': '' })]);
      expect(parseGoodreadsCSV(csv)[0].dateRead).toBeNull();
    });

    it('preserves dateAdded string', () => {
      const csv = buildCSV([makeRow({ 'Date Added': '2025/06/15' })]);
      expect(parseGoodreadsCSV(csv)[0].dateAdded).toBe('2025/06/15');
    });
  });

  describe('review parsing', () => {
    it('captures review text', () => {
      const csv = buildCSV([makeRow({ 'My Review': 'Great book!' })]);
      expect(parseGoodreadsCSV(csv)[0].review).toBe('Great book!');
    });

    it('returns null for empty review', () => {
      const csv = buildCSV([makeRow({ 'My Review': '' })]);
      expect(parseGoodreadsCSV(csv)[0].review).toBeNull();
    });
  });

  describe('RFC 4180 quoted fields', () => {
    it('handles commas inside quoted title', () => {
      // Columns: BookId,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Avg Rating,Publisher,Binding,Pages,Year,Orig Year,Date Read,Date Added,Bookshelves,Bookshelves w/ positions,Exclusive Shelf,My Review,...
      const row =
        '42,"Mistborn: The Final Empire, Anniversary Edition",Brandon Sanderson,,,="0765311785",,5,4.44,Tor Books,Paperback,533,2006,2006,2024/03/01,2024/01/01,,,read,,,,';
      const csv = buildCSV([row]);
      const result = parseGoodreadsCSV(csv);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe(
        'Mistborn: The Final Empire, Anniversary Edition'
      );
    });

    it('handles multi-line review in quoted field', () => {
      // Exclusive Shelf at col 18, My Review at col 19
      const row = `1,"The Way of Kings",Brandon Sanderson,,,="0765326353",,5,4.64,Tor Books,Hardcover,1007,2010,2010,2024/01/15,2023/12/01,,,read,"Line one\nLine two",,,,`;
      // The parser should not crash and should return the book
      const csv = `${CSV_HEADER}\n${row}`;
      const result = parseGoodreadsCSV(csv);
      expect(result[0].title).toBe('The Way of Kings');
    });

    it('handles blank lines at end of file', () => {
      const csv = buildCSV([makeRow()]) + '\n\n';
      const result = parseGoodreadsCSV(csv);
      expect(result).toHaveLength(1);
    });
  });
});
