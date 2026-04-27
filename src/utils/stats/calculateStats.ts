import type HardcoverBook from '@/domain/HardcoverBook';
import { BookHelpers } from '@/domain/HardcoverBook';
import { Stats } from '@/domain/stats.model';

/**
 * Returns the most accurate page count for a book:
 * uses the selected edition's pages when available, falls back to book.pageCount.
 */
function resolvePageCount(book: HardcoverBook): number {
  const edition = BookHelpers.getEditionWithPages(book);
  return edition?.pages ?? book.pageCount ?? 0;
}

/**
 * Calcula las estadísticas de una colección de libros.
 */
export function calculateStats(books: HardcoverBook[]): Stats {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const stats: Stats = {
    totalBooks: 0,
    totalPages: 0,
    wantToReadPages: 0,
    authors: {},
    bookStatus: {},
    ratings: {
      distribution: {},
      averageRating: 0,
      totalRatedBooks: 0,
    },
    booksReadThisYear: 0,
    booksReadLastYear: 0,
    avgReadingDays: 0,
    reviewedBooks: 0,
    seriesTracked: 0,
    longestBook: null,
    readingCompletionRate: 0,
    monthlyBooksRead: Array(12).fill(0),
  };

  if (!books || books.length === 0) {
    return stats;
  }

  let totalRatingSum = 0;
  let ratedBooksCount = 0;
  let totalReadingDays = 0;
  let booksWithDates = 0;
  const seriesSet = new Set<string>();

  books.forEach((book) => {
    const { userData } = book;

    if (!userData) return;

    const { status, rating, startDate, endDate, review } = userData;
    const pageCount = resolvePageCount(book);

    stats.totalBooks++;

    // Pages
    if (status === 'READ' || status === 'READING') {
      stats.totalPages += pageCount || 0;
    }
    if (status === 'WANT_TO_READ') {
      stats.wantToReadPages += pageCount || 0;
    }

    // Authors (only READ)
    const authorName = book.author?.name;
    if (authorName && status === 'READ') {
      stats.authors[authorName] = (stats.authors[authorName] || 0) + 1;
    }

    // Book status distribution
    if (status) {
      stats.bookStatus[status] = (stats.bookStatus[status] || 0) + 1;
    }

    // Ratings
    if (rating && rating > 0) {
      const ratingKey = rating.toString();
      stats.ratings.distribution[ratingKey] =
        (stats.ratings.distribution[ratingKey] || 0) + 1;
      totalRatingSum += rating;
      ratedBooksCount++;
    }

    // Books read this/last year (by endDate)
    if (status === 'READ' && endDate) {
      const endDateObj = new Date(endDate);
      const endYear = endDateObj.getFullYear();
      if (endYear === currentYear) {
        stats.booksReadThisYear++;
        stats.monthlyBooksRead[endDateObj.getMonth()]++;
      }
      if (endYear === lastYear) stats.booksReadLastYear++;
    }

    // Avg reading days (READ books with both dates)
    if (status === 'READ' && startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        totalReadingDays += days;
        booksWithDates++;
      }
    }

    // Reviews
    if (review && review.trim().length > 0) {
      stats.reviewedBooks++;
    }

    // Series
    if (book.series && book.series.length > 0) {
      book.series.forEach((s) => seriesSet.add(s.name));
    }

    // Longest book (READ only)
    if (status === 'READ' && pageCount) {
      if (!stats.longestBook || pageCount > stats.longestBook.pages) {
        stats.longestBook = { title: book.title, pages: pageCount };
      }
    }
  });

  // Derived calculations
  if (ratedBooksCount > 0) {
    stats.ratings.averageRating =
      Math.round((totalRatingSum / ratedBooksCount) * 10) / 10;
    stats.ratings.totalRatedBooks = ratedBooksCount;
  }

  if (booksWithDates > 0) {
    stats.avgReadingDays = Math.round(totalReadingDays / booksWithDates);
  }

  stats.seriesTracked = seriesSet.size;

  const readCount = stats.bookStatus['READ'] || 0;
  if (stats.totalBooks > 0) {
    stats.readingCompletionRate = Math.round(
      (readCount / stats.totalBooks) * 100
    );
  }

  return stats;
}

/**
 * Ordena los autores por cantidad de libros leídos (descendente).
 *
 * @param authors - Record con nombre de autor y cantidad de libros
 * @returns Array de [nombre, cantidad] ordenado
 *
 * @example
 * ```typescript
 * const sorted = sortAuthorsByCount({ "Brandon Sanderson": 21, "Tolkien": 5 });
 * // [["Brandon Sanderson", 21], ["Tolkien", 5]]
 * ```
 */
export function sortAuthorsByCount(
  authors: Record<string, number>
): [string, number][] {
  return Object.entries(authors).sort((a, b) => b[1] - a[1]);
}

/**
 * Obtiene el top N de autores más leídos.
 *
 * @param authors - Record con nombre de autor y cantidad de libros
 * @param limit - Número máximo de autores a devolver (default: 10)
 * @returns Array de [nombre, cantidad] con los top N autores
 *
 * @example
 * ```typescript
 * const top5 = getTopAuthors(stats.authors, 5);
 * ```
 */
export function getTopAuthors(
  authors: Record<string, number>,
  limit = 10
): [string, number][] {
  return sortAuthorsByCount(authors).slice(0, limit);
}
