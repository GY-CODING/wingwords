'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { FriendActivity } from '@/hooks/activities/useFriendsActivityFeed';
import { lora } from '@/utils/fonts/fonts';
import {
  Avatar,
  Box,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MotionConfig, motion } from 'framer-motion';
import React from 'react';
import { DURATION, EASE_OUT } from '../../motion/tokens';
import { CurrentlyReadingSection } from '../CurrentlyReadingSection/CurrentlyReadingSection';
import { DashboardMobile } from '../DashboardMobile';
import { FriendsActivityFeed } from '../FriendsActivityFeed/FriendsActivityFeed';
import { QuickActions } from '../QuickActions/QuickActions';
import { ReadingStatsCards } from '../ReadingStatsCards/ReadingStatsCards';
import { TranslationBanner } from '../TranslationBanner/TranslationBanner';

export interface DashboardStats {
  totalBooks: number;
  booksRead: number;
  booksReadThisYear: number;
  displayYear: number;
}

export interface DashboardViewProps {
  user?: { id?: string; username?: string; picture?: string };
  userLoading: boolean;
  quote?: string;
  currentlyReadingBooks: HardcoverBook[];
  booksLoading: boolean;
  activities: FriendActivity[];
  activitiesLoading: boolean;
  activitiesLoadMore?: () => void;
  activitiesHasNext?: boolean;
  activitiesLoadingMore?: boolean;
  stats: DashboardStats;
}

const glassCard = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: 2,
  border: '1px solid rgba(255, 255, 255, 0.06)',
  textAlign: 'center',
} as const;

const UserCompactCardSkeleton: React.FC = () => (
  <Paper sx={glassCard}>
    <Skeleton
      variant="circular"
      width={70}
      height={70}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', margin: '0 auto', mb: 1.5 }}
    />
    <Skeleton
      variant="text"
      width="80%"
      height={24}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', margin: '0 auto' }}
    />
  </Paper>
);

const AVATAR = 70;
const RING = AVATAR + 12;
const RING_R = RING / 2 - 1.5;

/**
 * Tarjeta del usuario. El aro morado del avatar se dibuja al entrar
 * (en vez de un borde fijo) y la frase aparece después del nombre.
 */
const UserCompactCard: React.FC<{
  username?: string;
  picture?: string;
  quote?: string;
  isLoading: boolean;
}> = ({ username, picture, quote, isLoading }) => {
  if (isLoading) return <UserCompactCardSkeleton />;
  if (!username || !picture) return null;

  return (
    <Paper
      sx={{
        ...glassCard,
        transition: `border-color ${DURATION.base}s, background-color ${DURATION.base}s`,
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.04)',
        },
        '&:hover .avatar-ring': { opacity: 1 },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: RING,
          height: RING,
          margin: '0 auto',
          mb: 1.25,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg
          aria-hidden
          className="avatar-ring"
          width={RING}
          height={RING}
          viewBox={`0 0 ${RING} ${RING}`}
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'rotate(-90deg)',
            opacity: 0.85,
            transition: `opacity ${DURATION.base}s`,
          }}
        >
          <defs>
            <linearGradient id="ww-avatar-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
          <circle
            cx={RING / 2}
            cy={RING / 2}
            r={RING_R}
            fill="none"
            stroke="rgba(147, 51, 234, 0.18)"
            strokeWidth={1.5}
          />
          <motion.circle
            cx={RING / 2}
            cy={RING / 2}
            r={RING_R}
            fill="none"
            stroke="url(#ww-avatar-ring)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DURATION.focal, ease: EASE_OUT }}
          />
        </svg>
        <motion.div whileHover={{ scale: 1.04 }}>
          <Avatar
            src={picture}
            alt={username}
            sx={{ width: AVATAR, height: AVATAR }}
          />
        </motion.div>
      </Box>
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
        <Box>
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.75rem',
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.7)',
              px: 1,
              lineHeight: 1.4,
              textWrap: 'pretty',
            }}
          >
            &quot;{quote}&quot;
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

/**
 * Vista del dashboard: solo pinta, no pide datos (eso lo hace `page.tsx`).
 *
 * `MotionConfig reducedMotion="user"` hace que, con movimiento reducido,
 * framer-motion quite los desplazamientos y escalas y deje los fundidos.
 */
export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  userLoading,
  quote,
  currentlyReadingBooks,
  booksLoading,
  activities,
  activitiesLoading,
  activitiesLoadMore,
  activitiesHasNext,
  activitiesLoadingMore,
  stats,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MotionConfig reducedMotion="user">
      <Box
        sx={{
          height: '100%',
          backgroundColor: 'transparent',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          p: 0,
        }}
      >
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
              {/* Izquierda: usuario + leyendo ahora */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <UserCompactCard
                  username={user?.username}
                  picture={user?.picture}
                  quote={quote}
                  isLoading={userLoading}
                />
                <CurrentlyReadingSection
                  books={currentlyReadingBooks}
                  isLoading={booksLoading}
                />
              </Box>

              {/* Centro: actividad de amigos */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: 2,
                  minHeight: 0,
                  boxSizing: 'border-box',
                }}
              >
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
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
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
              </Box>

              {/* Derecha: estadísticas y accesos */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ReadingStatsCards
                  totalBooks={stats.totalBooks}
                  booksRead={stats.booksRead}
                  booksReadThisYear={stats.booksReadThisYear}
                  displayYear={stats.displayYear}
                  isLoading={booksLoading}
                />
                <QuickActions />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </MotionConfig>
  );
};
