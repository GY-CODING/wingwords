'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { FriendActivity } from '@/hooks/activities/useFriendsActivityFeed';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { CurrentlyReadingMobile } from '../CurrentlyReadingSection/CurrentlyReadingMobile';
import { FriendsActivityMobileFeed } from '../FriendsActivityFeed/FriendsActivityMobileFeed';
import { ReadingStatsMini } from '../ReadingStatsCards/ReadingStatsMini';

const MotionBox = motion(Box);

interface DashboardMobileProps {
  /** Libros que el usuario está leyendo actualmente */
  currentlyReadingBooks: HardcoverBook[];
  booksLoading: boolean;
  /** Actividades de amigos */
  activities: FriendActivity[];
  activitiesLoading: boolean;
  /** Stats */
  totalBooks: number;
  booksRead: number;
  booksReadThisYear: number;
  displayYear: number;
  /** User */
  currentUserId?: string;
}

/**
 * Layout completo del dashboard para mobile.
 *
 * Organiza verticalmente:
 * 1. Currently Reading (card horizontal compacta)
 * 2. Reading Stats (3 mini cards en fila)
 * 3. Friends Activity Feed (items con likes)
 *
 * Diseño minimalista Apple-like sobre fondo oscuro.
 */
export const DashboardMobile = React.memo<DashboardMobileProps>(
  ({
    currentlyReadingBooks,
    booksLoading,
    activities,
    activitiesLoading,
    totalBooks,
    booksRead,
    booksReadThisYear,
    displayYear,
    currentUserId,
  }) => {
    const { t } = useTranslation();
    return (
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Section 1: Currently Reading */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SectionHeader title={t('dashboard.section.currentlyReading')} />
          <CurrentlyReadingMobile
            books={currentlyReadingBooks}
            isLoading={booksLoading}
          />
        </MotionBox>

        {/* Section 2: Reading Stats */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <SectionHeader title={t('dashboard.section.stats')} />
          <ReadingStatsMini
            totalBooks={totalBooks}
            booksRead={booksRead}
            booksReadThisYear={booksReadThisYear}
            displayYear={displayYear}
            isLoading={booksLoading}
          />
        </MotionBox>

        {/* Section 3: Friends Activity Feed */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
        >
          <SectionHeader title={t('dashboard.section.friendsActivity')} />
          <FriendsActivityMobileFeed
            activities={activities}
            isLoading={activitiesLoading}
            currentUserId={currentUserId}
          />
        </MotionBox>
      </Box>
    );
  }
);

DashboardMobile.displayName = 'DashboardMobile';

/**
 * Header de sección minimalista.
 */
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Typography
    sx={{
      fontFamily: lora.style.fontFamily,
      fontSize: '0.8rem',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.45)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      mb: 1,
    }}
  >
    {title}
  </Typography>
);
