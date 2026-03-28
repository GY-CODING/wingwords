import { EBookStatus } from '@gycoding/nebula';
import {
  mapGoodreadsBookToUserData,
  buildRateBookFormData,
} from './goodreadsImport.mapper';
import type { GoodreadsBook } from '@/utils/goodreadsParser';

const makeBook = (overrides: Partial<GoodreadsBook> = {}): GoodreadsBook => ({
  goodreadsId: '1',
  title: 'The Way of Kings',
  author: 'Brandon Sanderson',
  isbn: '0765326353',
  myRating: 5,
  averageRating: 4.64,
  shelf: 'read',
  dateRead: '2024/01/15',
  dateAdded: '2023/12/01',
  publisher: 'Tor Books',
  yearPublished: '2010',
  review: 'Amazing book!',
  ...overrides,
});

describe('mapGoodreadsBookToUserData', () => {
  describe('shelf → status mapping', () => {
    it('maps "read" shelf to EBookStatus.READ', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ shelf: 'read' }));
      expect(result.status).toBe(EBookStatus.READ);
    });

    it('maps "to-read" shelf to EBookStatus.WANT_TO_READ', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ shelf: 'to-read' }));
      expect(result.status).toBe(EBookStatus.WANT_TO_READ);
    });

    it('maps "currently-reading" shelf to EBookStatus.READING', () => {
      const result = mapGoodreadsBookToUserData(
        makeBook({ shelf: 'currently-reading' })
      );
      expect(result.status).toBe(EBookStatus.READING);
    });
  });

  describe('progress derivation', () => {
    it('sets progress to 1 for READ books', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ shelf: 'read' }));
      expect(result.progress).toBe(1);
    });

    it('sets progress to 0 for READING books', () => {
      const result = mapGoodreadsBookToUserData(
        makeBook({ shelf: 'currently-reading' })
      );
      expect(result.progress).toBe(0);
    });

    it('sets progress to 0 for WANT_TO_READ books', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ shelf: 'to-read' }));
      expect(result.progress).toBe(0);
    });
  });

  describe('rating', () => {
    it('preserves the myRating value as-is', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ myRating: 4 }));
      expect(result.rating).toBe(4);
    });

    it('maps 0 rating (unrated) to 0', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ myRating: 0 }));
      expect(result.rating).toBe(0);
    });
  });

  describe('dates', () => {
    it('maps dateRead to endDate', () => {
      const result = mapGoodreadsBookToUserData(
        makeBook({ dateRead: '2024/03/27' })
      );
      expect(result.endDate).toBe('2024/03/27');
    });

    it('sets endDate to empty string when dateRead is null', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ dateRead: null }));
      expect(result.endDate).toBe('');
    });

    it('always sets startDate to empty string', () => {
      const result = mapGoodreadsBookToUserData(makeBook());
      expect(result.startDate).toBe('');
    });
  });

  describe('review', () => {
    it('maps review text', () => {
      const result = mapGoodreadsBookToUserData(
        makeBook({ review: 'Great read!' })
      );
      expect(result.review).toBe('Great read!');
    });

    it('sets review to empty string when null', () => {
      const result = mapGoodreadsBookToUserData(makeBook({ review: null }));
      expect(result.review).toBe('');
    });
  });
});

describe('buildRateBookFormData', () => {
  it('returns a FormData instance', () => {
    const fd = buildRateBookFormData('hardcover-123', makeBook());
    expect(fd).toBeInstanceOf(FormData);
  });

  it('sets bookId to the provided hardcover book ID', () => {
    const fd = buildRateBookFormData('hardcover-123', makeBook());
    expect(fd.get('bookId')).toBe('hardcover-123');
  });

  it('sets rating as a string', () => {
    const fd = buildRateBookFormData('id', makeBook({ myRating: 5 }));
    expect(fd.get('rating')).toBe('5');
  });

  it('sets status from shelf mapping', () => {
    const fd = buildRateBookFormData('id', makeBook({ shelf: 'read' }));
    expect(fd.get('status')).toBe(EBookStatus.READ);
  });

  it('sets endDate from dateRead', () => {
    const fd = buildRateBookFormData(
      'id',
      makeBook({ dateRead: '2024/01/15' })
    );
    expect(fd.get('endDate')).toBe('2024/01/15');
  });

  it('sets empty endDate when dateRead is null', () => {
    const fd = buildRateBookFormData('id', makeBook({ dateRead: null }));
    expect(fd.get('endDate')).toBe('');
  });

  it('sets progress to "1" for READ books', () => {
    const fd = buildRateBookFormData('id', makeBook({ shelf: 'read' }));
    expect(fd.get('progress')).toBe('1');
  });

  it('sets review text', () => {
    const fd = buildRateBookFormData('id', makeBook({ review: 'Fantastic!' }));
    expect(fd.get('review')).toBe('Fantastic!');
  });
});
