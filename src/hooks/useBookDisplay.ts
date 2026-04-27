import HardcoverBook, { BookHelpers, Edition } from '@/domain/HardcoverBook';
import { useMemo } from 'react';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';

interface BookDisplayData {
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  status: string;
  progress: number;
  pageCount: number;
  hasUserData: boolean;
  selectedEdition: Edition | null;
  hasSelectedEdition: boolean;
}

/**
 * Función helper para obtener los datos de visualización de un libro
 * Esta NO es un hook, se puede usar dentro de loops/callbacks
 * @param book El libro del que obtener los datos de visualización
 * @returns Objeto con los datos de visualización procesados
 */
export function getBookDisplayData(
  book: HardcoverBook
): BookDisplayData | null {
  if (!book) return null;

  const selectedEdition = BookHelpers.getSelectedEdition(book);
  const editionWithPages = BookHelpers.getEditionWithPages(book);

  const title = selectedEdition?.title || book.title || 'Unknown Title';
  const author = book.author?.name || 'Unknown Author';
  const coverUrl =
    selectedEdition?.cached_image?.url ||
    book.cover?.url ||
    DEFAULT_COVER_IMAGE;
  const pageCount =
    selectedEdition?.pages ?? editionWithPages?.pages ?? book.pageCount ?? 0;

  const hasUserData = !!book.userData;
  const rating = book.userData?.rating || 0;
  const status = book.userData?.status || 'UNKNOWN';
  const progress = book.userData?.progress || 0;
  const hasSelectedEdition = BookHelpers.hasSelectedEdition(book);

  return {
    title,
    author,
    coverUrl,
    rating,
    status,
    progress,
    pageCount,
    hasUserData,
    selectedEdition,
    hasSelectedEdition,
  };
}

/**
 * Hook personalizado para obtener los datos de visualización de un libro
 * Maneja la lógica de qué título e imagen mostrar basado en la edición seleccionada
 * @param book El libro del que obtener los datos de visualización
 * @returns Objeto con los datos de visualización procesados
 */
export function useBookDisplay(book: HardcoverBook): BookDisplayData | null {
  return useMemo(() => {
    return getBookDisplayData(book);
  }, [book]);
}
