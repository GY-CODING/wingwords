'use client';

import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import HardcoverBook from '@/domain/HardcoverBook';
import { useFriendsActivityFeed } from '@/hooks/activities/useFriendsActivityFeed';
import useLibrary from '@/hooks/books/useLibrary';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { useUserQuote } from '@/hooks/useUserQuote';
import { EBookStatus } from '@gycoding/nebula';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { DashboardView } from './components/DashboardView';

/**
 * Dashboard Page - Componente padre optimizado
 *
 * Centraliza todas las peticiones de datos:
 * - useMergedBooksIncremental: obtiene todos los libros del usuario
 * - useFriendsActivityFeed: obtiene actividades de amigos
 *
 * Calcula stats en memoria y pasa datos por props a componentes hijos
 */
export default function DashboardPage() {
  const { user, isLoading: userLoading } = useGyCodingUser();
  const router = useRouter();

  // 🚀 PETICIÓN 1: Libros del usuario (usa Redux cache con TTL de 5 min)
  const { data: books = [], isLoading: booksLoading } = useLibrary(user?.id);

  // 🚀 PETICIÓN 2: Feed de actividades de amigos (optimizado con JOIN)
  const {
    activities,
    isLoading: activitiesLoading,
    loadMore: activitiesLoadMore,
    hasNext: activitiesHasNext,
    isLoadingMore: activitiesLoadingMore,
  } = useFriendsActivityFeed();

  // 🚀 PETICIÓN 3: Solo la quote (sin cargar datos de HardcoverBatch)
  const { quote } = useUserQuote(user?.id || '');

  // 📊 Calcular libros actualmente en lectura
  const currentlyReadingBooks = useMemo<HardcoverBook[]>(() => {
    if (!books || books.length === 0) return [];

    return books.filter((book) => {
      const displayData = getBookDisplayData(book);
      return displayData?.status === EBookStatus.READING;
    });
  }, [books]);

  // 📊 Calcular stats en memoria (evita peticiones adicionales)
  const stats = useMemo(() => {
    const totalBooks = books.length;

    const booksRead = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      return displayData?.status === EBookStatus.READ;
    }).length;

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    // Calcular libros leídos este año
    const booksReadThisYear = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      if (displayData?.status !== EBookStatus.READ) return false;

      const finishedAt = book.userData?.endDate;
      if (!finishedAt) return false;

      const finishedYear = new Date(finishedAt).getFullYear();
      return finishedYear === currentYear;
    }).length;

    // Calcular libros leídos el año pasado
    const booksReadLastYear = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      if (displayData?.status !== EBookStatus.READ) return false;

      const finishedAt = book.userData?.endDate;
      if (!finishedAt) return false;

      const finishedYear = new Date(finishedAt).getFullYear();
      return finishedYear === lastYear;
    }).length;

    // Determinar qué año y cantidad mostrar
    const displayYear = booksReadThisYear > 0 ? currentYear : lastYear;
    const booksReadInDisplayYear =
      booksReadThisYear > 0 ? booksReadThisYear : booksReadLastYear;
    return {
      totalBooks,
      booksRead,
      booksReadThisYear: booksReadInDisplayYear,
      displayYear,
    };
  }, [books]);

  // Redirect if no user
  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  return (
    <DashboardView
      user={user ?? undefined}
      userLoading={userLoading}
      quote={quote}
      currentlyReadingBooks={currentlyReadingBooks}
      booksLoading={booksLoading}
      activities={activities}
      activitiesLoading={activitiesLoading}
      activitiesLoadMore={activitiesLoadMore}
      activitiesHasNext={activitiesHasNext}
      activitiesLoadingMore={activitiesLoadingMore}
      stats={stats}
    />
  );
}
