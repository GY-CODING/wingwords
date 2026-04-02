'use client';
import type HardcoverBook from '@/domain/HardcoverBook';
import { useStats } from '@/hooks/useStats';
import { useStatsFromBooks } from '@/hooks/useStatsFromBooks';
import { useTranslation } from '@/hooks/useTranslation';
import { RootState } from '@/store';
import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { useSelector } from 'react-redux';
import StatCard from '../atoms/StatCard/StatCard';
import AuthorsBarChart from '../molecules/AuthorsBarChart';
import AvgReadingDays from '../molecules/AvgReadingDays';
import BooksReadThisYear from '../molecules/BooksReadThisYear';
import DonutChart from '../molecules/DonutChart';
import MonthlyActivitySparkline from '../molecules/MonthlyActivitySparkline';
import PageCountKPI from '../molecules/PageCountKPI';
import RatingStats from '../molecules/RatingStats';
import ReadingHighlights from '../molecules/ReadingHighlights';
import ReadingRadar from '../molecules/ReadingRadar';
import StatsSkeleton from '../molecules/StatsSkeleton';

interface StatsComponentProps {
  id: UUID;
  books?: HardcoverBook[];
  booksLoading?: boolean;
}

/**
 * Componente de estadísticas optimizado.
 *
 * Calcula stats de dos formas (en orden de prioridad):
 * 1. Si recibe `books` como prop, calcula stats en memoria (rápido)
 * 2. Si no, usa el hook `useStats` tradicional (fetch al backend)
 *
 * También integra Redux para cachear stats del usuario actual.
 */
export default function StatsComponent({
  id,
  books,
  booksLoading = false,
}: StatsComponentProps) {
  const storedStats = useSelector((state: RootState) => state.stats);
  const { t } = useTranslation();
  const isCurrentUser = storedStats.userId === id.toString();

  // Hook de stats desde libros (si están disponibles)
  const statsFromBooks = useStatsFromBooks(books, booksLoading);

  // Hook de stats desde API (fallback) - SOLO si books NO se pasó como prop
  // Si books es undefined, hacer fetch. Si es array (vacío o no), usar statsFromBooks
  const shouldFetchFromAPI = books === undefined;
  const statsFromAPI = useStats(shouldFetchFromAPI ? id : null);

  // Decidir qué fuente usar (prioridad: Redux > books prop > API)
  const data =
    isCurrentUser && storedStats.data
      ? storedStats.data
      : books !== undefined
        ? statsFromBooks.data
        : statsFromAPI.data;

  const isLoading =
    isCurrentUser && storedStats.data
      ? storedStats.isLoading
      : books !== undefined
        ? statsFromBooks.isLoading || booksLoading
        : statsFromAPI.isLoading;

  const error =
    isCurrentUser && storedStats.data
      ? storedStats.error
        ? new Error(storedStats.error)
        : null
      : books !== undefined
        ? statsFromBooks.error
        : statsFromAPI.error;

  // Mostrar skeleton SOLO cuando está cargando
  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 100, 100, 0.8)',
            fontFamily: lora.style.fontFamily,
            fontSize: 18,
          }}
        >
          {t('stats.error', { message: error.message })}
        </Typography>
      </Box>
    );
  }

  // Verificar que tengamos datos válidos
  const hasValidData =
    data &&
    (data.totalBooks > 0 ||
      Object.keys(data.authors || {}).length > 0 ||
      Object.keys(data.bookStatus || {}).length > 0);

  if (!hasValidData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: lora.style.fontFamily,
            fontSize: 18,
          }}
        >
          {t('stats.empty')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <StatCard title={t('stats.ratingStats')} delay={0.1}>
        <RatingStats
          ratings={
            data?.ratings || {
              distribution: {},
              averageRating: 0,
              totalRatedBooks: 0,
            }
          }
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      {data.bookStatus && Object.keys(data.bookStatus).length > 0 && (
        <StatCard title={t('stats.bookStatus')} delay={0.2}>
          <DonutChart bookStatus={data?.bookStatus} />
        </StatCard>
      )}
      <StatCard title={t('stats.pageCount')} delay={0.3}>
        <PageCountKPI
          totalPages={data?.totalPages || 0}
          wantToReadPages={data?.wantToReadPages || 0}
          bookStatus={data?.bookStatus || {}}
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      <StatCard title={t('stats.readerDna')} delay={0.4}>
        <ReadingRadar
          readingCompletionRate={data?.readingCompletionRate || 0}
          reviewedBooks={data?.reviewedBooks || 0}
          ratedBooks={data?.ratings?.totalRatedBooks || 0}
          uniqueAuthors={Object.keys(data?.authors || {}).length}
          seriesTracked={data?.seriesTracked || 0}
          booksReadThisYear={data?.booksReadThisYear || 0}
          readCount={data?.bookStatus?.['READ'] || 0}
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      <StatCard title={t('stats.booksThisYear')} delay={0.5}>
        <BooksReadThisYear
          booksReadThisYear={data?.booksReadThisYear || 0}
          booksReadLastYear={data?.booksReadLastYear || 0}
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      <StatCard title={t('stats.monthlyActivity')} delay={0.6}>
        <MonthlyActivitySparkline
          monthlyBooksRead={data?.monthlyBooksRead || Array(12).fill(0)}
          booksReadThisYear={data?.booksReadThisYear || 0}
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      <StatCard title={t('stats.readingPace')} delay={0.7}>
        <AvgReadingDays
          avgReadingDays={data?.avgReadingDays || 0}
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      <StatCard title={t('stats.readingHighlights')} delay={0.8}>
        <ReadingHighlights
          readingCompletionRate={data?.readingCompletionRate || 0}
          reviewedBooks={data?.reviewedBooks || 0}
          seriesTracked={data?.seriesTracked || 0}
          longestBook={data?.longestBook || null}
          totalBooks={data?.totalBooks || 0}
          fontFamily={lora.style.fontFamily}
        />
      </StatCard>
      {data.authors && Object.keys(data.authors).length > 0 && (
        <StatCard title={t('stats.authorsRead')} delay={0.9}>
          <AuthorsBarChart authors={data?.authors} />
        </StatCard>
      )}
    </Box>
  );
}
