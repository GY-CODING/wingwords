'use client';

import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import HardcoverBook from '@/domain/HardcoverBook';
import { useFriendsActivityFeed } from '@/hooks/activities/useFriendsActivityFeed';
import useLibrary from '@/hooks/books/useLibrary';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { useUserQuote } from '@/hooks/useUserQuote';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import {
  Avatar,
  Box,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { CurrentlyReadingSection } from './components/CurrentlyReadingSection/CurrentlyReadingSection';
import { DashboardMobile } from './components/DashboardMobile';
import { FriendsActivityFeed } from './components/FriendsActivityFeed/FriendsActivityFeed';
import { QuickActions } from './components/QuickActions/QuickActions';
import { ReadingStatsCards } from './components/ReadingStatsCards/ReadingStatsCards';
import { TranslationBanner } from './components/TranslationBanner/TranslationBanner';

const MotionBox = motion(Box);

/**
 * Skeleton para el UserCompactCard
 */
const UserCompactCardSkeleton: React.FC = () => (
  <Paper
    sx={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: 2,
      border: '1px solid rgba(255, 255, 255, 0.06)',
      textAlign: 'center',
    }}
  >
    <Skeleton
      variant="circular"
      width={70}
      height={70}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        margin: '0 auto',
        mb: 1.5,
      }}
    />
    <Skeleton
      variant="text"
      width="80%"
      height={24}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        margin: '0 auto',
      }}
    />
  </Paper>
);

/**
 * Componente UserCompactCard optimizado
 */
interface UserCompactCardProps {
  username?: string;
  picture?: string;
  quote?: string;
  isLoading: boolean;
}

const UserCompactCard: React.FC<UserCompactCardProps> = ({
  username,
  picture,
  quote,
  isLoading,
}) => {
  if (isLoading) {
    return <UserCompactCardSkeleton />;
  }

  if (!username || !picture) {
    return null;
  }

  return (
    <Paper
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: 2,
        border: '1px solid rgba(255, 255, 255, 0.06)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.04)',
        },
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Avatar
          src={picture}
          alt={username}
          sx={{
            width: 70,
            height: 70,
            margin: '0 auto',
            mb: 1.5,
            border: '2px solid rgba(147, 51, 234, 0.3)',
          }}
        />
      </motion.div>
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: '1.1rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #ffffff 0%, #9333ea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 0.5,
        }}
      >
        {username}
      </Typography>
      {quote && (
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.75rem',
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 0,
            px: 1,
            lineHeight: 1.4,
          }}
        >
          &quot;{quote}&quot;
        </Typography>
      )}
    </Paper>
  );
};

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        p: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Translation banner */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 3, lg: 4 },
          pt: { xs: 1.5, sm: 2 },
        }}
      >
        <TranslationBanner />
      </Box>

      {/* Mobile Dashboard */}
      {isMobile ? (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <DashboardMobile
            currentlyReadingBooks={currentlyReadingBooks}
            booksLoading={booksLoading}
            activities={activities}
            activitiesLoading={activitiesLoading}
            totalBooks={stats.totalBooks}
            booksRead={stats.booksRead}
            booksReadThisYear={stats.booksReadThisYear}
            displayYear={stats.displayYear}
            currentUserId={user?.id}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1600px',
            margin: '0 auto',
            padding: { xs: 0, sm: 3, lg: 4 },
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* 3 Column Layout - Desktop */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '360px 1fr 320px',
              gap: 4,
              alignItems: 'start',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* LEFT COLUMN - User Profile & Currently Reading */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {/* User Compact Card */}
              <UserCompactCard
                username={user?.username}
                picture={user?.picture}
                quote={quote}
                isLoading={userLoading}
              />

              {/* Currently Reading - Desktop */}
              <CurrentlyReadingSection
                books={currentlyReadingBooks}
                isLoading={booksLoading}
              />
            </MotionBox>

            {/* CENTER COLUMN - Friends Activity Feed */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: 2,
                minHeight: 0,
                boxSizing: 'border-box',
              }}
            >
              {/* Friends Activity - Main content */}
              <Paper
                sx={{
                  background: 'transparent',
                  borderRadius: '20px',
                  padding: 3,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  minHeight: 0,
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    display: 'none',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  },
                }}
              >
                <FriendsActivityFeed
                  activities={activities}
                  isLoading={activitiesLoading}
                  currentUserId={user?.id}
                  loadMore={activitiesLoadMore}
                  hasNext={activitiesHasNext}
                  isLoadingMore={activitiesLoadingMore}
                />
              </Paper>
            </MotionBox>

            {/* RIGHT COLUMN - Stats & Actions */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {/* Stats Cards */}
              <ReadingStatsCards
                totalBooks={stats.totalBooks}
                booksRead={stats.booksRead}
                booksReadThisYear={stats.booksReadThisYear}
                displayYear={stats.displayYear}
                isLoading={booksLoading}
              />

              {/* Quick Actions */}
              <QuickActions />
            </MotionBox>
          </Box>
        </Box>
      )}
    </Box>
  );
}
