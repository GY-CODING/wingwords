import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';
import { EBookStatus } from '@gycoding/nebula';
import { ProfileFilterOptions, ProfileFilters } from './profileTypes';

export class ProfileBookHelpers {
  static generateFilterOptions(
    books: HardcoverBook[],
    t: (key: string) => string
  ): ProfileFilterOptions {
    const statusOptions = [
      { label: t('book.rating.status.reading'), value: EBookStatus.READING },
      { label: t('book.rating.status.read'), value: EBookStatus.READ },
      {
        label: t('book.rating.status.wantToRead'),
        value: EBookStatus.WANT_TO_READ,
      },
    ];

    const authorOptions = Array.from(
      new Set(
        books
          .map((b) => b.author?.name)
          .filter((name): name is string => name != null && name.trim() !== '')
      )
    ).sort();

    const seriesOptions = Array.from(
      new Set(
        books
          .map((b) => b.series?.[0]?.name)
          .filter((name): name is string => name != null && name.trim() !== '')
      )
    ).sort();

    return {
      statusOptions,
      authorOptions,
      seriesOptions,
    };
  }

  static filterBooks(
    books: HardcoverBook[],
    filters: ProfileFilters
  ): HardcoverBook[] {
    return books.filter((book) => {
      const statusOk =
        !filters.status || book.userData?.status === filters.status;
      const authorOk =
        !filters.author || (book.author && book.author.name === filters.author);
      const seriesOk =
        !filters.series ||
        (book.series &&
          book.series.length > 0 &&
          book.series[0]?.name === filters.series);
      const ratingOk =
        filters.rating === 0 ||
        (typeof book.userData?.rating === 'number' &&
          book.userData.rating >= filters.rating);

      const searchOk =
        !filters.search ||
        (BookHelpers.getDisplayTitle(book) &&
          BookHelpers.getDisplayTitle(book)
            .toLowerCase()
            .includes(filters.search.toLowerCase())) ||
        book.author?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        book.series?.[0]?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      return statusOk && authorOk && seriesOk && ratingOk && searchOk;
    });
  }

  static sortBooks(
    books: HardcoverBook[],
    orderBy: string,
    orderDirection: 'asc' | 'desc'
  ): HardcoverBook[] {
    return [...books].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (orderBy) {
        case 'author':
          aValue = a.author?.name || '';
          bValue = b.author?.name || '';
          break;
        case 'series':
          aValue = a.series?.[0]?.name || '';
          bValue = b.series?.[0]?.name || '';
          break;
        case 'rating':
          aValue =
            typeof a.userData?.rating === 'number' ? a.userData.rating : 0;
          bValue =
            typeof b.userData?.rating === 'number' ? b.userData.rating : 0;
          break;
        case 'title':
        default:
          aValue = BookHelpers.getDisplayTitle(a) || '';
          bValue = BookHelpers.getDisplayTitle(b) || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return orderDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return orderDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }

  static removeDuplicateBooks(books: HardcoverBook[]): HardcoverBook[] {
    return books.filter(
      (book, idx, arr) => arr.findIndex((b) => b.id === book.id) === idx
    );
  }
}
