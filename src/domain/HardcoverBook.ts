import { findEditionById } from '@/utils/bookEditionHelpers';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import type { EBookStatus, UserData } from '@gycoding/nebula';

export interface Series {
  id: number;
  name: string;
}

export interface Cover {
  url?: string;
}

export interface AuthorImage {
  url: string;
}

export interface Author {
  id: number;
  name: string;
  image: AuthorImage;
  biography: string;
}

export interface Edition {
  id: number;
  book_id: number;
  title: string;
  pages: number | null;
  cached_image?: {
    id: number;
    url: string;
    color: string;
    width: number;
    height: number;
    color_name: string;
  } | null;
  language?: {
    language: string;
    id: number;
  } | null;
}

export default interface HardcoverBook {
  id: string;
  title: string;
  series: Series[];
  cover: Cover;
  pageCount: number;
  author: Author;
  description: string;
  averageRating: number;
  status?: EBookStatus;
  editions?: Edition[];
  userData?: UserData;
}

/**
 * Helper class with static methods for working with Book objects
 */
export class BookHelpers {
  /**
   * Obtiene la edición seleccionada basada en el editionId del userData
   */
  static getSelectedEdition(book: HardcoverBook): Edition | null {
    if (!book.userData?.editionId || !book.editions) {
      return null;
    }

    return findEditionById(book.editions, book.userData.editionId);
  }

  /**
   * Obtiene el título a mostrar (de la edición seleccionada o del libro)
   */
  static getDisplayTitle(book: HardcoverBook): string {
    const selectedEdition = this.getSelectedEdition(book);
    return selectedEdition?.title || book.title;
  }

  /**
   * Obtiene la URL de la imagen a mostrar (de la edición seleccionada o del libro)
   */
  static getDisplayCoverUrl(book: HardcoverBook): string {
    const selectedEdition = this.getSelectedEdition(book);
    return (
      selectedEdition?.cached_image?.url ||
      book.cover.url ||
      DEFAULT_COVER_IMAGE
    );
  }

  /**
   * Verifica si el libro tiene una edición específica seleccionada
   */
  static hasSelectedEdition(book: HardcoverBook): boolean {
    return this.getSelectedEdition(book) !== null;
  }

  /**
   * Obtiene una edición válida con páginas.
   * Prioriza la edición seleccionada y luego busca la primera edición del libro que tenga páginas.
   */
  static getEditionWithPages(book: HardcoverBook): Edition | null {
    const selectedEdition = this.getSelectedEdition(book);
    if (selectedEdition?.pages && selectedEdition.pages > 0) {
      return selectedEdition;
    }

    if (!book.editions) {
      return null;
    }

    return (
      book.editions.find(
        (edition) => typeof edition.pages === 'number' && edition.pages > 0
      ) || null
    );
  }
}
